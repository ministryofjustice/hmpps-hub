using System.Linq;
using HMPPS.Site.ViewModels.Base;
using HMPPS.Site.ViewModels.Partials;

namespace HMPPS.Site.ViewModels.Pages
{
    public class GeneralContentPageViewModel : BaseViewModel
    {
        public GeneralContentPageViewModel()
        {
            RelatedPagesLeftColumn = new RelatedPagesViewModel();
            RelatedPagesRightColumn = new RelatedPagesViewModel();
            PrevNext = new PrevNextViewModel();
        }

        public string CurrentPageUrl { get; set; }
        public RelatedPagesViewModel RelatedPagesLeftColumn { get; set; }
        public RelatedPagesViewModel RelatedPagesRightColumn { get; set; }
        public string RelatedPagesAriaLabel { get; set; }

        public bool ShowRelatedPages => RelatedPagesLeftColumn.RelatedPages.Any() || RelatedPagesRightColumn.RelatedPages.Any();
        public PrevNextViewModel PrevNext { get; set; }
    }
}
