using System;

namespace Crm.Seb.Models.Request
{
    class GetTransactionsListReq
    {
        public DateTime DateStart;
        public DateTime DateEnd;

        public GetTransactionsListReq(DateTime dateStart, DateTime dateEnd)
        {
            DateStart = dateStart;
            DateEnd = dateEnd;
        }

        public string ToUri()
        {
            string uri = String.Format("transactions/list?date_start={0}&date_end={1}",
                DateStart.ToString("yyyy-MM-ddTH:mm:ss"), DateEnd.ToString("yyyy-MM-ddTH:mm:ss"));

            return uri;
        }
    }
}
