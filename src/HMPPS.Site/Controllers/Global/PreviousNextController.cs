using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Sitecore.Data.Items;
using HMPPS.Models.Cms;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using HMPPS.Site.ViewModels.Partials;
using System;
using Sitecore.Globalization;
using HMPPS.Models.Common;

namespace HMPPS.Site.Controllers.Global
{
    public class PreviousNextController : BaseController
    {
        private PrevNextViewModel _pnvm;

        private PrevNextViewModel BuildPrevNextViewModel(Item contextItem)
        {
            var prevNext = new PrevNextViewModel();
            var siblings = contextItem.Parent.Children.ToList();

            var currentItemIndex = siblings.FindIndex(i => i.ID.Guid.Equals(contextItem.ID.Guid));

            var prevItem = currentItemIndex <= 0 ? null : siblings[currentItemIndex - 1];
            var nextItem = currentItemIndex >= siblings.Count - 1 ? null : siblings[currentItemIndex + 1];

            prevNext.PreviousLink = BuildLink(prevItem);
            prevNext.NextLink = BuildLink(nextItem);

            prevNext.PreviousText = Translate.Text("Previous");
            prevNext.NextText = Translate.Text("Next");

            return prevNext;
        }

        public ActionResult Index()
        {
            _pnvm = BuildPrevNextViewModel(Sitecore.Context.Item);
            return View("/Views/Blocks/Global/PrevNext.cshtml", _pnvm);
        }

    }
}
