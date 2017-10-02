using System;
using HMPPS.Site.ViewModels.Base;

namespace HMPPS.Site.ViewModels.Pages
{
    public class BalancePageViewModel : BaseViewModel
    {
        public bool ShowAccountBalance { get; set; }

        public decimal AccountBalance { get; set; }

        public DateTime AccountBalanceLastUpdate { get; set; }

        public bool ShowPhoneCredit { get; set; }

        public decimal PhoneCredit { get; set; }

        public DateTime PhoneCreditLastUpdate { get; set; }
    }
}
