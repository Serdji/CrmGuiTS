using Crm.Seb.Models.Response;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using MongoDB.Bson;

namespace Crm.Seb2
{
    class SebManager
    {
        private int constErrorDelayInMinutes = 1;
        
        private readonly Logger log = LogManager.GetCurrentClassLogger();
        private ServiceSettings ss = ServiceSettings.Instance;

        private MongoClient mongoClient;
        private IMongoDatabase dbSeb;

        private List<DateRange> rangesToProcess;
        private List<DateRange> rangesInProcess;

        private List<Transaction> transactionsToProcess;
        private List<Transaction> transactionsInProcess;
        private SebGatewayClient sebGatewayClient;

        public int TransactionsToProcessCount { get => transactionsToProcess.Count; }
        public int TransactionsInProcessCount { get => transactionsInProcess.Count; }
        public int TransactionsDelayedCount { get => transactionsToProcess.Except(transactionsInProcess).ToList()
                                                .Where(t => t.LastTryDT.AddMinutes(constErrorDelayInMinutes) > DateTime.Now).Count(); }

        public SebManager()
        {
            mongoClient = new MongoClient(ss.MongoDBConnectionString);
            string databaseName = MongoUrl.Create(ss.MongoDBConnectionString).DatabaseName;
            dbSeb = mongoClient.GetDatabase(string.IsNullOrEmpty(databaseName) ? "seb" : databaseName);

            rangesToProcess = new List<DateRange>();
            rangesInProcess = new List<DateRange>();

            transactionsToProcess = new List<Transaction>();
            transactionsInProcess = new List<Transaction>();

            sebGatewayClient = new SebGatewayClient();
        }

        public void AddRangeToProcess(DateRange range)
        {
            if (range == null) return;

            lock (rangesToProcess)
            {
                rangesInProcess.RemoveAll(t => t.Equals(range));
                if (!rangesToProcess.Exists(t => t.Equals(range)))
                {
                    rangesToProcess.Add(range);
                }
            }
        }

        private void AddTransactionsToProcess(IEnumerable<Transaction> transactions)
        {
            if (transactions == null) return;

            lock (transactionsToProcess)
            {
                transactionsInProcess.RemoveAll(t => transactions.Any(tr => t.Id == tr.Id));
                transactionsToProcess.AddRange(transactions.Except(transactionsToProcess));
            }
        }

        private DateRange PrepareRangeToProcess()
        {
            lock (transactionsToProcess)
            {
                var range = rangesToProcess.Except(rangesInProcess)
                    .OrderBy(t => t.LastTryDT)
                    .FirstOrDefault(t => t.LastTryDT.AddMinutes(constErrorDelayInMinutes) <= DateTime.Now);
                if (range != null)
                {
                    range.LastTryDT = DateTime.Now;
                    range.TryCount += 1;

                    rangesInProcess.Add(range);
                }
                return range;
            }
        }

        private IEnumerable<Transaction> PrepareTransactionsToProcess(int topN)
        {
            lock (transactionsToProcess)
            {
                var transactions = transactionsToProcess.Except(transactionsInProcess)
                                .Where(t => t.LastTryDT.AddMinutes(constErrorDelayInMinutes) <= DateTime.Now)
                                .OrderBy(t => t.LastTryDT)
                                .Take(topN).ToList();


                transactions.ForEach(t => { t.LastTryDT = DateTime.Now; t.TryCount += 1; });

                transactionsInProcess.AddRange(transactions);

                return transactions;
            }
        }

        private void FinishRange(DateRange range)
        {
            if (range == null) return;

            lock (rangesToProcess)
            {
                rangesToProcess.RemoveAll(t => t.Equals(range));
                rangesInProcess.RemoveAll(t => t.Equals(range));
            }
        }

        private async Task FinishTransactionsAsync(IEnumerable<TransactionDetail> transactionsDetail, CancellationToken cancellationToken)
        {
            if (transactionsDetail == null) return;

            try
            {
                await SaveTransactionsDetailAsync(transactionsDetail, cancellationToken);

                lock (transactionsToProcess)
                {
                    transactionsToProcess.RemoveAll(t => transactionsDetail.Any(td => t.Id == td.Id));
                    transactionsInProcess.RemoveAll(t => transactionsDetail.Any(td => t.Id == td.Id));
                }
            }
            catch (Exception e)
            {
                lock (transactionsToProcess)
                    transactionsInProcess.RemoveAll(t => transactionsDetail.Any(td => t.Id == td.Id));
                log.Error(e.Message);
                throw e;
            }

        }

        private async Task SaveTransactionsDetailAsync(IEnumerable<TransactionDetail> transactionsDetail, CancellationToken cancellationToken)
        {
            if (transactionsDetail == null) return;

            foreach (var td in transactionsDetail)
            {
                dynamic data = JObject.Parse(td.Data);
                string airline = data.Reclocs.Airline[0];

                // Filtering only necessary aircompanies.
                var airlineSettings = ss.Airlines.FirstOrDefault(a => a.Code == airline);
                if (airlineSettings != null)
                {
                    //await WriteToFileAsync(airlineSettings.Path, transactionDetailRsp, td.Data, cancellationToken);
                    await WriteToMongoAsync(td.Data, cancellationToken);
                };
            }
        }

        private async Task WriteToMongoAsync(string json, CancellationToken cancellationToken)
        {
            DateTime date = DateTime.Now;
            dynamic data = JObject.Parse(json);

            string airline = data.Reclocs.Airline[0];

            data.SebServiceInfo = new JObject() as dynamic;
            data.SebServiceInfo.CreateDate = DateTime.Now;

            var collection = dbSeb.GetCollection<BsonDocument>(airline);

            string updatedJson = (data as JObject).ToString(Formatting.None);
            var bsonDocument = BsonDocument.Parse(updatedJson);

            await collection.InsertOneAsync(bsonDocument, new InsertOneOptions { BypassDocumentValidation = true }, cancellationToken);
        }

        private async Task WriteToFileAsync(string path, string json, CancellationToken cancellationToken)
        {
            try
            {
                DateTime date = DateTime.Now;
                dynamic data = JObject.Parse(json);

                string airline = data.Reclocs.Airline[0];
                string recloc = data.Reclocs.Local;
                string version = data.Transaction.Version;

                string fileName = String.Format("{0}-{1}-{2}"
                            , (!String.IsNullOrWhiteSpace(airline)) ? airline : "SEB"
                            , (!String.IsNullOrWhiteSpace(recloc)) ? recloc : "recloc"
                            , (!String.IsNullOrWhiteSpace(version)) ? version : "version");

                // Create directory
                var currentFolder = String.Format("{0}/{1:yyyy}/{2:MM}/{3:dd}/{4:HH}/{5:mm}"
                                    , path
                                    , date, date, date, date, date);
                System.IO.Directory.CreateDirectory(currentFolder);

                // Check if file exist
                var fullPath = String.Format("{0}/{1}.txt", currentFolder, fileName);
                if (File.Exists(fullPath))
                {
                    fullPath = String.Format("{0}/{1}.txt", currentFolder, fileName + "_" + DateTime.Now.GetHashCode());
                }

                //log.Debug(String.Format("File: {0}", fullPath));
                using (FileStream fileStream = new FileStream(fullPath, FileMode.OpenOrCreate))
                {
                    byte[] msgBytes = System.Text.Encoding.UTF8.GetBytes(json);
                    await fileStream.WriteAsync(msgBytes, 0, msgBytes.Length, cancellationToken);
                }
            }
            catch (Exception e)
            {
                log.Error(e.Message);
                throw e;
            }
        }

        public async Task GetTransactionsListAsync(CancellationToken cancellationToken)
        {
            DateRange range = PrepareRangeToProcess();
            if (range != null)
            {
                try
                {
                    log.Trace("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}", range.DateStart, range.DateEnd);

                    IEnumerable<Transaction> transactions = await sebGatewayClient.GetTransactionsListAsync(range, cancellationToken);

                    if (transactions != null)
                    {
                        AddTransactionsToProcess(transactions);
                        FinishRange(range);

                        log.Trace("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; received: {2}; ids: {3}"
                                    , range.DateStart, range.DateEnd
                                    , transactions.ToList().Count, string.Join(",", transactions.Select(t => t.Id)));
                    } else
                    {
                        AddRangeToProcess(range);
                    }
                }
                catch (Exception e)
                {
                    log.Error("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; error: {2}"
                                , range.DateStart, range.DateEnd, e.Message);
                    AddRangeToProcess(range);
                    throw e;
                }
            }
        }

        public async Task GetTransactionsDetailAsync(int topN, CancellationToken cancellationToken)
        {
            IEnumerable<Transaction> transactions = PrepareTransactionsToProcess(topN);

            if (transactions.Count() > 0)
            {
                log.Trace("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id)));
                try
                {
                    IEnumerable<TransactionDetail> transactionsDetail = await sebGatewayClient.GetTransactionsDetailAsync(transactions, cancellationToken);
                     
                    if (transactionsDetail != null)
                    {
                        await FinishTransactionsAsync(transactionsDetail, cancellationToken);
                        AddTransactionsToProcess(transactions.Where(t => !transactionsDetail.Any(td => td.Id == t.Id)));

                        log.Trace("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; received: {2}"
                                        , transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                                        , transactionsDetail.ToList().Count);
                    }
                    else
                    {
                        AddTransactionsToProcess(transactions);
                    }
                }
                catch (Exception e)
                {
                    AddTransactionsToProcess(transactions);
                    log.Error("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; error: {2}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id)
                        , e.Message));
                    throw e;
                }
            }
        }
    }
}
