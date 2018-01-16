using System.Web.Http;

namespace HMPPS.Site.App_Start
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "web-api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
