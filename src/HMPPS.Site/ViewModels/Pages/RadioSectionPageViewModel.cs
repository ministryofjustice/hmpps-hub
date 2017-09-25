using System.Collections.Generic;
using HMPPS.Site.ViewModels.Base;
using HMPPS.Models.Cms;

namespace HMPPS.Site.ViewModels.Pages
{
    public class RadioSectionPageViewModel : BaseViewModel
    {
        public RadioSectionPageViewModel()
        {
            Children = new List<RadioSectionBlock>();
        }
        public List<RadioSectionBlock> Children { get; set; }
    }
}
