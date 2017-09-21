using System.Collections.Generic;
using Sitecore.Data.Items;

namespace HMPPS.Site.ViewModels.Base
{
    public class BaseViewModel
    {
        public BaseViewModel()
        {
            BreadcrumbItems = new List<Item>();
        }
        public List<Item> BreadcrumbItems { get; set; }
    }
}
