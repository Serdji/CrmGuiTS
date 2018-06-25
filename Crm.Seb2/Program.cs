using System;
using WinService;

namespace Crm.Seb2
{
    class Program
    {
        static void Main(string[] args)
        {
            Service S = new Service();
            ConsoleUtils.RunService(args, S);
            Console.ReadKey();
        }
    }

}
