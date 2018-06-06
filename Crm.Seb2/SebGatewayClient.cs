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
        private System.Net.Http.HttpClient httpClient;    

        public SebGatewayClient(string url, string proxy)
        {
            if (!string.IsNullOrEmpty(proxy))
            {
                var httpClientHandler = new HttpClientHandler()
                {
                    Proxy = new WebProxy(proxy),
                    UseProxy = true
                };

                httpClient = new HttpClient(httpClientHandler);
            }
            else
            {
                httpClient = new HttpClient();
            }

            httpClient.BaseAddress = new Uri(url);
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<IEnumerable<Transaction>> GetTransactionsListAsync(DateRange range, CancellationToken cancellationToken)
        {
            try
            {
                GetTransactionsResp getTransactionsResp = null;
                GetTransactionsListReq request = new GetTransactionsListReq(range);
                log.Trace(request.ToUri());

                HttpResponseMessage response = await httpClient.GetAsync(request.ToUri(), cancellationToken);

                response.EnsureSuccessStatusCode();
                getTransactionsResp = JsonConvert.DeserializeObject<GetTransactionsResp>(
                                        await response.Content.ReadAsStringAsync());

                return getTransactionsResp.Transactions;
            }
            catch (Exception e)
            {
                log.Error(e);
                return null;
            }
        }

        public async Task<IEnumerable<TransactionDetail>> GetTransactionsDetailAsync(IEnumerable<Transaction> transactions
            , CancellationToken cancellationToken)
        {
            try
            {
                List<TransactionDetail> result;
                GetTransactionsDetailReq request = new GetTransactionsDetailReq(transactions);
                log.Trace(request.ToUri());

                HttpResponseMessage response = await httpClient.GetAsync(request.ToUri(), cancellationToken);

                response.EnsureSuccessStatusCode();
                var bytes = await response.Content.ReadAsByteArrayAsync();
                result = new List<TransactionDetail>(ParseTransactionDetail(System.Text.Encoding.UTF8.GetString(bytes)));

                return result;
            }
            catch (Exception e)
            {
                log.Error(e);
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
