﻿using System.Linq;
using System.Web.Mvc;
using HMPPS.Models;
using HMPPS.Models.Cms;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Resources.Media;

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
            foreach (var c in contextItem.Children.ToList())
            {
                var isBookPage = c.TemplateName == "Book Page";

                var bookSection = new BookSectionBlock();

                bookSection.Title =
                    E3.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(c, "Navigation Title",
                        "Page Title");
                bookSection.Image = new Image()
                {
                    Url = E3.SitecoreHelper.FieldMethods.GetMediaItemUrlWithHash(c, "Thumbnail Image"),
                    AltText = E3.SitecoreHelper.FieldMethods.GetImageDescription(c, "Thumbnail Image")
                };
                bookSection.Link = new Link()
                {
                    Url = Sitecore.Links.LinkManager.GetItemUrl(c),
                    Title = string.Empty
                };
                bookSection.IsBookPage = isBookPage;
                bookSection.BookFileUrl =
                    isBookPage
                        ? MediaManager.GetMediaUrl(
                            ((Sitecore.Data.Fields.FileField)c.Fields["Book File"]).MediaItem)
                        : string.Empty;

                _bspvm.Children.Add(bookSection);
            }
            _bspvm.BreadcrumbItems = contextItem.Axes.GetAncestors().Where(i => i["Show In Navigation"] == "1").ToList();
            _bspvm.BreadcrumbItems.Add(contextItem);
        }

        public ActionResult Index()
        {
            return View("/Views/Pages/BookSectionPage.cshtml", _bspvm);
        }
    }
}