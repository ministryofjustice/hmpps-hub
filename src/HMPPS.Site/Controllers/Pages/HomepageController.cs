using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using HMPPS.Utilities.Interfaces;
using HMPPS.ContactIdentification.Services;

namespace HMPPS.Site.Controllers.Pages
{
    public class HomepageController : BaseController
    {
        private HomepageViewModel _hvm;
        private readonly IUserDataService _userDataService;

        public HomepageController(IUserDataService userDataService)
        {
            _userDataService = userDataService;
        }
        public ActionResult Index()
        {
            var cis = new ContactIdentificationService();
            cis.IdentifyTrackerContact();
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/Homepage.cshtml", _hvm);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _hvm = new HomepageViewModel();

            var userData = _userDataService.GetUserDataFromCookie(System.Web.HttpContext.Current);
            if (userData == null) return;

            _hvm.SelfHelpLinkUrl = contextItem["Self Help Link Url Template"].Replace("{prison_id}",
                userData.PrisonId.ToLower());
            _hvm.ShowQuickLinks = !string.IsNullOrEmpty(_hvm.SelfHelpLinkUrl);
        }
    }
}
