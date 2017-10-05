using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using HMPPS.Models.Cms;

namespace HMPPS.Site.ViewModels.Pages
{
    public class VideoSectionPageViewModel : BaseViewModel
    {
        public VideoSectionPageViewModel()
        {
            Children = new List<VideoSectionBlock>();
        }
        public List<VideoSectionBlock> Children { get; set; }
    }
}
