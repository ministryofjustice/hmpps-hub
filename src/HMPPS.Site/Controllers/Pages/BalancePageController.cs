using System;
using System.Web.Mvc;
using Sitecore.Data.Items;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using HMPPS.Utilities.Interfaces;
using HMPPS.Site.Mvc;

namespace HMPPS.Site.Controllers.Pages
{
    [NoCacheGlobalActionFilter]
    public class BalancePageController : BaseController
    {
        private BalancePageViewModel _bpvm;
        private readonly IUserDataService _userDataService;

        public BalancePageController(IUserDataService userDataService)
        {
            _userDataService = userDataService;
        }

        private void BuildViewModel(Item contextItem)
        {
            _bpvm = new BalancePageViewModel();

            _bpvm.BreadcrumbItems = BreadcrumbItems;

            var userData = _userDataService.GetUserDataFromCookie(System.Web.HttpContext.Current);
            if (userData == null) return;            
                        
            //account balances
            _bpvm.AccountBalancesAvailable = userData.AreAccountBalancesAvailable;
            _bpvm.AccountSpends = userData.AccountSpends;
            _bpvm.AccountPrivateCash = userData.AccountPrivateCash;
            _bpvm.AccountSavings = userData.AccountSavings;
            _bpvm.ShowAccountBalances = (contextItem["Show Account Balances"] == "1" && _bpvm.AccountBalancesAvailable) || Sitecore.Context.PageMode.IsExperienceEditorEditing;
            _bpvm.AccountBalancesLastUpdated = userData.AccountBalancesLastUpdated;
            //phone credit
            _bpvm.PhoneCredit = 0; //TODO when BT API available
            _bpvm.ShowPhoneCredit = contextItem["Show Phone Credit"] == "1";
            _bpvm.PhoneCreditLastUpdate = DateTime.Now;
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/BalancePage.cshtml", _bpvm);
        }
    }
}
