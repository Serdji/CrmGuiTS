using Crm.Seb2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb.Models.Request
{
    class GetTransactionsListReq: DateRange
    {
        public GetTransactionsListReq(DateRange dateRange)
        {
            DateStart = dateRange.DateStart;
            DateEnd = dateRange.DateEnd;
        }

        public string ToUri()
        {
            string uri = String.Format("transactions/list?date_start={0}&date_end={1}",
                DateStart.ToString("yyyy-MM-ddTH:mm:ss"), DateEnd.ToString("yyyy-MM-ddTH:mm:ss"));

            return uri;
        }
    }
}
