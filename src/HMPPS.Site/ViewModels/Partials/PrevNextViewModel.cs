using HMPPS.Models.Common;

namespace HMPPS.Site.ViewModels.Partials
{
    public class PrevNextViewModel
    {
        public PrevNextViewModel()
        {
            PreviousLink = new Link();
            NextLink = new Link();
        }
        public Link PreviousLink { get; set; }

        public Link NextLink { get; set; }

        public string PreviousText { get; set; }

        public string NextText { get; set; }

        public bool ShowComponent => !string.IsNullOrEmpty(PreviousLink.Url) || !string.IsNullOrEmpty(NextLink.Url);
    }
}
