using Crm.Seb2;
using System.Collections.Generic;

namespace Crm.Seb.Models.Response
{
    public class GetTransactionsResp
    {
        public IEnumerable<Transaction> Transactions { get; set; }
    }

}
