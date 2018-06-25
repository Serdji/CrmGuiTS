using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Crm.Seb2
{
    public class Transaction
    {
        public int Version;
        public long Id;
        public string Recloc;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime LastTryDT = DateTime.MinValue;
        public int TryCount = 0;

        public bool InProcess = false;

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
}
