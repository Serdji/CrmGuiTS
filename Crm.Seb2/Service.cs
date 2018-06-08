using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WinService;
using NLog;
using System.Threading;
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
        private Task utilityTask;
        private CancellationTokenSource cancellationTokenSource;

        public Service()
        {
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
            ServicePointManager.DefaultConnectionLimit = ss.SebGateway.ConnectionLimit;
        }

        public void Start()
        {
            var sebManager = new SebManager();

            cancellationTokenSource = new CancellationTokenSource();
            processRangeTask = Task.Run(() => DoProcessRange(sebManager, cancellationTokenSource.Token));
            processTransactionsTask = Task.Run(() => DoProcessTransactions(sebManager, cancellationTokenSource.Token));
            utilityTask = Task.Run(() => DoInfo(sebManager, cancellationTokenSource.Token));
        }

        private async Task DoProcessRange(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                DateTime dateStart = ss.DateStart;
                DateTime dateEnd = dateStart.AddMinutes(ss.SebGateway.RangeInMinutes);
                
                while (true)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    
                    int awaitingTransactionLimit = ss.SebGateway.TransactionInBatchLimit * ss.SebGateway.ConnectionLimit * 2;
                    if (sebManager.TransactionsToProcessCount < awaitingTransactionLimit) {
                        var range = new DateRange(dateStart, dateEnd);
                        sebManager.AddRangeToProcess(range);

                        Task task = Task.Run(() => sebManager.GetTransactionsListAsync(cancellationToken))
                                                    .ContinueWith(t => { log.Error(t.Exception); },
                                                        TaskContinuationOptions.OnlyOnFaulted);
                        dateStart = dateEnd;
                        dateEnd = dateStart.AddMinutes(ss.SebGateway.RangeInMinutes);
                    }

                    await Task.Delay(TimeSpan.FromMilliseconds(ss.GetTransactionsListDelayInMillisecond), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info("DoProcessRange. {0}", e.Message);
            }
            catch (Exception e)
            {
                log.Fatal("DoProcessRange. error: {0}", e.Message);
            }
        }

        private async Task DoProcessTransactions(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                dynamic Airlines = ss.Airlines;

                while (true)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    if (sebManager.TransactionsToProcessCount > 0)
                    {
                        Task task = Task.Run(() => sebManager.GetTransactionsDetailAsync(ss.SebGateway.TransactionInBatchLimit
                                                            , cancellationToken))
                                                    .ContinueWith(t => { log.Error(t.Exception); },
                                                        TaskContinuationOptions.OnlyOnFaulted);
                    }
                    
                    await Task.Delay(TimeSpan.FromMilliseconds(ss.GetTransactionsDetailDelayInMillisecond), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info("DoProcessTransactions. {0}", e.Message);
            }
            catch (Exception e)
            {
                log.Fatal("DoProcessTransactions. error: {0}", e.Message);
            }
        }

        private async Task DoInfo(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                while (true)
                {
                    cancellationToken.ThrowIfCancellationRequested();

                    log.Info("transactions. ToProcess: {0}; InProcess: {1}; Delayed: {2}"
                            , sebManager.TransactionsToProcessCount
                            , sebManager.TransactionsInProcessCount
                            , sebManager.TransactionsDelayedCount);
                    await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info("DoInfo. {0}", e.Message);
            }
            catch (Exception e)
            {
                log.Fatal("DoInfo. error: {0}", e.Message);
            }
        }

        public void Stop()
        {
            cancellationTokenSource.Cancel();
            try
            {
                processRangeTask.Wait();
                processTransactionsTask.Wait();
                utilityTask.Wait();
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
            log.Info("Service start");
            Start();
        }

        public void OnStop()
        {
            log.Info("Service stop");
            Stop();
        }

        public void OnPause()
        {
            log.Info("Service pause");
            Stop();
        }

        public void OnContinue()
        {
            log.Info("Service continue");
            Start();
        }

        public void OnShutdown()
        {
            log.Info("Service shutdown");
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
