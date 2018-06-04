using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WinService;
using NLog;
using System.Threading;

namespace Crm.Seb2
{
    [WindowsService("Crm.Seb2")]
    public class Service : IWinService
    {
        private readonly Logger log = LogManager.GetCurrentClassLogger();

        private Task _proccessSmsQueueTask;
        private CancellationTokenSource _cancellationTokenSource;

        public Service()
        {
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
        }

        public void Start()
        {
            _cancellationTokenSource = new CancellationTokenSource();
            _proccessSmsQueueTask = Task.Run(() => DoWorkAsync(_cancellationTokenSource.Token));
        }

        private async Task DoWorkAsync(CancellationToken token)
        {
            while (true)
            {
                try
                {
                    // some work
                    ServiceSettings ss = ServiceSettings.Instance;
                    log.Info(ss.ConnectionString);

                    foreach (var airline in ss.Airlines)
                    {
                        log.Trace("Airline code: {0}", airline.Code);
                        log.Trace("Airline pathIn: {0}", airline.PathIn);
                    }
                }
                catch (Exception e)
                {
                    log.Fatal(e);
                }
                await Task.Delay(TimeSpan.FromSeconds(1), token);
            }
        }

        public void Stop()
        {
            _cancellationTokenSource.Cancel();
            try
            {
                _proccessSmsQueueTask.Wait();
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
