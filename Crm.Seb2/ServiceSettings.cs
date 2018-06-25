using System;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;

namespace Crm.Seb2
{
    public sealed class ServiceSettings : ConfigurationSection
    {
        private const string serviceSettingsLabel = "serviceSettings";
        private const string dateStartLabel = "dateStart";
        private const string dateEndLabel = "dateEnd";
        private const string delayInMillisecondLabel = "delayInMillisecond";

        private const string mongoDBLabel = "mongoDB";
        private const string sebGatewayLabel = "sebGateway";

        private const string airlinesLabel = "airlines";
        private const string airlineLabel = "airline";

        private static readonly Lazy<ServiceSettings> lazy =
            new Lazy<ServiceSettings>(() => (ServiceSettings)ConfigurationManager.GetSection(serviceSettingsLabel));

        public static ServiceSettings Instance { get { return lazy.Value; } }

        [ConfigurationProperty(dateStartLabel)]
        public DateTime DateStart{ get { return (DateTime)this[dateStartLabel]; } }

        [ConfigurationProperty(dateEndLabel)]
        public DateTime? DateEnd { get { return (DateTime?)this[dateEndLabel]; } }

        [ConfigurationProperty(delayInMillisecondLabel)]
        public int DelayInMillisecond { get { return (int)this[delayInMillisecondLabel]; } }

        [ConfigurationProperty(mongoDBLabel)]
        public MongoDBElement MongoDB
        {
            get { return (MongoDBElement)this[mongoDBLabel]; }
        }

        [ConfigurationProperty(sebGatewayLabel)]
        public SebGatewayElement SebGateway
        {
            get { return (SebGatewayElement)this[sebGatewayLabel]; }
        }


        [ConfigurationProperty(airlinesLabel)]
        [ConfigurationCollection(typeof(AirlineElementCollection), AddItemName = airlineLabel)]
        public AirlineElementCollection Airlines
        {
            get { return (AirlineElementCollection)this[airlinesLabel]; }
        }
    }

    public class MongoDBElement : ConfigurationElement
    {
        private const string connectionStringLabel = "connectionString";
        private const string mainCollectionNameLabel = "mainCollectionName";
        private const string serviceCollectionPrefixLabel = "serviceCollectionPrefix";

        [ConfigurationProperty(connectionStringLabel)]
        public string ConnectionString { get { return (string)this[connectionStringLabel]; } }

        [ConfigurationProperty(mainCollectionNameLabel)]
        public string MainCollectionName { get { return (string)this[mainCollectionNameLabel]; } }

        [ConfigurationProperty(serviceCollectionPrefixLabel)]
        public string ServiceCollectionPrefix { get { return (string)this[serviceCollectionPrefixLabel]; } }
    }

    public class SebGatewayElement : ConfigurationElement
    {
        private const string urlLabel = "url";
        private const string proxyLabel = "proxy";
        private const string transactionInBatchLimitLabel = "transactionInBatchLimit";
        private const string connectionLimitLabel = "connectionLimit";
        private const string rangeInMinutesLabel = "rangeInMinutes";

        [ConfigurationProperty(urlLabel)]
        public string URL { get { return (string)this[urlLabel]; } }

        [ConfigurationProperty(proxyLabel)]
        public string Proxy { get { return (string)this[proxyLabel]; } }

        [ConfigurationProperty(transactionInBatchLimitLabel)]
        public int TransactionInBatchLimit { get { return (int)this[transactionInBatchLimitLabel]; } }

        [ConfigurationProperty(connectionLimitLabel)]
        public int ConnectionLimit { get { return (int)this[connectionLimitLabel]; } }

        [ConfigurationProperty(rangeInMinutesLabel)]
        public int RangeInMinutes { get { return (int)this[rangeInMinutesLabel]; } }
    }

    public class AirlineElementCollection : ConfigurationElementCollection, IEnumerable<AirlineElement>
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new AirlineElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((AirlineElement)element).Code;
        }

        public new IEnumerator<AirlineElement> GetEnumerator()
        {
            foreach (AirlineElement element in
                Enumerable.Range(0, base.Count).Select(base.BaseGet))
                yield return element;
        }

    }

    public class AirlineElement : ConfigurationElement
    {
        private const string codeLabel = "code";

        [ConfigurationProperty(codeLabel)]
        public string Code { get { return (string)this[codeLabel]; } }
    }
}
