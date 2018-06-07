using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb.Models.Response
{
    public class TransactionsDetailResp
    {
        public List<TransactionDetailRsp> Transactions { get; set; }
    }

    public class TransactionDetailRsp
    {
        public TransactionRsp Transaction { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Vairline { get; set; }
        public string IssueDate { get; set; }
        public ReclocsRsp Reclocs { get; set; }
        public string DocType { get; set; }
        public List<TaxRsp> Taxes { get; set; }
        public List<MonetaryInfoRsp> MonetaryInfo { get; set; }
        public string FareCalc { get; set; }
        public List<TicketRsp> Tickets { get; set; }
    }

    public class TicketRsp
    {
        public string TicketNum { get; set; }
        public string TicketNumConnect { get; set; }
        public List<CouponRsp> Coupons { get; set; }
    }

    public class CouponRsp
    {
        public int Num { get; set; }
        public string Status { get; set; }
        public string SAC { get; set; }
        public string FareCode { get; set; }
        public ItineraryRsp Itinerary { get; set; }
        public string OpComment { get; set; }
        public ValidDateRangeRsp ValidDateRange { get; set; }
    }

    public class ValidDateRangeRsp
    {
        public string before { get; set; }
        public string after { get; set; }
    }


    public class ItineraryRsp
    {
        public string Marketing { get; set; }
        public string Operating { get; set; }
        public string DepDate { get; set; }
        public string DepTime { get; set; }
        public List<string> Points { get; set; }
        public string Rbd { get; set; }
        public string RpiStatus { get; set; }
    }

    public class TransactionRsp
    {
        public string Version { get; set; }
        public string OpCode { get; set; }
        public int Id { get; set; }
        public string TimeStamp { get; set; }
    }

    public class ReclocsRsp
    {
        public List<string> Crs { get; set; }
        public List<string> Airline { get; set; }
        public string Local { get; set; }
    }

    public class TaxRsp
    {
        public string Code { get; set; }
        public double Amount { get; set; }
        public string Category { get; set; }
    }

    public class MonetaryInfoRsp
    {
        public string Code { get; set; }
        public object Amount { get; set; }
        public string Currency { get; set; }
    }
}
