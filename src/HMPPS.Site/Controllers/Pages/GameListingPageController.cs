using System.Linq;
using System.Web.Mvc;
using HMPPS.Models;
using HMPPS.Models.Cms;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class GameListingPageController : BaseController
    {
        private GameListingPageViewModel _glpvm;

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _glpvm = new GameListingPageViewModel();
            foreach (var c in contextItem.Children.ToList())
            {
                var gameSectionBlock = new GameSectionBlock();

                gameSectionBlock.Title =
                    Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title",
                        "Page Title");
                gameSectionBlock.Image = new Image()
                {
                    Url = Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image", 300),
                    AltText = Utilities.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                };
                gameSectionBlock.Link = new Link()
                {
                    Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                    Text = string.Empty
                };

                _glpvm.Children.Add(gameSectionBlock);
            }
            _glpvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/GameListingPage.cshtml", _glpvm);
        }
    }
}
