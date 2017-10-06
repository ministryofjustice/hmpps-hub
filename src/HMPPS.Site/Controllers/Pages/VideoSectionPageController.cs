using HMPPS.Models;
using HMPPS.Models.Cms;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using System.Linq;
using System.Web.Mvc;

namespace HMPPS.Site.Controllers.Pages
{
    public class VideoSectionPageController : BaseController
    {
        private VideoSectionPageViewModel _vspvm;

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _vspvm = new VideoSectionPageViewModel();
            foreach (var c in contextItem.Children.OrderBy(v => v.Name).ToList())
            {
                var isVideoPage = c.TemplateName == "Video Page";

                var videoSection = new VideoSectionBlock();

                videoSection.Title =
                    Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title",
                        "Page Title");
                videoSection.Image = new Image()
                {
                    Url = Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image"),
                    AltText = Utilities.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                };
                videoSection.Link = new Link()
                {
                    Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                    Text = string.Empty
                };
                videoSection.IsVideoPage = isVideoPage;

                if (videoSection.IsVideoPage)
                {
                    videoSection.VideoFile = new File()
                    {
                        Url = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(c, "Video File"),
                        Extension = Utilities.SitecoreHelper.FieldMethods.GetFilExtension(c, "Video File")
                    };
                }


                _vspvm.Children.Add(videoSection);
            }
            _vspvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/VideoSectionPage.cshtml", _vspvm);
        }
    }
}
