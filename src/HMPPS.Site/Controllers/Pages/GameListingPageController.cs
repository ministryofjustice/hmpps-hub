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

        public GameListingPageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _glpvm = new GameListingPageViewModel();
            foreach (var c in contextItem.Children.ToList())
            {
                var gameSectionBlock = new GameSectionBlock();

                gameSectionBlock.Title =
                    E3.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title",
                        "Page Title");
                gameSectionBlock.Image = new Image()
                {
                    Url = E3.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image"),
                    AltText = E3.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                };
                gameSectionBlock.Link = new Link()
                {
                    Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                    Title = string.Empty
                };

                _glpvm.Children.Add(gameSectionBlock);
            }
            _glpvm.BreadcrumbItems = contextItem.Axes.GetAncestors().Where(i => i["Show In Navigation"] == "1").ToList();
            _glpvm.BreadcrumbItems.Add(contextItem);
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/GameListingPage.cshtml", _glpvm);
        }
    }
}
