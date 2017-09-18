using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class SudokuGamePageController : BaseController
    {
        private SudokuGamePageViewModel _sgpvm;

        public SudokuGamePageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _sgpvm = new SudokuGamePageViewModel();

            _sgpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/SudokuGamePage.cshtml", _sgpvm);
        }
    }
}
