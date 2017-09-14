using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using Sitecore.Data.Items;
using HMPPS.Models.Cms;

namespace HMPPS.Site.ViewModels.Pages
{
    public class GameListingPageViewModel : BaseViewModel
    {
        public GameListingPageViewModel()
        {
            Children = new List<GameSectionBlock>();
            BreadcrumbItems = new List<Item>();
        }
        public List<GameSectionBlock> Children { get; set; }
        public List<Item> BreadcrumbItems { get; set; }
    }
}
