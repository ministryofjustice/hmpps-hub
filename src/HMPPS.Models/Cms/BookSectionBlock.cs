using HMPPS.Models.Cms.Base;
using HMPPS.Models.Common;

namespace HMPPS.Models.Cms
{
    public class BookSectionBlock : SectionBlock
    {
        public bool IsBookPage { get; set; }
        public File BookFile { get; set; }

        public BookSectionBlock()
        {
            BookFile = new File();
        }
    }
}
