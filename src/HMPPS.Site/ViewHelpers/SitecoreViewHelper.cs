using Sitecore.Data.Items;

namespace HMPPS.Site.ViewHelpers
{
    public static class SitecoreViewHelper
    {
        public static string GetMediaItemUrl(this Item item, string fieldName)
        {
            return Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrl(item, fieldName);
        }

        public static string GetPageItemUrl(this Item item)
        {
            return Sitecore.Links.LinkManager.GetItemUrl(item); 
        }

        public static string GetNavTitleOrPageTitle(this Item item, string navTitleFieldName = "Navigation Title",
            string pageTitleFieldName = "Page Title")
        {
            return Utilities.SitecoreHelper.BaseTemplateMethods.GetNavTitleOrPageHeading(item, navTitleFieldName,
                pageTitleFieldName);
        }
    }
}
