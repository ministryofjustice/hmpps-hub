using HMPPS.ErrorReporting;
using HMPPS.HealthCheck;
using HMPPS.HealthCheck.Services;
using HMPPS.Utilities.Helpers;
using Newtonsoft.Json;
using System.Configuration;
using System.Linq;
using System.Web;

namespace HMPPS.xDB.ProcessingSite
{
    public class healthcheck : IHttpHandler
    {
        private readonly BasicHealthCheckService _healthCheckService;

        public healthcheck()
        {
            var logManager = DependencyInjectionHelper.ResolveService<ILogManager>();

            var config = new HealthCheckConfig
            {
                MongoDbConnectionString = ConfigurationManager.ConnectionStrings["analytics"].ConnectionString
            };

            _healthCheckService = new BasicHealthCheckService(logManager, config);
        }

        public void ProcessRequest(HttpContext context)
        {
            var checksToRun = ConfigurationManager.AppSettings["HMPPS.Site.HealthCheckOperations"]?.Split(',');

            var checkResults = _healthCheckService.GetHealthCheckResults(checksToRun);

            context.Response.ContentType = "application/json";

            context.Response.StatusCode = checkResults.Any(r => !r.Healthy) ? 500 : 200;
            context.Response.TrySkipIisCustomErrors = true;

            context.Response.Write(JsonConvert.SerializeObject(checkResults));
        }

        public bool IsReusable => false;
    }
}
