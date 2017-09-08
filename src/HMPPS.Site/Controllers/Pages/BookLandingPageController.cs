using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class BookLandingPageController : BaseController
    {
        private readonly BookLandingPageViewModel _blpvm;

        public BookLandingPageController()
        {
            _blpvm = new BookLandingPageViewModel();
        }
        public ActionResult Index()
        {
            return View("/Views/Pages/BookLandingPage.cshtml", _blpvm);
        }
    }
}