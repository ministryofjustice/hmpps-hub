using System;

namespace HMPPS.Site
{
    public partial class Status : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Sitecore.Context.Site == null || Sitecore.Context.Database == null || Sitecore.Context.Database.GetItem(Sitecore.Context.Site.RootPath) == null)
                throw new Exception("HMPPS.Site.Status - status check failed");
        }
    }
}
