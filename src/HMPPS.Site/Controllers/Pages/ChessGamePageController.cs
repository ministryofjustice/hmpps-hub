using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class ChessGamePageController : BaseController
    {
        private ChessGamePageViewModel _cgpvm;

        public ChessGamePageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _cgpvm = new ChessGamePageViewModel();

            _cgpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/ChessGamePage.cshtml", _cgpvm);
        }
    }
}
