using System.Web;
using System.Web.Mvc;

namespace HMPPS.Site.Mvc
{
    public class NoCacheGlobalActionFilter : ActionFilterAttribute
    {
        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            HttpCachePolicyBase cache = filterContext.HttpContext.Response.Cache;
            cache.SetAllowResponseInBrowserHistory(false);
            cache.SetCacheability(HttpCacheability.NoCache);
            cache.SetNoStore();

            base.OnResultExecuted(filterContext);
        }
    }
}
