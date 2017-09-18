using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class NeontroidsGamePageController : BaseController
    {
        private NeontroidsGamePageViewModel _ngpvm;

        public NeontroidsGamePageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _ngpvm = new NeontroidsGamePageViewModel();

            _ngpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/NeontroidsGamePage.cshtml", _ngpvm);
        }
    }
}
