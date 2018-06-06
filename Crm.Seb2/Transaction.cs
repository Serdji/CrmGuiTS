using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb2
{
    public class Transaction
    {
        public int Version { get; set; }
        public long Id { get; set; }
        public string Recloc { get; set; }

        public override bool Equals(object obj)
        {
            var item = obj as Transaction;

            if (item == null)
            {
                return false;
            }

            return this.Id.Equals(item.Id);
        }

        public override int GetHashCode()
        {
            return this.Id.GetHashCode();
        }
    }

   // class Transactions: List<long>
   // {
   //     public string CsvIds { get => string.Join(",", Ids); }
   // }
}
