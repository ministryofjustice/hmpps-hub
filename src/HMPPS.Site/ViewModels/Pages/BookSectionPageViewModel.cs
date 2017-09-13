using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using Sitecore.Data.Items;
using HMPPS.Models;
using HMPPS.Models.Cms;

namespace HMPPS.Site.ViewModels.Pages
{
    public class BookSectionPageViewModel : BaseViewModel
    {
        public BookSectionPageViewModel()
        {
            Children = new List<BookSectionBlock>();
            BreadcrumbItems = new List<Item>();
        }
        public List<BookSectionBlock> Children { get; set; }
        public List<Item> BreadcrumbItems { get; set; }
    }
}