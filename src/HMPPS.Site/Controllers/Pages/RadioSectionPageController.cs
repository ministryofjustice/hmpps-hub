using System.Linq;
using System.Web.Mvc;
using HMPPS.Models;
using HMPPS.Models.Cms;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data.Items;

namespace HMPPS.Site.Controllers.Pages
{
    public class RadioSectionPageController : BaseController
    {
        private RadioSectionPageViewModel _rspvm;

        public RadioSectionPageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Item contextItem)
        {
            _rspvm = new RadioSectionPageViewModel();
            foreach (var c in contextItem.Children.ToList())
            {
                var radioSection = new RadioSectionBlock();

                radioSection.Title =
                    Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title",
                        "Page Title");
                radioSection.Image = new Image()
                {
                    Url = Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image"),
                    AltText = Utilities.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                };
                radioSection.Link = new Link()
                {
                    Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                    Text = string.Empty
                };
                _rspvm.Children.Add(radioSection);
            }
            _rspvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/RadioSectionPage.cshtml", _rspvm);
        }
    }
}
