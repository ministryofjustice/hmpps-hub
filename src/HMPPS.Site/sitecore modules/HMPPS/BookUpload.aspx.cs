using System;
using System.Threading.Tasks;
using HMPPS.Utilities.CsvUpload;
using Sitecore.Data;

namespace HMPPS.Site.sitecore_modules.HMPPS
{
    public partial class BookUpload : System.Web.UI.Page
    {

        private BookUploadCsvService _csvService;
        private BookUploadSitecoreService _scService;

        protected void Page_Load(object sender, EventArgs e)
        {
            var masterDb = Database.GetDatabase("master");
            var bookPageTemplate = masterDb.Templates["/sitecore/templates/HMPPS/Pages/Book Page"];
            var bookSectionPageTemplate = masterDb.Templates["/sitecore/templates/HMPPS/Pages/Book Section Page"];
            if (masterDb.Name.Equals("master", StringComparison.InvariantCultureIgnoreCase) && bookSectionPageTemplate != null && bookPageTemplate != null)
            {
                _scService = new BookUploadSitecoreService(masterDb, bookPageTemplate, bookSectionPageTemplate);
                statusLit.Text = "Initialization status: ok";
            }
            else
            {
                statusLit.Text = "Initialization status: not ok";
            }
        }

        protected void importBtn_OnClick(object sender, EventArgs e)
        {
            var uploadPath = $"c:\\temp\\BookUploadCsv{DateTime.Now.ToString("yyyy MMMM dd").Replace(" ", "_")}.txt";

            if (!csvFileUpload.HasFile) return;
            csvFileUpload.SaveAs(uploadPath);
            using (_csvService = new BookUploadCsvService(uploadPath))
            {
                if (!_csvService.IsLoaded) return;
                var rows = _csvService.GetAllRows();
                Task.Run(() => { _scService.CreateSitecoreItems(rows); });
                //_scService.CreateSitecoreItems(rows);
            }
        }
    }
}

