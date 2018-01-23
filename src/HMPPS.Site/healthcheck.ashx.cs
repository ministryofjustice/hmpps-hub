using System.Configuration;
using System.Linq;
using System.Web;
using HMPPS.ErrorReporting;
using HMPPS.HealthCheck;
using HMPPS.NomisApiService.Interfaces;
using HMPPS.Utilities.Helpers;
using Newtonsoft.Json;
using Sitecore.Mvc.Extensions;
using HMPPS.HealthCheck.Extended;
using HMPPS.HealthCheck.Services;

namespace HMPPS.Site
{
    public class healthcheck : IHttpHandler
    {
        private readonly ExtendedHealthCheckService _extendedHealthCheckService;
        private readonly BasicHealthCheckService _basicHealthCheckService;

        public healthcheck()
        {
            var logManager = DependencyInjectionHelper.ResolveService<ILogManager>();
            var nomisApiService = DependencyInjectionHelper.ResolveService<INomisApiService>();

            var config = new HealthCheckConfig
            {
                MongoDbConnectionString = ConfigurationManager.ConnectionStrings["analytics"].ConnectionString,
                RedisDbConnectionString = ConfigurationManager.ConnectionStrings["redis.sessions"]?.ConnectionString,
                IdamHealthCheckUrl = ConfigurationManager.AppSettings["HMPPS.Authentication.HealthCheckEndpoint"].ValueOrEmpty()
            };

            _extendedHealthCheckService = new ExtendedHealthCheckService(logManager, config, nomisApiService);
            _basicHealthCheckService = new BasicHealthCheckService(logManager, config);
        }

        public void ProcessRequest(HttpContext context)
        {
            var checksToRun = ConfigurationManager.AppSettings["HMPPS.Site.HealthCheckOperations"]?.Split(',');

            var checkResults = _basicHealthCheckService.GetHealthCheckResults(checksToRun).ToList();
            checkResults.AddRange(_extendedHealthCheckService.GetHealthCheckResults(checksToRun));

            context.Response.ContentType = "application/json";

            context.Response.StatusCode = checkResults.Any(r => !r.Healthy) ? 500 : 200;
            context.Response.TrySkipIisCustomErrors = true;

            context.Response.Write(JsonConvert.SerializeObject(checkResults));
        }

        public bool IsReusable => false;
    }
}
