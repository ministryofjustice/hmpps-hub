using System;
using System.Web.Mvc;
using HMPPS.NomisApiService.Interfaces;
using Sitecore.Data.Items;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using HMPPS.Utilities.Interfaces;
using HMPPS.Site.Mvc;
using HMPPS.Utilities.Models;

namespace HMPPS.Site.Controllers.Pages
{
    [NoCacheGlobalActionFilter]
    public class BalancePageController : BaseController
    {
        private BalancePageViewModel _bpvm;
        private readonly IUserDataService _userDataService;
        private readonly INomisApiService _nomisService;

        public BalancePageController(IUserDataService userDataService, INomisApiService nomisService)
        {
            _userDataService = userDataService;
            _nomisService = nomisService;
        }

        private void BuildViewModel(Item contextItem)
        {
            _bpvm = new BalancePageViewModel();

            _bpvm.BreadcrumbItems = BreadcrumbItems;
            _bpvm.ShowAccountBalances = Sitecore.Context.PageMode.IsExperienceEditorEditing || Sitecore.Context.PageMode.IsPreview;

            var userData = _userDataService.GetUserIdamDataFromCookie(System.Web.HttpContext.Current);
            if (userData == null) return;            
                        
            //account balances
            var userAccountBalances = _userDataService.GetAccountBalancesFromSession(System.Web.HttpContext.Current);

            if (userAccountBalances == null)
            {
                var accounts = _nomisService.GetPrisonerAccounts(userData.PrisonId, userData.NameIdentifier);
                if (accounts != null)
                {
                    userAccountBalances = new UserAccountBalances(accounts.Spends, accounts.Savings, accounts.Cash,
                        DateTime.UtcNow);
                }
                else
                {
                    userAccountBalances = new UserAccountBalances(decimal.MinusOne, decimal.MinusOne, decimal.MinusOne,
                        DateTime.UtcNow);
                }
                _userDataService.SaveAccountBalancesToSession(System.Web.HttpContext.Current, userAccountBalances);
            }

            _bpvm.AccountBalancesAvailable = userAccountBalances.AreAccountBalancesAvailable;
            _bpvm.AccountSpends = userAccountBalances.AccountSpends;
            _bpvm.AccountPrivateCash = userAccountBalances.AccountPrivateCash;
            _bpvm.AccountSavings = userAccountBalances.AccountSavings;
            _bpvm.ShowAccountBalances = (contextItem["Show Account Balances"] == "1" && _bpvm.AccountBalancesAvailable) || Sitecore.Context.PageMode.IsExperienceEditorEditing || Sitecore.Context.PageMode.IsPreview;
            _bpvm.AccountBalancesLastUpdated = userAccountBalances.AccountBalancesLastUpdated;



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
