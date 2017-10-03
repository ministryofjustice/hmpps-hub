using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class HomepageController : BaseController
    {

        public ActionResult Index()
        {
            var hvm = new HomepageViewModel();
            return View("/Views/Pages/Homepage.cshtml", hvm);
        }
    }
}
