using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class HomepageController : BaseController
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
