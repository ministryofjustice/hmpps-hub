using HMPPS.ErrorReporting;
using MongoDB.Driver;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;
using System.Linq;
using System.Reflection;

namespace HMPPS.HealthCheck.Services
{
    public class BasicHealthCheckService : BaseHealthCheckService
    {
        private readonly HealthCheckConfig _config;

        public BasicHealthCheckService(ILogManager logManager, HealthCheckConfig config)
            : base(logManager) 
        {
            _config = config;
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

            server.Ping();

            return checkResult;
        }

        public HealthCheckFacet AzureSearch()
        {
            var coreIndex = ContentSearchManager.GetIndex("sitecore_core_index");

            using (var context = coreIndex.CreateSearchContext())
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

        protected override MethodInfo GetHealthCheckMethod(string checkName)
        {
            return GetType().GetMethod(checkName);
        }
    }
}
