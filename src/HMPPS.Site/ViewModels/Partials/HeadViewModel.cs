using Sitecore.Data.Items;

namespace HMPPS.Site.ViewModels.Partials
{
    public class HeadViewModel
    {
        public HeadViewModel(Item siteSettingsItem, Item contextItem)
        {
            SiteSettingsItem = siteSettingsItem;
            GetBrowserTitle(contextItem);
        }
        public string PageBrowserTitle { get; set; }

        public Item SiteSettingsItem { get; set; }

        private void GetBrowserTitle(Item contextItem)
        {
            var titleFormat = SiteSettingsItem["Browser Title Format"];
            var pageTitle = Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(contextItem,
                "Browser Title", "Page Title");
            PageBrowserTitle = string.IsNullOrEmpty(titleFormat) ? pageTitle : titleFormat.Replace("{Browser Title}", pageTitle);
        }

    }
}
