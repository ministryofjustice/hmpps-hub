using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using HMPPS.Models.Cms;

namespace HMPPS.Site.ViewModels.Pages
{
    public class BookSectionPageViewModel : BaseViewModel
    {
        public BookSectionPageViewModel()
        {
            Children = new List<BookSectionBlock>();
        }
        public List<BookSectionBlock> Children { get; set; }

        public string NewWindowWarning { get; set; }
    }
}
