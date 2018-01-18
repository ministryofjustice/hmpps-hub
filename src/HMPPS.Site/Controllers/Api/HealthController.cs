using HMPPS.ErrorReporting;
using HMPPS.MediaLibrary.AzureStorage;
using HMPPS.NomisApiService.Interfaces;
using HMPPS.Site.ViewModels.Api;
using HMPPS.Utilities.Helpers;
using MongoDB.Driver;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;
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
                _logManager.LogError($"Health check operation {check.Name} threw an exception.", ex, GetType());

                _healthChecks.Add(new HealthCheckFacet { Name = check.Name, Healthy = false, Details = ex.ToString() });
            }
        }

        public HealthCheckFacet SitecoreSql()
        {
            var healthy = Sitecore.Context.Site != null &&
                          Sitecore.Context.Database != null &&
                          Sitecore.Context.Database.GetItem(Sitecore.Context.Site.RootPath) != null;

            return new HealthCheckFacet
            {
                Name = "SitecoreSql",
                Healthy = healthy
            };
        }

        public HealthCheckFacet SitecoreMongo()
        {
            var checkResult = new HealthCheckFacet
            {
                Name = "SitecoreMongo",
                Healthy = true,
            };

            try
            {
                var analyticsConnectionString = ConfigurationManager.ConnectionStrings["analytics"].ConnectionString;

                var client = new MongoClient(analyticsConnectionString);

                var server = new MongoServer(MongoServerSettings.FromClientSettings(client.Settings));

                checkResult.Details = "Successfully pinged analytics database.";

                server.Ping();
            }
            catch (Exception ex)
            {
                checkResult.Healthy = false;
                checkResult.Details = ex.ToString();
            }

            return checkResult;
        }

        public HealthCheckFacet Idam()
        {
            return new HealthCheckFacet
            {
                Name = "IDAM"
            };
        }

        public HealthCheckFacet Nomis()
        {
            var versionDetails = _nomisApiService.GetVersion();

            return new HealthCheckFacet
            {
                Name = "NOMIS",
                Healthy = !string.IsNullOrEmpty(versionDetails),
                Details = versionDetails
            };
        }

        public HealthCheckFacet Redis()
        {
            return new HealthCheckFacet
            {
                Name = "Redis"
            };
        }

        public HealthCheckFacet BlobStorage()
        {
            var azureBlobProvider = new AzureStorageProvider("blobs", string.Empty);

            return new HealthCheckFacet
            {
                Name = "BlobStorage",
                Healthy = azureBlobProvider.CanConnect()
            };
        }

        public HealthCheckFacet AzureSearch()
        {
            var masterIndex = ContentSearchManager.GetIndex("sitecore_master_index");

            using (var context = masterIndex.CreateSearchContext())
            {
                var healthCheckResults = context.GetQueryable<SearchResultItem>()
                                                .Where(c => c.Content.Equals("fake health check query"))
                                                .ToList();
            }

            return new HealthCheckFacet
            {
                Name = "AzureSearch",
                Healthy = true
            };
        }
    }
}
