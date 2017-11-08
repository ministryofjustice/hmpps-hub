using System.Linq;
using HMPPS.Site.ViewModels.Base;
using HMPPS.Site.ViewModels.Partials;

namespace HMPPS.Site.ViewModels.Pages
{
    public class ErrorPageViewModel : BaseViewModel
    {
        public ErrorPageViewModel()
        {
        }

        public int StatusCode { get; set; }

        public int SubStatusCode { get; set; }

    }
}
