using HMPPS.Site.ViewModels.Base;

namespace HMPPS.Site.ViewModels.Pages
{
    public class HomepageViewModel : BaseViewModel
    {
        public bool ShowQuickLinks { get; set; }
        public string SelfHelpLinkUrl { get; set; }
        public bool IsUserLoggedIn { get; set; }
        public string UserFirstName { get; set; }
    }
}
