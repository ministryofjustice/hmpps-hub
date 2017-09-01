using System.Web.Mvc;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class HomepageController : Controller
    {
        private readonly HomepageViewModel _hvm;

        public HomepageController()
        {
            _hvm = new HomepageViewModel();
        }
        public ActionResult Index()
        {
            return View("/Views/Pages/Homepage.cshtml", _hvm);
        }
    }
}