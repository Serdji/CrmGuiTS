using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Crm.Seb2
{
    public sealed class ServiceSettings : ConfigurationSection
    {
        private const string serviceSettingsLabel = "serviceSettings";
        private const string connectionStringLabel = "connectionString";
        private const string airlinesLabel = "airlines";
        private const string airlineLabel = "airline";

        private static readonly Lazy<ServiceSettings> lazy =
            new Lazy<ServiceSettings>(() => (ServiceSettings)ConfigurationManager.GetSection(serviceSettingsLabel));

        public static ServiceSettings Instance { get { return lazy.Value; } }

        [ConfigurationProperty(connectionStringLabel)]
        public string ConnectionString
        {
            get { return (string)this[connectionStringLabel]; }
        }

        [ConfigurationProperty(airlinesLabel)]
        [ConfigurationCollection(typeof(AirlineElementCollection), AddItemName = airlineLabel)]
        public AirlineElementCollection Airlines
        {
            get { return (AirlineElementCollection)this[airlinesLabel]; }
        }
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
        private const string pathInLabel = "pathIn";
        private const string pathOutLabel = "pathOut";
        private const string pathErrLabel = "pathErr";

        [ConfigurationProperty(codeLabel)]
        public string Code { get { return (string)this[codeLabel]; } }

        [ConfigurationProperty(pathInLabel)]
        public string PathIn { get { return (string)this[pathInLabel]; } }

        [ConfigurationProperty(pathOutLabel)]
        public string PathOut { get { return (string)this[pathOutLabel]; } }

        [ConfigurationProperty(pathErrLabel)]
        public string PathErr { get { return (string)this[pathErrLabel]; } }
    }
}
