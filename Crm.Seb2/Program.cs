using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using WinService;

namespace Crm.Seb2
{
    class Program
    {
        static void Main(string[] args)
        {
            /* Logger log = LogManager.GetCurrentClassLogger();
             log.Trace("trace message");
             log.Debug("debug message");
             log.Info("info message");
             log.Warn("warn message");
             log.Error("error message");
             log.Fatal("fatal message");

             ServiceSettings ss = ServiceSettings.Instance;
             System.Console.WriteLine(ss.ConnectionString);

             foreach (var airline in ss.Airlines)
             {
                 Console.WriteLine("Airline code: {0}", airline.Code);
                 Console.WriteLine("Airline pathIn: {0}", airline.PathIn);
                 Console.WriteLine();
             }

             AirlineElement x = ss.Airlines.SingleOrDefault(a => a.Code == "7R");
             if (x != null)
                 Console.WriteLine(x.PathIn);*/

            Service S = new Service();
            ConsoleUtils.RunService(args, S);
        }
    }

}
