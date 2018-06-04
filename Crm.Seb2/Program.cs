using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crm.Seb2
{
    class Program
    {
        static void Main(string[] args)
        {
            ServiceSettings ss = ServiceSettings.Instance;
            System.Console.WriteLine(ss.ConnectionString);

            foreach (var airline in ss.Airlines)
            {
                Console.WriteLine("Airline code: {0}", airline.Code);
                Console.WriteLine("Airline pathIn: {0}", airline.PathIn);
                Console.WriteLine();
            }

            AirlineElement x = ss.Airlines.SingleOrDefaul
                t(a => a.Code == "7R");
            if (x != null)
                Console.WriteLine(x.PathIn);
            Console.ReadKey(true);
        }
    }

}
