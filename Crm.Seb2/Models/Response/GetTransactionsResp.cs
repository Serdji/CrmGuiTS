using Crm.Seb2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb.Models.Response
{
    public class TransactionResp: Transaction
    {
    }

    public class GetTransactionsResp
    {
        public IEnumerable<Transaction> Transactions { get; set; }
    }

}
