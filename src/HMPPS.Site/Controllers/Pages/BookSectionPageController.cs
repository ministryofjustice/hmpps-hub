using System.Linq;
using System.Web.Mvc;
using HMPPS.Models;
using HMPPS.Models.Cms;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Globalization;

namespace HMPPS.Site.Controllers.Pages
{
    public class BookSectionPageController : BaseController
    {
        private BookSectionPageViewModel _bspvm;

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _bspvm = new BookSectionPageViewModel();
            _bspvm.NewWindowWarning = Translate.Text("New Window Warning");

            foreach (var c in contextItem.Children.ToList())
            {
                var isBookPage = c.TemplateName == "Book Page";

                var bookSection = new BookSectionBlock();

                bookSection.Title =
                    Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title",
                        "Page Title");
                bookSection.Image = new Image()
                {
                    Url = Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image", 300),
                    AltText = Utilities.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                };
                bookSection.Link = new Link()
                {
                    Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                    Text = string.Empty
                };
                bookSection.IsBookPage = isBookPage;


                if (bookSection.IsBookPage)
                {
                    bookSection.BookFile = new File()
                    {
                        Url = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(c, "Book File"),
                        Extension = Utilities.SitecoreHelper.FieldMethods.GetFileExtension(c, "Book File")
                    };
                    //pdf books should open in a new tab, not use the book page meant for epubs
                    if (bookSection.BookFile.Extension.ToLower() == "pdf")
                        bookSection.Link.Url = bookSection.BookFile.Url;
                }

                if (!string.IsNullOrEmpty(bookSection.Link.Url))
                    _bspvm.Children.Add(bookSection);

            }
            _bspvm.BreadcrumbItems = BreadcrumbItems;
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/BookSectionPage.cshtml", _bspvm);
        }
    }
}
