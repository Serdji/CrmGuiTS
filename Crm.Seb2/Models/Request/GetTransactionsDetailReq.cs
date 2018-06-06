using Crm.Seb2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb.Models.Request
{
    class GetTransactionsDetailReq
    {
        protected List<long> Ids;

        public GetTransactionsDetailReq(IEnumerable<Transaction> transactions)
        {
            Ids = new List<long>(transactions.Select(t => t.Id));
        }

        public string ToUri()
        {
            return "/transactions/documents?idlist=" + string.Join(",", Ids);
        }
    }
}
