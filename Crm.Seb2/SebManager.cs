using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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
        private IMongoCollection<SebManagerConfig> configCollection;
        private IMongoCollection<Transaction> transactionsCollection;

        public DateTime dateStart;

        private SebGatewayClient sebGatewayClient;

        public long TransactionsCount
        {
            get
            {
                return transactionsCollection.Count<Transaction>(t => true);
            }
        }

        public long TransactionsToProcessCount
        {
            get
            {
                return transactionsCollection.Count<Transaction>(t => t.InProcess == false);
            }
        }

        public long TransactionsInProcessCount
        {
            get
            {
                return transactionsCollection.Count<Transaction>(t => t.InProcess == true);
            }
        }

        public long TransactionsDelayedCount
        {
            get
            {
                return transactionsCollection.Count<Transaction>(t => t.InProcess == false
                                                                        && t.LastTryDT > DateTime.Now.AddMinutes(-(constErrorDelayInMinutes)));
            }
        }

        public SebManager()
        {
            mongoClient = new MongoClient(ss.MongoDB.ConnectionString);
            string databaseName = MongoUrl.Create(ss.MongoDB.ConnectionString).DatabaseName;
            dbSeb = mongoClient.GetDatabase(string.IsNullOrEmpty(databaseName) ? "seb" : databaseName);

            mainCollection = dbSeb.GetCollection<BsonDocument>(ss.MongoDB.MainCollectionName);
            configCollection = dbSeb.GetCollection<SebManagerConfig>(string.Concat(ss.MongoDB.ServiceCollectionPrefix, "config"));
            transactionsCollection = dbSeb.GetCollection<Transaction>(string.Concat(ss.MongoDB.ServiceCollectionPrefix, "transaction"));
            InitServiceCollections();
            InitDateStart();

            sebGatewayClient = new SebGatewayClient();
        }

        private void InitServiceCollections()
        {
            transactionsCollection.UpdateMany(filter: t => t.InProcess
                                                , update: Builders<Transaction>.Update.Set(t => t.InProcess, false));
        }

        private void InitDateStart()
        {
            dateStart = ss.DateStart;

            SebManagerConfig config = configCollection.Find(d => true).FirstOrDefault();
            if (config != null)
                dateStart = config.dateStart;
            log.Info("DateStart: {0}", dateStart);
        }

        public async Task<DateTime> IncDateStart(CancellationToken cancellationToken)
        {
            dateStart = dateStart.AddMinutes(ss.SebGateway.RangeInMinutes);
            var config = new SebManagerConfig();
            config.dateStart = dateStart;

            await configCollection.ReplaceOneAsync(filter: c => true
                                                      , replacement: config
                                                      , options: new UpdateOptions { IsUpsert = true }
                                                      , cancellationToken: cancellationToken);
            return dateStart;
        }

        private async Task AddTransactionsToProcessAsync(IEnumerable<Transaction> transactions, CancellationToken cancellationToken)
        {
            if (transactions == null) return;

            foreach (var transaction in transactions)
            {
                transaction.InProcess = false;
                try
                {
                    await transactionsCollection.InsertOneAsync(document: transaction
                                                            , cancellationToken: cancellationToken);
                }
                catch (MongoWriteException e)
                {
                    if (e.WriteError.Category != ServerErrorCategory.DuplicateKey)
                        throw e;
                }
            }
        }

        private async Task ReturnTransactionsToProcessAsync(IEnumerable<Transaction> transactions, CancellationToken cancellationToken)
        {
            if (transactions == null) return;

            foreach (var transaction in transactions)
            {
                await transactionsCollection.UpdateOneAsync(filter: t => t.Id == transaction.Id
                                                        , update: Builders<Transaction>.Update.Set(t => t.InProcess, false)
                                                        , options: new UpdateOptions { IsUpsert = true }
                                                        , cancellationToken: cancellationToken);
            };
        }

        private async Task<IEnumerable<Transaction>> PrepareTransactionsToProcessAsync(int transactionInBatchLimit, CancellationToken cancellationToken)
        {
            var transactions = new List<Transaction>();
            Transaction transaction = null;

            while (transactions.Count < transactionInBatchLimit)
            {
                transaction = await transactionsCollection.FindOneAndUpdateAsync<Transaction>
                                                        (filter: t => t.InProcess == false
                                                                && t.LastTryDT <= DateTime.Now.AddMinutes(-(constErrorDelayInMinutes))
                                                        , update: Builders<Transaction>.Update.Set(t => t.LastTryDT, DateTime.Now)
                                                                                            .Inc(t => t.TryCount, 1)
                                                                                            .Set(t => t.InProcess, true)
                                                        , options: new FindOneAndUpdateOptions<Transaction>
                                                        {
                                                            ReturnDocument = ReturnDocument.After
                                                            ,
                                                            Sort = Builders<Transaction>.Sort.Descending(t => t.LastTryDT)
                                                        }
                                                        , cancellationToken: cancellationToken);
                if (transaction == null)
                    break;
                transactions.Add(transaction);
            };

            return transactions;
        }

        private async Task FinishTransactionsAsync(IEnumerable<TransactionDetail> transactionsDetail, CancellationToken cancellationToken)
        {
            if (transactionsDetail == null) return;

            try
            {
                await SaveTransactionsDetailAsync(transactionsDetail, cancellationToken);

                foreach (var td in transactionsDetail)
                    await transactionsCollection.DeleteOneAsync(filter: t => t.Id == td.Id
                                                                    , cancellationToken: cancellationToken);
            }
            catch (Exception e)
            {
                foreach (var td in transactionsDetail)
                    await transactionsCollection.UpdateOneAsync(filter: t => t.Id == td.Id
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
                //string airline = data.Reclocs.Airline[0];
                string airline = data.Vairline;

                // Filtering only necessary airlines.
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
            data.SebServiceInfo.CreateDate = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssZ");

            string updatedJson = (data as JObject).ToString(Formatting.None);
            var bsonDocument = BsonDocument.Parse(updatedJson);

            await mainCollection.ReplaceOneAsync(filter: new BsonDocument("_id", _id)
                , options: new UpdateOptions { IsUpsert = true
                                               , BypassDocumentValidation = true }
                , replacement: bsonDocument
                , cancellationToken: cancellationToken);
            /*try
            {
                await mainCollection.InsertOneAsync(document: bsonDocument
                    , options: new InsertOneOptions { BypassDocumentValidation = true }
                    , cancellationToken: cancellationToken);
            }
            catch (MongoWriteException e)
            {
                if (e.WriteError.Category == ServerErrorCategory.DuplicateKey)
                    log.Warn("Transaction already exists in main. id = {0}", _id);
                else
                    throw e;
            }*/
        }

        public async Task GetNextTransactionsListAsync(DateTime _dateStart, DateTime _dateEnd, CancellationToken cancellationToken)
        {
            try
            {
                log.Trace("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}", _dateStart, _dateEnd);

                IEnumerable<Transaction> transactions = await sebGatewayClient.GetTransactionsListAsync(_dateStart, _dateEnd, cancellationToken);

                if (transactions != null)
                {
                    await AddTransactionsToProcessAsync(transactions, cancellationToken);

                    log.Trace("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; received: {2}; ids: {3}"
                                , _dateStart, _dateEnd
                                , transactions.ToList().Count, string.Join(",", transactions.Select(t => t.Id)));
                }
            }
            catch (Exception e)
            {
                log.Error("SebManager.GetTransactionsListAsync. date_start: {0}; date_end: {1}; error: {2}"
                            , _dateStart, _dateEnd, e.Message);
                throw e;
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
                        await ReturnTransactionsToProcessAsync(transactions.Where(t => !transactionsDetail.Any(td => td.Id == t.Id)), cancellationToken);

                        log.Trace("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; received: {2}"
                                        , transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                                        , transactionsDetail.ToList().Count);
                    }
                    else
                    {
                        log.Warn("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; {2}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                            , "Return transactions to list to process");

                        await ReturnTransactionsToProcessAsync(transactions, cancellationToken);
                    }
                }
                catch (Exception e)
                {
                    await ReturnTransactionsToProcessAsync(transactions, cancellationToken);
                    log.Error("SebManager.GetTransactionsDetailAsync. requested: {0}; ids: {1}; error: {2}", transactions.Count(), string.Join(",", transactions.Select(t => t.Id))
                        , e.Message);
                    throw e;
                }
            }
        }
    }

    class SebManagerConfig
    {
        public int id = 0;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime dateStart;
    }
}
