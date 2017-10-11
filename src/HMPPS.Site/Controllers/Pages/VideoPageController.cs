using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class VideoPageController : BaseController
    {
        private VideoPageViewModel _vpvm;

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _vpvm = new VideoPageViewModel();

            _vpvm.VideoUrl = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(contextItem, "Video File");

            _vpvm.ThumbnailImageUrl = Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(contextItem, "Thumbnail Image");

            _vpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/VideoPage.cshtml", _vpvm);
        }
    }
}
