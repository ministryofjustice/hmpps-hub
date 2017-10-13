using System.Collections.Generic;
using HMPPS.Models.Common;

namespace HMPPS.Site.ViewModels.Partials
{
    public class RelatedPagesViewModel
    {
        public RelatedPagesViewModel()
        {
            RelatedPages = new List<Link>();
        }
        public List<Link> RelatedPages { get; set; }
        public byte StartIndex { get; set; }
        public string CurrentPageUrl { get; set; }
    }
}
