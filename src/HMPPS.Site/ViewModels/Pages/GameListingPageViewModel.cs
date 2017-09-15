using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using HMPPS.Models.Cms;

namespace HMPPS.Site.ViewModels.Pages
{
    public class GameListingPageViewModel : BaseViewModel
    {
        public GameListingPageViewModel()
        {
            Children = new List<GameSectionBlock>();
        }
        public List<GameSectionBlock> Children { get; set; }
    }
}
