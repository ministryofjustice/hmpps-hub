using HMPPS.HealthCheck;
using System.Web;

namespace HMPPS.Site.handlers
{
    public class Health : IHttpHandler
    {
        private HealthCheckService _healthCheckService;

        public Health()
        {

        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
