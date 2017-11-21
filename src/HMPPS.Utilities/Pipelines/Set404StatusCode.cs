using Sitecore.Pipelines.HttpRequest;
using System;
using System.Web;
using System.Net;
using HMPPS.ErrorReporting;
using HMPPS.Utilities.Helpers;

namespace HMPPS.Utilities.Pipelines
{
    public class Set404StatusCode : HttpRequestBase
    {
        private ILogManager _logManager;

        public Set404StatusCode()
        {
            _logManager = DependencyInjectionHelper.ResolveService<ILogManager>();
        }

        protected override void Execute(HttpRequestArgs args)
        {
            // retain 500 response if previously set
            if (HttpContext.Current.Response.StatusCode >= 500 || args.Context.Request.RawUrl == "/")
                return;

            // return if request does not end with value set in ItemNotFoundUrl, i.e. successful page
            if (!args.Context.Request.Url.LocalPath.EndsWith(Sitecore.Configuration.Settings.ItemNotFoundUrl, StringComparison.InvariantCultureIgnoreCase))
                return;

            _logManager.LogWarning(string.Format("HMPPS.Utilities.Pipelines.Set404StatusCode - Page Not Found: {0}, current status: {1}", args.Context.Request.RawUrl, HttpContext.Current.Response.StatusCode), GetType());
            HttpContext.Current.Response.TrySkipIisCustomErrors = true;
            HttpContext.Current.Response.StatusCode = (int)HttpStatusCode.NotFound;
            HttpContext.Current.Response.StatusDescription = "Page not found";
        }
    }
}


