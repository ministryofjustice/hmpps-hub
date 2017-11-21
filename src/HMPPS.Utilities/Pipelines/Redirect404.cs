using System.Web;
using Sitecore;
using Sitecore.Abstractions;
using Sitecore.Web;
using HMPPS.ErrorReporting;

namespace HMPPS.Utilities.Pipelines
{
    public class Redirect404 : global::Sitecore.Pipelines.HttpRequest.ExecuteRequest
    {
        private readonly BaseLinkManager _baseLinkManager;
        private readonly ILogManager _logManager;

        public Redirect404(BaseSiteManager baseSiteManager, BaseItemManager baseItemManager, BaseLinkManager baseLinkManager, ILogManager logManager)
            : base(baseSiteManager, baseItemManager)
        {
            _baseLinkManager = baseLinkManager;
            _logManager = logManager;
        }

        protected override void PerformRedirect(string url)
        {
            if (Context.Site == null || Context.Database == null || Context.Database.Name == "core")
            {
                _logManager.LogError(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - Attempting to redirect url {0}, but no Context Site or DB defined (or core db redirect attempted)", url), GetType());
                return;
            }

            // need to retrieve not found item to account for sites utilizing virtualFolder attribute
            var notFoundItem = Context.Database.GetItem(Context.Site.StartPath + Sitecore.Configuration.Settings.ItemNotFoundUrl);

            if (notFoundItem == null)
            {
                _logManager.LogError(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - No 404 item found on site: {0}", Context.Site.Name), GetType());
                return;
            }

            var notFoundUrl = _baseLinkManager.GetItemUrl(notFoundItem);

            if (string.IsNullOrWhiteSpace(notFoundUrl))
            {
                _logManager.LogError(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - Found 404 item for site, but no URL returned: {0}", Context.Site.Name), GetType());
                return;
            }

            _logManager.LogDebug(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - Redirecting to {0}", notFoundUrl), GetType());

            if (Sitecore.Configuration.Settings.RequestErrors.UseServerSideRedirect)
            {
                HttpContext.Current.Server.TransferRequest(notFoundUrl);
                return;
            }

            WebUtil.Redirect(notFoundUrl, false);
        }
    }
}
