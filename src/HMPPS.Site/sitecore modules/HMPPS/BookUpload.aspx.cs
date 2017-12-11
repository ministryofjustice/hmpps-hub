using System;
using System.Threading.Tasks;
using System.Web;
using HMPPS.Utilities.CsvUpload;
using Sitecore.Data;
using Sitecore.sitecore.admin;

namespace HMPPS.Site.sitecore_modules.HMPPS
{
    /// <summary>
    /// Book upload tool admin page
    /// </summary>
    public partial class BookUpload : AdminPage
    {
        private BookUploadCsvService _csvService;
        private BookUploadSitecoreService _scService;

        private readonly string _bookContentImportRootPath = "/sitecore/content/Home/BooksImportedDec2017";
        private readonly string _bookImageImportRootPath = "/sitecore/media library/Images/HMPPS/Pages/Books/Thumbnails/ImportedDec2017";
        private readonly string _bookImageRootPath = "/sitecore/media library/Images/HMPPS/Pages/Books/Thumbnails";
        private readonly string _bookFileImportRootPath = "/sitecore/media library/Files/HMPPS/Books/English";

        protected void Page_Load(object sender, EventArgs e)
        {
            CheckSecurity();

            sitecoreFolderInfo.Text = "Book content will be added under " + _bookContentImportRootPath + "<br />";
            sitecoreFolderInfo.Text += "Images are required to exist under " + _bookImageImportRootPath + "<br />";
            sitecoreFolderInfo.Text += "Book files are required to exist under " + _bookFileImportRootPath + "<br />";
            sitecoreFolderInfo.Text += "A generic book category image named 'entertainment' is required to exist under " + _bookImageRootPath + "<br />";

            var masterDb = Database.GetDatabase("master");
            var bookPageTemplate = masterDb.GetTemplate("HMPPS/Pages/Book Page");
            var bookSectionPageTemplate = masterDb.GetTemplate("HMPPS/Pages/Book Section Page");
            if (masterDb.Name.Equals("master", StringComparison.InvariantCultureIgnoreCase) && bookSectionPageTemplate != null && bookPageTemplate != null)
            {
                _scService = new BookUploadSitecoreService(masterDb, bookPageTemplate, bookSectionPageTemplate,
                    _bookContentImportRootPath, _bookImageImportRootPath, _bookImageRootPath, _bookFileImportRootPath);
                statusLit.Text = "Initialization status: ok";
            }
            else
            {
                statusLit.Text = "Initialization status: not ok";
            }
        }

        protected void importBtn_OnClick(object sender, EventArgs e)
        {
            var uploadPath = HttpContext.Current.Server.MapPath($"~/temp/BookUploadCsv{DateTime.Now.ToString("yyyy MMMM dd HH mm").Replace(" ", "_")}.txt");

            if (!csvFileUpload.HasFile) return;
            csvFileUpload.SaveAs(uploadPath);
            using (_csvService = new BookUploadCsvService(uploadPath))
            {
                if (!_csvService.IsLoaded) return;
                var rows = _csvService.GetAllRows();
                //Task.Run(() => { _scService.CreateSitecoreItems(rows); });
                resultLit.Text = _scService.CreateSitecoreItems(rows);
            }
        }
    }
}

