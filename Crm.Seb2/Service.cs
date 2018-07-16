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
        private bool finishRange;
        private bool finishTransactions;

        public Service()
        {
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
            ServicePointManager.DefaultConnectionLimit = ss.SebGateway.ConnectionLimit;
        }

        public void Start()
        {
            log.Info("Started");

            finishRange = false;
            finishTransactions = false;

            var sebManager = new SebManager();

            cancellationTokenSource = new CancellationTokenSource();

            processRangeTask = Task.Run(async () => await DoProcessRangeAsync(sebManager, cancellationTokenSource.Token));

            processTransactionsTask = Task.Run(async () => await DoProcessTransactionsAsync(sebManager, cancellationTokenSource.Token));

            utilityTask = Task.Run(async () => await DoInfoAsync(sebManager, cancellationTokenSource.Token));
        }


        private async Task DoProcessRangeAsync(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                int awaitingTransactionLimit = 1000;
                DateTime dateStart = sebManager.dateStart;

                while (true)
                {
                    try
                    {
                        cancellationToken.ThrowIfCancellationRequested();

                        DateTime dateEnd = dateStart.AddMinutes(ss.SebGateway.RangeInMinutes).AddSeconds(-1);


                        if (ss.DateEnd == null || ss.DateEnd == DateTime.MinValue)
                        {
                            // actual
                            if (dateEnd < DateTime.Now.AddMinutes(-(ss.CurrTimeGapInMinutes))
                                && sebManager.TransactionsToProcessCount < awaitingTransactionLimit)
                            {
                                await sebManager.GetNextTransactionsListAsync(dateStart, dateEnd, cancellationToken);
                                dateStart = await sebManager.IncDateStart(cancellationToken);
                            }
                        }
                        else
                        {
                            // lost dates   
                            if (dateStart >= ss.DateEnd)
                            {
                                log.Warn("Range processing. Done!!!");
                                finishRange = true;
                                break;
                            }
                            if (dateEnd > ss.DateEnd)
                                dateEnd = (DateTime)ss.DateEnd;
                            if (sebManager.TransactionsToProcessCount < awaitingTransactionLimit)
                            {
                                await sebManager.GetNextTransactionsListAsync(dateStart, dateEnd, cancellationToken);
                                dateStart = await sebManager.IncDateStart(cancellationToken);
                            }
                        }


                    }
                    catch (OperationCanceledException e)
                    {
                        log.Info("DoProcessRangeAsync. {0}", e.Message);
                        return;
                    }
                    catch (Exception e)
                    {
                        log.Error(e);
                        await Task.Delay(TimeSpan.FromMinutes(1));
                    }

                    await Task.Delay(TimeSpan.FromMilliseconds(ss.DelayInMillisecond));
                }
            }
            catch (Exception e)
            {
                log.Error(e);
            }
        }

        private async Task DoProcessTransactionsAsync(SebManager sebManager, CancellationToken cancellationToken)
        {
            try
            {
                while (true)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    if ((sebManager.TransactionsToProcessCount > 0)
                        && (sebManager.TransactionsInProcessCount < 1000))
                    {
                        Task task = Task.Run(() => sebManager.GetTransactionsDetailAsync(ss.SebGateway.TransactionInBatchLimit
                                                            , cancellationToken))
                                                    .ContinueWith(t => { log.Error(t.Exception); },
                                                        TaskContinuationOptions.OnlyOnFaulted);
                    }
                    
                    // lost dates
                    if (finishRange && sebManager.TransactionsCount == 0)
                    {
                        log.Warn("Transactions processing. Done!!!");
                        finishTransactions = true;
                        break;
                    }

                    await Task.Delay(TimeSpan.FromMilliseconds(ss.DelayInMillisecond), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info("DoProcessTransactionsAsync. {0}", e.Message);
                return;
            }
            catch (Exception e)
            {
                log.Error(e);
            }
        }

        private async Task DoInfoAsync(SebManager sebManager, CancellationToken cancellationToken)
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

                    // lost dates
                    if (finishRange && finishTransactions)
                    {
                        break;
                    }

                    await Task.Delay(TimeSpan.FromSeconds(60), cancellationToken);
                }
            }
            catch (OperationCanceledException e)
            {
                log.Info("DoInfo. {0}", e.Message);
                throw;
            }
            catch (Exception e)
            {
                log.Error(e);
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
