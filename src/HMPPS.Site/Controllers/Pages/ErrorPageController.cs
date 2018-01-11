using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data.Items;

namespace HMPPS.Site.Controllers.Pages
{
    public class ErrorPageController : BaseController
    {
        private ErrorPageViewModel _epvm;

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/ErrorPage.cshtml", _epvm);
        }

        private void BuildViewModel(Item contextItem)
        {
            _epvm = new ErrorPageViewModel();
            _epvm.StatusCode = GetIntegerFieldValue(contextItem, "StatusCode");
            _epvm.SubStatusCode = GetIntegerFieldValue(contextItem, "SubStatusCode");
        }

        private int GetIntegerFieldValue(Item item, string fieldName)
        {
            var field = item.Fields[fieldName];
            if (field == null)
                return 0;
            var fieldValue = field.GetValue(true);
            if (string.IsNullOrEmpty(fieldValue))
                return 0;
            int fieldIntegerValue;
            if (int.TryParse(fieldValue, out fieldIntegerValue))
                return fieldIntegerValue;
            return 0;
        }
    }
}
