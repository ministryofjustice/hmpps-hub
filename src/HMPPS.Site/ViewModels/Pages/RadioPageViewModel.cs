using System.Collections.Generic;
using HMPPS.Models.Cms;
using HMPPS.Site.ViewModels.Base;

namespace HMPPS.Site.ViewModels.Pages
{
    public class RadioPageViewModel : BaseViewModel
    {
        public RadioPageViewModel()
        {
            PreviousEpisodes = new List<RadioEpisode>();
        }

        public List<RadioEpisode> PreviousEpisodes { get; set; }

        public string CurrentEpisodeUrl { get; set; }
    }
}
