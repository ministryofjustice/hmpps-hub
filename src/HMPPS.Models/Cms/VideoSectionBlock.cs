using HMPPS.Models.Cms.Base;
using HMPPS.Models.Common;

namespace HMPPS.Models.Cms
{
    public class VideoSectionBlock : SectionBlock
    {
        public bool IsVideoPage { get; set; }
        public File VideoFile { get; set; }

        public VideoSectionBlock()
        {
            VideoFile = new File();
        }
    }
}
