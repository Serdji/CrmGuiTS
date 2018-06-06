using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WinService;
using NLog;
using System.Threading;
using Crm.Seb2;
using Crm.Seb.Models.Request;
using Crm.Seb.Models.Response;
using System.Net;

namespace Crm.Seb2
{
    [WindowsService("Crm.Seb2")]
    public class Service : IWinService
    {
        private readonly Logger log = LogManager.GetCurrentClassLogger();
        private ServiceSettings ss = ServiceSettings.Instance;

        private Task processRangeTask;
        private Task processTransactionsTask;
        private CancellationTokenSource cancellationTokenSource;

        public Service()
        {
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
            ServicePointManager.DefaultConnectionLimit = ss.SebGateway.ConnectionLimit;
        }

        public void Start()
        {
            var sebManager = new SebManager(ss.SebGateway.URL, ss.SebGateway.Proxy);

            cancellationTokenSource = new CancellationTokenSource();
            processRangeTask = Task.Run(() => DoProcessRange(sebManager, cancellationTokenSource.Token));
            processTransactionsTask = Task.Run(() => DoProcessTransactions(sebManager, cancellationTokenSource.Token));
        }

        private async Task DoProcessRange(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                DateTime dateStart = ss.DateStart;
                DateTime dateEnd = dateStart.AddMinutes(ss.RangeInMinutes);
        
                while (!cancellationToken.IsCancellationRequested)
                {
                    int awaitingTransactionLimit = ss.SebGateway.TransactionInBatchLimit * ss.SebGateway.ConnectionLimit * 2;
                    if (sebManager.TransactionsToProcessCount < awaitingTransactionLimit) {
                        var range = new DateRange(dateStart, dateEnd);
                        sebManager.AddRangeToProcess(range);

                        Task task = Task.Run(() => sebManager.GetTransactionsListAsync(cancellationToken));

                        dateStart = dateEnd;
                        dateEnd = dateStart.AddMinutes(ss.RangeInMinutes);
                    }

                    await Task.Delay(TimeSpan.FromMilliseconds(ss.SebGateway.GetTransactionsListDelayInMillisecond), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info(e.Message);
            }
            catch (Exception e)
            {
                log.Fatal(e);
            }
        }

        private async Task DoProcessTransactions(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    if (sebManager.TransactionsToProcessCount > 0)
                    {
                        Task task = Task.Run(() => sebManager.GetTransactionsDetailAsync(ss.SebGateway.TransactionInBatchLimit
                            , cancellationToken));
                    }

                    await Task.Delay(TimeSpan.FromMilliseconds(ss.SebGateway.GetTransactionsDetailDelayInMillisecond), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info(e.Message);
            }
            catch (Exception e)
            {
                log.Fatal(e);
            }
        }

        public void Stop()
        {
            cancellationTokenSource.Cancel();
            try
            {
                processRangeTask.Wait();
                //processTransactionsTask.Wait();
            }
            catch (Exception e)
            {
                log.Fatal(e);
            }
        }

        private void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            log.Fatal("Unhandled exception: {0}", e.ExceptionObject);
            LogManager.Flush();
            Stop();
            return;
        }


        /////////////////////////////////////////////////////////////////////////

        // WinService Interface

        /////////////////////////////////////////////////////////////////////////

        public void OnStart(string[] args)
        {
            Start();
        }

        public void OnStop()
        {
            Stop();
        }

        public void OnPause()
        {
            Stop();
        }

        public void OnContinue()
        {
            Start();
        }

        public void OnShutdown()
        {
            Stop();
        }

        public void OnCustomCommand(int command)
        {
        }

        /////////////////////////////////////////////////////////////////////////

        public void Dispose()
        {
        }
    }
}
