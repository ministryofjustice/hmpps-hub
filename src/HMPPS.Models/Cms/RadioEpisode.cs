using System;

namespace HMPPS.Models.Cms
{
    public class RadioEpisode
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public string FileUrl { get; set; }

        public DateTime Date { get; set; }

        public string RadioEpisodeUrl { get; set; }
    }
}
