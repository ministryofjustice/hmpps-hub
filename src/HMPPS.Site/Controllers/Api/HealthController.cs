using HMPPS.ErrorReporting;
using HMPPS.NomisApiService.Interfaces;
using HMPPS.Site.ViewModels.Api;
using HMPPS.Utilities.Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;

namespace HMPPS.Site.Controllers.Api
{
    public class HealthController : ApiController
    {
        private ILogManager _logManager;
        private INomisApiService _nomisApiService;

        private List<HealthCheckFacet> _healthChecks;

        public HealthController()
        {
            _logManager = DependencyInjectionHelper.ResolveService<ILogManager>();
            _nomisApiService = DependencyInjectionHelper.ResolveService<INomisApiService>();

            _healthChecks = new List<HealthCheckFacet>();
        }

        [HttpGet]
        public HttpResponseMessage Index()
        {
            var checksToRun = ConfigurationManager.AppSettings["HMPPS.Site.HealthCheckOperations"]?.Split(',');

            if (checksToRun == null)
            {
                _logManager.LogDebug("No health checks operations specified.", GetType());

                return Request.CreateResponse(HttpStatusCode.OK);
            }

            foreach (var item in checksToRun)
            {
                var check = GetType().GetMethod(item);

                if (check == null)
                {
                    _logManager.LogWarning($"Non-existant health check operation {check} specified in config.", GetType());

                    continue;
                }

                RunCheck(check);
            }

            return Request.CreateResponse(_healthChecks.All(c => c.Healthy) ? HttpStatusCode.OK : HttpStatusCode.InternalServerError, _healthChecks);
        }

        private void RunCheck(MethodInfo check)
        {
            try
            {
                var checkResult = check.Invoke(this, null) as HealthCheckFacet;

                _healthChecks.Add(checkResult);
            }
            catch (Exception ex)
            {
                _logManager.LogError($"Health check operation {check} threw an excpetion.", ex, GetType());

                _healthChecks.Add(new HealthCheckFacet { Name = check.Name, Healthy = false, Details = ex.Message });
            }
        }

        public HealthCheckFacet SitecoreSql()
        {
            var healthy = Sitecore.Context.Site != null &&
                          Sitecore.Context.Database != null &&
                          Sitecore.Context.Database.GetItem(Sitecore.Context.Site.RootPath) != null;

            return new HealthCheckFacet
            {
                Name = "Sitecore SQL Database",
                Healthy = healthy
            };
        }

        public HealthCheckFacet SitecoreMongo()
        {
            return new HealthCheckFacet();
        }

        public HealthCheckFacet Idam()
        {
            return new HealthCheckFacet();
        }

        public HealthCheckFacet Nomis()
        {
            return new HealthCheckFacet();
        }

        public HealthCheckFacet Redis()
        {
            return new HealthCheckFacet();
        }

        public HealthCheckFacet BlobStorage()
        {
            return new HealthCheckFacet();
        }

        public HealthCheckFacet AzureSearch()
        {
            return new HealthCheckFacet();
        }
    }
}
