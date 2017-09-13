using System.Linq;
using System.Web.Mvc;
using HMPPS.Models;
using HMPPS.Models.Cms;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;

namespace HMPPS.Site.Controllers.Pages
{
    public class BookSectionPageController : BaseController
    {
        private BookSectionPageViewModel _bspvm;

        public BookSectionPageController()
        {          
            BuildViewModel(Sitecore.Context.Item);
        }

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _bspvm = new BookSectionPageViewModel();
            contextItem.Children.ToList().ForEach(c =>
                _bspvm.Children.Add(new Book()
                {
                    Title = E3.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title", "Page Title"),
                    Image = new Image()
                    {
                        Url = E3.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image"),
                        AltText = E3.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                    },
                    Link = new Link()
                    {
                        Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                        NewTarget = false,
                        Title = string.Empty
                    },
                    OpenEreader = false
                })
            );
            _bspvm.BreadcrumbItems = contextItem.Axes.GetAncestors().Where(i => i["Show In Navigation"] == "1").ToList();
            _bspvm.BreadcrumbItems.Add(contextItem);
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/BookSectionPage.cshtml", _bspvm);
        }
    }
}