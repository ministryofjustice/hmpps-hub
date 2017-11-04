using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data.Items;

namespace HMPPS.Site.Controllers.Pages
{
    public class ErrorPageController : BaseController
    {
        private ErrorPageViewModel _epvm;

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/ErrorPage.cshtml", _epvm);
        }

        private void BuildViewModel(Item contextItem)
        {
            _epvm = new ErrorPageViewModel();
        }
    }
}
