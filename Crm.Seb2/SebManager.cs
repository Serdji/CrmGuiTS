using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Crm.Seb2
{
    class SebManager
    {
        private readonly Logger log = LogManager.GetCurrentClassLogger();

        private List<DateRange> rangesToProcess;
        private List<DateRange> rangesInProcess;

        private List<Transaction> transactionsToProcess;
        private List<Transaction> transactionsInProcess;
        private SebGatewayClient sebGatewayClient;

        public int TransactionsToProcessCount { get => transactionsToProcess.Count; }

        public SebManager(string url, string proxy)
        {
            rangesToProcess = new List<DateRange>();
            rangesInProcess = new List<DateRange>();

            transactionsToProcess = new List<Transaction>();
            transactionsInProcess = new List<Transaction>();

            sebGatewayClient = new SebGatewayClient(url, proxy);
        }

        public void AddRangeToProcess(DateRange range)
        {
            rangesInProcess.RemoveAll(t => t.Equals(range));
            rangesToProcess.Add(range);
        }

        private void AddTransactionsToProcess(IEnumerable<Transaction> transactions)
        {
            transactionsInProcess.RemoveAll(t => transactions.Any(tr => t.Id == tr.Id));
            transactionsToProcess.AddRange(transactions);
        }

        private DateRange PrepareRangeToProcess()
        {
            var range = rangesToProcess.Except(rangesInProcess).FirstOrDefault();

            rangesInProcess.Add(range);

            return range;
        }

        private IEnumerable<Transaction> PrepareTransactionsToProcess(int topN)
        {
            var transactions = transactionsToProcess.Except(transactionsInProcess).Take(topN).ToList();

            transactionsInProcess.AddRange(transactions);

            return transactions;
        }

        private void FinishRange(DateRange range)
        {
            rangesToProcess.RemoveAll(t => t.Equals(range));
            rangesInProcess.RemoveAll(t => t.Equals(range));
        }

        private void FinishTransactions(IEnumerable<TransactionDetail> TransactionDetails)
        {
            transactionsToProcess.RemoveAll(t => TransactionDetails.Any(td => t.Id == td.Id));
            transactionsInProcess.RemoveAll(t => TransactionDetails.Any(td => t.Id == td.Id));
        }

        public async Task GetTransactionsListAsync(CancellationToken cancellationToken)
        {
            DateRange range = PrepareRangeToProcess();

            log.Trace("transactions/list date_start: {0}; date_end: {1}", range.DateStart, range.DateEnd);
            try
            {
                IEnumerable<Transaction> rangeTransactions = await sebGatewayClient.GetTransactionsListAsync(range, cancellationToken);

                log.Info("transactions/list date_start: {0}; date_end: {1}; count: {2}", range.DateStart, range.DateEnd
                    , rangeTransactions.ToList().Count);

                AddTransactionsToProcess(rangeTransactions);
                FinishRange(range);
            }
            catch
            {
                AddRangeToProcess(range);
                log.Info("transactions/list date_start: {0}; date_end: {1}; Retry!", range.DateStart, range.DateEnd);
                throw;
            }           
        }

        public async Task GetTransactionsDetailAsync(int topN, CancellationToken cancellationToken)
        {
            IEnumerable<Transaction> transactions = PrepareTransactionsToProcess(topN);

            if (transactions.Count() > 0)
            {
                log.Trace("transactions/detail. count: {0}; idlist: {1}", transactions.Count(), string.Join(",", transactions.Any()));
                try
                {

                    IEnumerable<TransactionDetail> transactionsDetail = await sebGatewayClient.GetTransactionsDetailAsync(transactions, cancellationToken);
                    FinishTransactions(transactionsDetail);

                    log.Info("transactions/detail. count: {0}; idlist: {1}; received: {2}", transactions.Count(), string.Join(",", transactions.Any())
                        , transactionsDetail.ToList().Count);
                }
                catch
                {
                    AddTransactionsToProcess(transactions);
                    log.Error("transactions/detail. count: {0}; idlist: {1}; Retry!", transactions.Count(), string.Join(",", transactions.Any()));
                    throw;
                }
            }
        }
    }
}
