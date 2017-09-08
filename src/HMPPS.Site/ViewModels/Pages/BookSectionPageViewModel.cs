using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using Sitecore.Data.Items;

namespace HMPPS.Site.ViewModels.Pages
{
    public class BookSectionPageViewModel : BaseViewModel
    {
        public BookSectionPageViewModel()
        {
            Children = new List<Item>();
            BreadcrumbItems = new List<Item>();
        }
        public List<Item> Children { get; set; }
        public List<Item> BreadcrumbItems { get; set; }
    }
}