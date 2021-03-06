using HMPPS.Site.ViewModels.Partials;
using System.Web.Mvc;
namespace HMPPS.Site.Controllers.Shared
{
    public class MvcLayoutController : Controller
    {
        private const string siteSettingsItemPath = "/sitecore/content/Global/HMPPS/Site Settings";

        // GET: Head
        public ActionResult Head()
        {
            var headModel = new HeadViewModel(Sitecore.Context.Database.Items[siteSettingsItemPath], Sitecore.Context.Item);
            return View("/Views/Partials/_Head.cshtml", headModel);
        }

        // GET: CookieMessage
        public ActionResult CookieMessage()
        {
            return View("/Views/Partials/_CookieMessage.cshtml", Sitecore.Context.Database.Items[siteSettingsItemPath]);
        }

        // GET: SkipLink
        public ActionResult SkipLink()
        {
            return View("/Views/Partials/_SkipLink.cshtml", Sitecore.Context.Database.Items[siteSettingsItemPath]);
        }

        // GET: Header
        public ActionResult Header()
        {
            var headerModel = new HeaderViewModel(Sitecore.Context.Database.Items[siteSettingsItemPath]);
            return View("/Views/Partials/_Header.cshtml", headerModel);
        }
    }
}
