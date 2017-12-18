using HMPPS.Site.ViewModels.Base;

namespace HMPPS.Site.ViewModels.Pages
{
    public class BookPageViewModel : BaseViewModel
    {
        public string BookUrl { get; set; }
        public string PrevBtnText { get; set; }
        public string NextBtnText { get; set; }
    }
}
