using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data.Items;

namespace HMPPS.Site.Controllers.Pages
{
    public class GeneralContentPageController : BaseController
    {
        private GeneralContentPageViewModel _gcpvm;

        public GeneralContentPageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Item contextItem)
        {
            _gcpvm = new GeneralContentPageViewModel();

            _gcpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/GeneralContentPage.cshtml", _gcpvm);
        }
    }
}
