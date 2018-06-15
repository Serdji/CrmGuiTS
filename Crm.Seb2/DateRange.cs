using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb2
{
    class DateRange
    {
        public ObjectId Id { get; set; }

        public DateTime DateStart;
        public DateTime DateEnd;

        public DateTime LastTryDT = DateTime.MinValue;
        public int TryCount = 0;

        public bool InProcess = false;

        public DateRange()
        {
        }

        public DateRange(DateTime dateStart, DateTime dateEnd)
        {
            DateStart = dateStart;
            DateEnd = dateEnd;
        }

        public override bool Equals(object obj)
        {
            var item = obj as DateRange;

            if (item == null)
            {
                return false;
            }

            return this.DateStart.Equals(item.DateStart) && this.DateEnd.Equals(item.DateEnd);
        }

        public override int GetHashCode()
        {
            return new { this.DateStart, this.DateEnd }.GetHashCode();
        }
    }
}
