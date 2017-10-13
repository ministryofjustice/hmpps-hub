using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Sitecore.Data.Items;
using HMPPS.Models.Common;
using Sitecore.Data.Managers;

namespace HMPPS.Site.Controllers.Base
{
    public class BaseController : Controller
    {
        public BaseController()
        {
            if (Sitecore.Context.Item != null)
            {
                BuildBreadcrumb(Sitecore.Context.Item);
            }
        }

        private void BuildBreadcrumb(Item contextItem)
        {
            BreadcrumbItems = contextItem.Axes.GetAncestors().Where(i => i["Show In Navigation"] == "1").ToList();
            BreadcrumbItems.Add(contextItem);
        }

        public List<Item> BreadcrumbItems { get; set; }

        public static Link BuildLink(Item pageItem)
        {
            if (pageItem == null)
                return new Link();

            var baseTemplates = TemplateManager.GetTemplate(pageItem).GetBaseTemplates();
            if (!baseTemplates.Any(t => t.Name.Equals("Core", System.StringComparison.InvariantCultureIgnoreCase)))
                return new Link();

            return new Link()
            {
                NewTarget = false,
                Text =
                    Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(pageItem,
                        "Navigation Title",
                        "Page Title"),
                Url = Sitecore.Links.LinkManager.GetItemUrl(pageItem)
            };

        }
    }
}
