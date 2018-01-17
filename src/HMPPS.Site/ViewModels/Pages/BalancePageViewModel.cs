using System;
using HMPPS.Site.ViewModels.Base;

namespace HMPPS.Site.ViewModels.Pages
{
    public class BalancePageViewModel : BaseViewModel
    {
        public bool ShowAccountBalances { get; set; }

        public bool AccountBalancesAvailable { get; set; }

        public decimal AccountSpends { get; set; }

        public decimal AccountPrivateCash { get; set; }

        public decimal AccountSavings { get; set; }

        public DateTime AccountBalancesLastUpdated { get; set; }

        public bool ShowPhoneCredit { get; set; }

        public decimal PhoneCredit { get; set; }

        public DateTime PhoneCreditLastUpdate { get; set; }
    }
}
