using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data.Items;
using System.Web.Mvc;

namespace HMPPS.Site.Controllers.Pages
{
    public class LandingPageController : BaseController
    {
        LandingPageViewModel _model;

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);

            return View("/Views/Pages/LandingPage.cshtml", _model);
        }

        private void BuildViewModel(Item item)
        {
            _model = new LandingPageViewModel
            {
                BreadcrumbItems = BreadcrumbItems
            };
        }
    }
}
