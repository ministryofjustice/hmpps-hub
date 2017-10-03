using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class SudokuGamePageController : BaseController
    {
        private SudokuGamePageViewModel _sgpvm;

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _sgpvm = new SudokuGamePageViewModel();

            _sgpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/SudokuGamePage.cshtml", _sgpvm);
        }
    }
}
