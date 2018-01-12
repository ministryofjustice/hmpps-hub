using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using HMPPS.Utilities.Interfaces;
using HMPPS.ErrorReporting;

namespace HMPPS.Site.Controllers.Pages
{
    public class HomepageController : BaseController
    {
        private HomepageViewModel _hvm;
        private readonly IUserDataService _userDataService;
        private readonly ILogManager _logManager;

        public HomepageController(IUserDataService userDataService, ILogManager logManager)
        {
            _userDataService = userDataService;
            _logManager = logManager;
        }
        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/Homepage.cshtml", _hvm);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _hvm = new HomepageViewModel();

            _hvm.IsUserLoggedIn = Sitecore.Context.User.IsAuthenticated;

            var userData = _userDataService.GetUserDataFromCookie(System.Web.HttpContext.Current);
            if (userData == null) return;

            var unilinkPrisonId = userData.PrisonId.Length > 2
                ? userData.PrisonId.Substring(0, 2).ToLower()
                : userData.PrisonId.ToLower();
            _hvm.SelfHelpLinkUrl = contextItem["Self Help Link Url Template"].Replace("{prison_id}",
                unilinkPrisonId);

            _hvm.ShowQuickLinks = !string.IsNullOrEmpty(_hvm.SelfHelpLinkUrl);

            var textInfo = CultureInfo.CurrentCulture.TextInfo;
            _hvm.UserFirstName = textInfo.ToTitleCase(userData.GivenName.ToLower());
        }
    }
}
