using HMPPS.ErrorReporting;
using HMPPS.MediaLibrary.AzureStorage;
using HMPPS.NomisApiService.Interfaces;
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
using StackExchange.Redis;

namespace HMPPS.HealthCheck
{
    public class HealthCheckService
    {
        private ILogManager _logManager;
        private INomisApiService _nomisApiService;

        private HealthCheckConfig _config;

        public HealthCheckService(ILogManager logManager, INomisApiService nomisApiService, HealthCheckConfig config)
        {
            _logManager = logManager;
            _nomisApiService = nomisApiService;
            _config = config;
        }

        public IList<HealthCheckFacet> GetHealthCheckResults(params string[] checksToRun)
        {
            var healthCheckResults = new List<HealthCheckFacet>();

            if (checksToRun == null)
            {
                _logManager.LogDebug("No health checks operations specified.", GetType());

                return healthCheckResults;
            }

            foreach (var item in checksToRun)
            {
                var check = GetType().GetMethod(item);

                if (check == null)
                {
                    _logManager.LogWarning($"Non-existant health check operation {check} specified in config.", GetType());

                    continue;
                }

                healthCheckResults.Add(RunCheck(check));
            }

            return healthCheckResults;    
        }

        private HealthCheckFacet RunCheck(MethodInfo check)
        {
            try
            {
                var checkResult = check.Invoke(this, null) as HealthCheckFacet;

                return checkResult;
            }
            catch (Exception ex)
            {
                _logManager.LogError($"Health check operation {check.Name} threw an exception.", ex, GetType());

                return new HealthCheckFacet { Name = check.Name, Healthy = false };
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


            var client = new MongoClient(_config.MongoDbConnectionString);

            var server = new MongoServer(MongoServerSettings.FromClientSettings(client.Settings));

            checkResult.Details = "Successfully pinged analytics database.";

            server.Ping();

            return checkResult;
        }

        public HealthCheckFacet Idam()
        {
            using (var client = new HttpClient())
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                var response = client.GetAsync(_config.IdamHealthCheckUrl).Result;

                return new HealthCheckFacet
                {
                    Name = "IDAM",
                    Healthy = response.StatusCode == HttpStatusCode.OK
                };
            }
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
            var checkResult = new HealthCheckFacet
            {
                Name = "Redis",
                Healthy = true
            };

            var redisConnection = new Lazy<ConnectionMultiplexer>(() =>
                ConnectionMultiplexer.Connect(_config.RedisDbConnectionString));
            var redisDb = redisConnection.Value.GetDatabase();

            return checkResult;

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
