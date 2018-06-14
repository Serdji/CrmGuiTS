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
        private IMongoCollection<BsonDocument> mainCollection;
        private IMongoCollection<DateRange> serviceRangesCollection;
        private IMongoCollection<Transaction> serviceTransactionsCollection;

        private SebGatewayClient sebGatewayClient;

        public long RangesToProcessCount
        {
            get
            {
                return serviceRangesCollection.Count<DateRange>(r => r.InProcess == false);
            }
        }

        public long RangesInProcessCount
        {
            get
            {
                return serviceRangesCollection.Count<DateRange>(r => r.InProcess == true);
            }
        }

        public long TransactionsToProcessCount
        {
            get
            {
                return serviceTransactionsCollection.Count<Transaction>(t => t.InProcess == false);
            }
        }

        public long TransactionsInProcessCount
        {
            get
            {
                return serviceTransactionsCollection.Count<Transaction>(t => t.InProcess == true);

            }
        }

        public long TransactionsDelayedCount
        {
            get
            {
                return serviceTransactionsCollection.Count<Transaction>(t => t.InProcess == false
                                                                        && t.LastTryDT > DateTime.Now.AddMinutes(-1 * constErrorDelayInMinutes));
            }
        }

        public SebManager()
        {
            mongoClient = new MongoClient(ss.MongoDB.ConnectionString);
            string databaseName = MongoUrl.Create(ss.MongoDB.ConnectionString).DatabaseName;
            dbSeb = mongoClient.GetDatabase(string.IsNullOrEmpty(databaseName) ? "seb" : databaseName);

            mainCollection = dbSeb.GetCollection<BsonDocument>(ss.MongoDB.MainCollectionName);
            serviceRangesCollection = dbSeb.GetCollection<DateRange>(string.Concat(ss.MongoDB.ServiceCollectionPrefix, "range"));
            serviceTransactionsCollection = dbSeb.GetCollection<Transaction>(string.Concat(ss.MongoDB.ServiceCollectionPrefix, "transaction"));
            InitServiceCollections();

            sebGatewayClient = new SebGatewayClient();

        }

        private void InitServiceCollections()
        {
            serviceRangesCollection.UpdateMany(filter: r => r.InProcess
                                                , update: Builders<DateRange>.Update.Set(r => r.InProcess, false));

            serviceTransactionsCollection.UpdateMany(filter: t => t.InProcess
                                                , update: Builders<Transaction>.Update.Set(t => t.InProcess, false));
        }

        public async Task AddRangeToProcessAsync(DateRange range, CancellationToken cancellationToken)
        {
            if (range == null) return;

            range.InProcess = false;
            await serviceRangesCollection.ReplaceOneAsync(filter: r => r.DateStart == range.DateStart
                                                                && r.DateEnd == range.DateEnd
                                                        , replacement: range
                                                        , options: new UpdateOptions { IsUpsert = true }
                                                        , cancellationToken: cancellationToken);
        }

        public async Task AddTransactionsToProcessAsync(IEnumerable<Transaction> transactions, CancellationToken cancellationToken)
        {
            if (transactions == null) return;

            foreach (var transaction in transactions)
            {
                transaction.InProcess = false;
                await serviceTransactionsCollection.ReplaceOneAsync(filter: t => t.Id == transaction.Id
                                                        , replacement: transaction
                                                        , options: new UpdateOptions { IsUpsert = true }
                                                        , cancellationToken: cancellationToken);
            };
        }

        private async Task<DateRange> PrepareRangeToProcessAsync(CancellationToken cancellationToken)
        {
            DateRange range = await serviceRangesCollection.FindOneAndUpdateAsync<DateRange>
                                                        (filter: r => r.InProcess == false
                                                                && r.LastTryDT <= DateTime.Now.AddMinutes(-1 * constErrorDelayInMinutes)
                                                        , update: Builders<DateRange>.Update.Set(r => r.LastTryDT, DateTime.Now)
                                                                                            .Inc(r => r.TryCount, 1)
                                                                                            .Set(r => r.InProcess, true)
                                                        , options: new FindOneAndUpdateOptions<DateRange>
                                                        {
                                                            ReturnDocument = ReturnDocument.After
                                                            , Sort = Builders<DateRange>.Sort.Descending(r => r.LastTryDT)
                                                        }
                                                        , cancellationToken: cancellationToken);
            return range;
        }

        private async Task<IEnumerable<Transaction>> PrepareTransactionsToProcessAsync(int transactionInBatchLimit, CancellationToken cancellationToken)
        {
            var transactions = new List<Transaction>();
            Transaction transaction = null;

            while (transactions.Count < transactionInBatchLimit)
            {
                transaction = await serviceTransactionsCollection.FindOneAndUpdateAsync<Transaction>
                                                        (filter: t => t.InProcess == false
                                                                && t.LastTryDT <= DateTime.Now.AddMinutes(-1 * constErrorDelayInMinutes)
                                                        , update: Builders<Transaction>.Update.Set(t => t.LastTryDT, DateTime.Now)
                                                                                            .Inc(t => t.TryCount, 1)
                                                                                            .Set(t => t.InProcess, true)
                                                        , options: new FindOneAndUpdateOptions<Transaction>
                                                        {
                                                            ReturnDocument = ReturnDocument.After
                                                            , Sort = Builders<Transaction>.Sort.Descending(t => t.LastTryDT)
                                                        }
                                                        , cancellationToken: cancellationToken);
                if (transaction == null)
                    break;
                transactions.Add(transaction);
            };

            return transactions;
        }

        private async Task FinishRangeAsync(DateRange range, CancellationToken cancellationToken)
        {
            if (range == null) return;

            await serviceRangesCollection.DeleteManyAsync(filter: r => r.DateStart == range.DateStart
                                                                && r.DateEnd == range.DateEnd
                                                          , cancellationToken: cancellationToken);
        }

        private async Task FinishTransactionsAsync(IEnumerable<TransactionDetail> transactionsDetail, CancellationToken cancellationToken)
        {
            if (transactionsDetail == null) return;

            try
            {
                await SaveTransactionsDetailAsync(transactionsDetail, cancellationToken);

                foreach (var td in transactionsDetail)
                    await serviceTransactionsCollection.DeleteOneAsync(filter: t => t.Id == td.Id
                                                                    , cancellationToken: cancellationToken);
            }
            catch (Exception e)
            {
                foreach (var td in transactionsDetail)
                    await serviceTransactionsCollection.UpdateOneAsync(filter: t => t.Id == td.Id
                                                        , update: Builders<Transaction>.Update.Set(t => t.InProcess, true)
                                                        , cancellationToken: cancellationToken);

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
                    await WriteToMongoAsync(td.Data, cancellationToken);
            }
        }

        private async Task WriteToMongoAsync(string json, CancellationToken cancellationToken)
        {
            DateTime date = DateTime.Now;
            dynamic data = JObject.Parse(json);

            Int64 _id = data.transaction.Id;
            data._id = _id;

            data.SebServiceInfo = new JObject() as dynamic;
            data.SebServiceInfo.CreateDate = DateTime.Now;            

            string updatedJson = (data as JObject).ToString(Formatting.None);
            var bsonDocument = BsonDocument.Parse(updatedJson);

            await mainCollection.ReplaceOneAsync(filter: new BsonDocument("_id", _id)
                , replacement: bsonDocument
                , options: new UpdateOptions { IsUpsert = true, BypassDocumentValidation = true }
                , cancellationToken: cancellationToken);

        }

        public async Task GetTransactionsListAsync(CancellationToken cancellationToken)
        {
            DateRange range = await PrepareRangeToProcessAsync(cancellationToken);
            if (range != null)
            {
                try
                {
                    log.Trace("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}", range.DateStart, range.DateEnd);

                    IEnumerable<Transaction> transactions = await sebGatewayClient.GetTransactionsListAsync(range, cancellationToken);

                    if (transactions != null)
                    {
                        await AddTransactionsToProcessAsync(transactions, cancellationToken);
                        await FinishRangeAsync(range, cancellationToken);

                        log.Trace("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; received: {2}; ids: {3}"
                                    , range.DateStart, range.DateEnd
                                    , transactions.ToList().Count, string.Join(",", transactions.Select(t => t.Id)));
                    } else
                    {
                        await AddRangeToProcessAsync(range, cancellationToken);
                    }
                }
                catch (OperationCanceledException e)
                {
                    log.Info("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; {2}"
                                , range.DateStart, range.DateEnd, e.Message);
                }
                catch (Exception e)
                {
                    log.Error("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; error: {2}"
                                , range.DateStart, range.DateEnd, e.Message);
                    await AddRangeToProcessAsync(range, cancellationToken);
                    throw e;
                }
            }
        }

        public async Task GetTransactionsDetailAsync(int transactionInBatchLimit, CancellationToken cancellationToken)
        {
            IEnumerable<Transaction> transactions = await PrepareTransactionsToProcessAsync(transactionInBatchLimit, cancellationToken);

            if (transactions.Count() > 0)
            {
                log.Trace("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id)));
                try
                {
                    IEnumerable<TransactionDetail> transactionsDetail = await sebGatewayClient.GetTransactionsDetailAsync(transactions, cancellationToken);
                     
                    if (transactionsDetail != null)
                    {
                        await FinishTransactionsAsync(transactionsDetail, cancellationToken);
                        await AddTransactionsToProcessAsync(transactions.Where(t => !transactionsDetail.Any(td => td.Id == t.Id)), cancellationToken);

                        log.Trace("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; received: {2}"
                                        , transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                                        , transactionsDetail.ToList().Count);
                    }
                    else
                    {
                        log.Warn("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; {2}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                            , "Return transactions to list to process" );

                        await AddTransactionsToProcessAsync(transactions, cancellationToken);
                    }
                }
                catch (OperationCanceledException e)
                {
                    log.Info("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; {2}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                        , e.Message);
                }
                catch (Exception e)
                {
                    await AddTransactionsToProcessAsync(transactions, cancellationToken);
                    log.Error("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; error: {2}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                        , e.Message);
                    throw e;
                }
            }
        }
    }
}
