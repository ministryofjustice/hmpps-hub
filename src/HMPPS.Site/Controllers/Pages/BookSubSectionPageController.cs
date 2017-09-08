using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class BookSubSectionPageController : BaseController
    {
        private readonly BookSubSectionPageViewModel _bsspvm;

        public BookSubSectionPageController()
        {
            _bsspvm = new BookSubSectionPageViewModel();
        }
        public ActionResult Index()
        {
            return View("/Views/Pages/BookSubSectionPage.cshtml", _bsspvm);
        }
    }
}