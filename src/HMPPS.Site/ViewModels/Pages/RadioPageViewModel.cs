using System;
using System.Collections.Generic;
using HMPPS.Models.Cms;
using HMPPS.Site.ViewModels.Base;

namespace HMPPS.Site.ViewModels.Pages
{
    public class RadioPageViewModel : BaseViewModel
    {
        public RadioPageViewModel()
        {
            NeighbourEpisodes = new List<RadioEpisode>();
            CurrentEpisode = new RadioEpisode();
        }

        public List<RadioEpisode> NeighbourEpisodes { get; set; }

        public RadioEpisode CurrentEpisode { get; set; }
    }
}
