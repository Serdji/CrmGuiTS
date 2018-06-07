using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using NLog;
using Crm.Seb.Models.Response;
using Crm.Seb.Models.Request;
using Newtonsoft.Json;
using System.Threading;

namespace Crm.Seb2
{
    class SebGatewayClient
    {
        private readonly Logger log = LogManager.GetCurrentClassLogger();
        private ServiceSettings ss = ServiceSettings.Instance;

        private System.Net.Http.HttpClient httpClient;    

        public SebGatewayClient()
        {
            if (!string.IsNullOrEmpty(ss.SebGateway.Proxy))
            {
                var httpClientHandler = new HttpClientHandler()
                {
                    Proxy = new WebProxy(ss.SebGateway.Proxy),
                    UseProxy = true
                };

                httpClient = new HttpClient(httpClientHandler);
            }
            else
            {
                httpClient = new HttpClient();
            }

            httpClient.BaseAddress = new Uri(ss.SebGateway.URL);
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<IEnumerable<Transaction>> GetTransactionsListAsync(DateRange range, CancellationToken cancellationToken)
        {
            if (range == null) return null;

            GetTransactionsResp getTransactionsResp = null;
            GetTransactionsListReq request = new GetTransactionsListReq(range);
            string uri = request.ToUri();
            log.Trace(uri);

            try
            {
                HttpResponseMessage response = await httpClient.GetAsync(uri, cancellationToken);

                response.EnsureSuccessStatusCode();
                getTransactionsResp = JsonConvert.DeserializeObject<GetTransactionsResp>(
                                        await response.Content.ReadAsStringAsync());

                log.Info("SebGatewayClient.GetTransactionsDetailAsync. uri: {0}; received: {1}; ids: {2}"
                    , uri, getTransactionsResp.Transactions.Count(), string.Join(",", getTransactionsResp.Transactions.Select(t => t.Id)));
                return getTransactionsResp.Transactions;
            }
            catch (Exception e)
            {
                log.Error("SebGatewayClient.GetTransactionsListAsync. uri: {0}; error: {1}", e.Message);
                return null;
            }
        }

        public async Task<IEnumerable<TransactionDetail>> GetTransactionsDetailAsync(IEnumerable<Transaction> transactions
            , CancellationToken cancellationToken)
        {
            if (transactions == null) return null;

            List<TransactionDetail> transactionsDetail;
            GetTransactionsDetailReq request = new GetTransactionsDetailReq(transactions);
            string uri = request.ToUri();
            log.Info(uri);

            try
            {
                HttpResponseMessage response = await httpClient.GetAsync(uri, cancellationToken);

                response.EnsureSuccessStatusCode();
                var bytes = await response.Content.ReadAsByteArrayAsync();
                transactionsDetail = new List<TransactionDetail>(ParseTransactionDetail(System.Text.Encoding.UTF8.GetString(bytes)));

                log.Info("SebGatewayClient.GetTransactionsDetailAsync. uri: {0}; received: {1}", uri, transactionsDetail.Count);
                return transactionsDetail;
            }
            catch (Exception e)
            {
                log.Error("SebGatewayClient.GetTransactionsDetailAsync. uri: {0}; error: {1}", uri, e.Message);
                return null;
            }
        }

        // Parse GetTransactionDetail
        public IEnumerable<TransactionDetail> ParseTransactionDetail(string response)
        {
            try
            {
                dynamic transactions = JsonConvert.DeserializeObject(response);

                List<TransactionDetail> result = new List<TransactionDetail>();

                foreach (var tran in transactions.Transactions)
                {
                    TransactionDetail tr = new TransactionDetail();
                    tr.Id = tran.transaction.Id;
                    tr.Data = JsonConvert.SerializeObject(tran);
                    result.Add(tr);
                }

                return result;
            }
            catch (Exception e)
            {
                log.Error(e);
                return null;
            }
        }

    }
}
