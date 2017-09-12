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
            Children = new List<Book>();
            BreadcrumbItems = new List<Item>();
        }
        public List<Book> Children { get; set; }
        public List<Item> BreadcrumbItems { get; set; }
    }
}