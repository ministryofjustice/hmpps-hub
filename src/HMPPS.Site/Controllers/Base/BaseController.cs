using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Sitecore.Data.Items;

namespace HMPPS.Site.Controllers.Base
{
    public class BaseController : Controller
    {
        public BaseController()
        {
            BuildBreadcrumb(Sitecore.Context.Item);
        }

        private void BuildBreadcrumb(Item contextItem)
        {
            BreadcrumbItems = contextItem.Axes.GetAncestors().Where(i => i["Show In Navigation"] == "1").ToList();
            BreadcrumbItems.Add(contextItem);
        }

        public List<Item> BreadcrumbItems { get; set; }
    }
}
