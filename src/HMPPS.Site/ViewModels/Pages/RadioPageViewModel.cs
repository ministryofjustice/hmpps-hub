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

        public string CurrentEpisodeFormattedDate =>
            CurrentEpisode.Date.ToString("d MMMM yyyy", System.Globalization.CultureInfo.InvariantCulture);

        public string RadioShowPreviousEpisodesUrl { get; set; }

        public string RadioShowPosterImage { get; set; }

        public bool IsLatestEpisode { get; set; }

        public string LatestEpisodePrefixText { get; set; }
    }
}
