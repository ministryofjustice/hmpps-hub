using HMPPS.Models.Common;

namespace HMPPS.Models.Cms
{
    public class GameSectionBlock
    {
        public string Title { get; set; }
        public Link Link { get; set; }
        public Image Image { get; set; }

        public GameSectionBlock()
        {
            Link = new Link();
            Image = new Image();
        }
    }
}
