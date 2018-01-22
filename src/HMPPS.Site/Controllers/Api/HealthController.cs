using HMPPS.ErrorReporting;
using HMPPS.HealthCheck;
using HMPPS.NomisApiService.Interfaces;
using HMPPS.Utilities.Helpers;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sitecore.Mvc.Extensions;

namespace HMPPS.Site.Controllers.Api
{
    public class HealthController : ApiController
    {
        private readonly HealthCheckService _healthCheckService;

        public HealthController()
        {
            var logManager = DependencyInjectionHelper.ResolveService<ILogManager>();
            var nomisApiService = DependencyInjectionHelper.ResolveService<INomisApiService>();

            var config = new HealthCheckConfig
            {
                MongoDbConnectionString = ConfigurationManager.ConnectionStrings["analytics"].ConnectionString,
                RedisDbConnectionString = ConfigurationManager.ConnectionStrings["redis.sessions"]?.ConnectionString,
                IdamHealthCheckUrl = ConfigurationManager.AppSettings["HMPPS.Authentication.HealthCheckEndpoint"].ValueOrEmpty()
            };

            _healthCheckService = new HealthCheckService(logManager, nomisApiService, config);
        }

        [HttpGet]
        public HttpResponseMessage Index()
        {
            var checksToRun = ConfigurationManager.AppSettings["HMPPS.Site.HealthCheckOperations"]?.Split(',');

            var checkResults = _healthCheckService.GetHealthCheckResults(checksToRun);

            return Request.CreateResponse(checkResults.Any(c => !c.Healthy) ? HttpStatusCode.InternalServerError : HttpStatusCode.OK, checkResults);
        }
    }
}
