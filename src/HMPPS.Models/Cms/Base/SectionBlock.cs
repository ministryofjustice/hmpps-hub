using HMPPS.Models.Common;

namespace HMPPS.Models.Cms.Base
{
    public class SectionBlock
    {
        public string Title { get; set; }
        public Link Link { get; set; }
        public Image Image { get; set; }

        public SectionBlock()
        {
            Link = new Link();
            Image = new Image();
        }
    }
}
