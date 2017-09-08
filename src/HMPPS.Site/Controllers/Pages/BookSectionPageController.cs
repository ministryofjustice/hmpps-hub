using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class BookSectionPageController : BaseController
    {
        private readonly BookSectionPageViewModel _bspvm;

        public BookSectionPageController()
        {
            _bspvm = new BookSectionPageViewModel();
        }
        public ActionResult Index()
        {
            return View("/Views/Pages/BookSectionPage.cshtml", _bspvm);
        }
    }
}