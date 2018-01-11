using System.Web.Mvc;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Globalization;

namespace HMPPS.Site.Controllers.Pages
{
    public class BookPageController : BaseController
    {
        private BookPageViewModel _bpvm;

        private void BuildViewModel(Sitecore.Data.Items.Item contextItem)
        {
            _bpvm = new BookPageViewModel();
            _bpvm.PrevBtnText = Translate.Text("Previous");
            _bpvm.NextBtnText = Translate.Text("Next");
            _bpvm.BookUrl = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(contextItem, "Book File");
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/BookPage.cshtml", _bpvm);
        }
    }
}
