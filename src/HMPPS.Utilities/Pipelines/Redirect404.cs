using System.Web;
using Sitecore;
using Sitecore.Abstractions;
using Sitecore.Diagnostics;
using Sitecore.Web;


namespace HMPPS.Utilities.Pipelines
{
    public class Redirect404 : global::Sitecore.Pipelines.HttpRequest.ExecuteRequest
    {
        private readonly BaseLinkManager _baseLinkManager;

        public Redirect404(BaseSiteManager baseSiteManager, BaseItemManager baseItemManager, BaseLinkManager baseLinkManager) : base(baseSiteManager, baseItemManager)
        {
            _baseLinkManager = baseLinkManager;
        }

        protected override void PerformRedirect(string url)
        {
            if (Context.Site == null || Context.Database == null || Context.Database.Name == "core")
            {
                Log.Error(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - Attempting to redirect url {0}, but no Context Site or DB defined (or core db redirect attempted)", url), this);
                return;
            }

            // need to retrieve not found item to account for sites utilizing virtualFolder attribute
            var notFoundItem = Context.Database.GetItem(Context.Site.StartPath + Sitecore.Configuration.Settings.ItemNotFoundUrl);

            if (notFoundItem == null)
            {
                Log.Error(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - No 404 item found on site: {0}", Context.Site.Name), this);
                return;
            }

            var notFoundUrl = _baseLinkManager.GetItemUrl(notFoundItem);

            if (string.IsNullOrWhiteSpace(notFoundUrl))
            {
                Log.Error(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - Found 404 item for site, but no URL returned: {0}", Context.Site.Name), this);
                return;
            }

            Log.Debug(string.Format("HMPPS.Utilities.Pipelines.Redirect404 - Redirecting to {0}", notFoundUrl), this);
            if (Sitecore.Configuration.Settings.RequestErrors.UseServerSideRedirect)
            {
                HttpContext.Current.Server.TransferRequest(notFoundUrl);
            }
            else
                WebUtil.Redirect(notFoundUrl, false);
        }
    }
}
