using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using HMPPS.Models.Common;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using HMPPS.Site.ViewModels.Partials;
using Sitecore.Data.Items;
using Sitecore.Globalization;

namespace HMPPS.Site.Controllers.Pages
{
    public class GeneralContentPageController : BaseController
    {
        private GeneralContentPageViewModel _gcpvm;

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/GeneralContentPage.cshtml", _gcpvm);
        }

        private void BuildViewModel(Item contextItem)
        {
            _gcpvm = new GeneralContentPageViewModel();

            _gcpvm.BreadcrumbItems = BreadcrumbItems;

            //related pages
            var relatedPageItems = Utilities.SitecoreHelper.FieldMethods.GetTreelistSelectedItems(contextItem,
                "Related Pages");          
            if (relatedPageItems.Any())
            {
                _gcpvm.RelatedPagesAriaLabel = contextItem["Related Pages Aria Label"];

                var itemCount = relatedPageItems.Count;
                var midIndex = (byte) (itemCount / 2 + itemCount % 2);
                var splitIn2Columns = itemCount > 2;
                var leftColumnPageItems = splitIn2Columns ? relatedPageItems.Take(midIndex).ToList() : relatedPageItems;
                var rightColumnPageItems = splitIn2Columns ? relatedPageItems.Skip(midIndex).Take(itemCount - midIndex).ToList() : new List<Item>();
                _gcpvm.RelatedPagesLeftColumn = new RelatedPagesViewModel()
                {
                    CurrentPageUrl = Sitecore.Links.LinkManager.GetItemUrl(contextItem),
                    RelatedPages = GetRelatedPageLinks(leftColumnPageItems),
                    StartIndex = 1
                };
                _gcpvm.RelatedPagesRightColumn = new RelatedPagesViewModel()
                {
                    CurrentPageUrl = Sitecore.Links.LinkManager.GetItemUrl(contextItem),
                    RelatedPages = GetRelatedPageLinks(rightColumnPageItems),
                    StartIndex = (byte)(midIndex + 1)
                };
            }

            //prev/next links
            _gcpvm.PrevNext.PreviousLink = GetPrevNextItem(contextItem, "Previous Page");
            _gcpvm.PrevNext.NextLink = GetPrevNextItem(contextItem, "Next Page");
            _gcpvm.PrevNext.PreviousText = Translate.Text("Previous");
            _gcpvm.PrevNext.NextText = Translate.Text("Next");
        }

        private Link GetPrevNextItem(Item contextItem, string fieldName)
        {
            var pageItem = Utilities.SitecoreHelper.FieldMethods.GetRefFieldSelectedItem(contextItem,
                fieldName);
            return BuildLink(pageItem);
        }

        private List<Link> GetRelatedPageLinks(List<Item> items)
        {
            return items.Select(item => new Link()
            {
                NewTarget = false, Text = Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(item, "Navigation Title", "Page Title"), Url = Sitecore.Links.LinkManager.GetItemUrl(item)
            }).ToList();
        }
    }
}
