using HMPPS.ErrorReporting;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using HMPPS.NomisApiService.Interfaces;
using HMPPS.Utilities.Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;

namespace HMPPS.Site
{
    public partial class Status : System.Web.UI.Page
    {
        private ILogManager _logManager;
        private INomisApiService _nomisApiService;

        private List<KeyValuePair<string, Exception>> _failedChecks;

        public Status()
        {
            _logManager = DependencyInjectionHelper.ResolveService<ILogManager>();
            _nomisApiService = DependencyInjectionHelper.ResolveService<INomisApiService>();

            _failedChecks = new List<KeyValuePair<string, Exception>>();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            var checksToRun = ConfigurationManager.AppSettings["HMPPS.Site.HealthCheckOperations"]?.Split(',');

            if (checksToRun == null)
            {
                _logManager.LogDebug("No health checks operations specified.", GetType());

                return;
            }

            foreach(var item in checksToRun)
            { 
                var check = GetType().GetMethod(item);

                if (check == null)
                {
                    _logManager.LogWarning($"Non-existant health check operation {check} specified in config.", GetType());

                    continue;
                }

                RunCheck(check);
            }

            if (_failedChecks.Any())
            {
                Response.StatusCode = 503;
                Response.TrySkipIisCustomErrors = true;

                Response.Write(string.Join("<hr>", _failedChecks.Select(check => $"Check failed: {check.Key}." +
                    (check.Value == null ? string.Empty : $"Exception: {check.Value}"))));
            }
        }

        private void RunCheck(MethodInfo check)
        {
            try
            {
                check.Invoke(this, null);
            }
            catch (Exception ex)
            {
                _logManager.LogError($"Health check operation {check} threw an excpetion.", ex, GetType());

                _failedChecks.Add(new KeyValuePair<string, Exception>(check.Name, ex));
            }
        }

        // Health Check Operations

        public void SitecoreSql()
        {
            if (Sitecore.Context.Site == null ||
                Sitecore.Context.Database == null ||
                Sitecore.Context.Database.GetItem(Sitecore.Context.Site.RootPath) == null)
            {
                _failedChecks.Add(new KeyValuePair<string, Exception>("SitecoreCheck", null));
            }
        }

        private void SitecoreMongo()
        {
            
        }

        private void Idam()
        {

        }

        private void Nomis()
        {

        }

        private void Redis()
        {

        }

        public void BlobStorage()
        {
               
        }

        public void AzureSearch()
        {
            
        }
    }
}
