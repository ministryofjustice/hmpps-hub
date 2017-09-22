using Sitecore.Data.Items;

namespace HMPPS.Utilities.SitecoreHelper
{
    /// <summary>
    /// Methods written for common fields in the e3 Sitecore base templates
    /// </summary>
    public static class BaseTemplateMethods
	{
	    /// <summary>
	    /// Returns the value of Navigation Title field if set, otherwise the value of Page Heading field of the item
	    /// </summary>
	    /// <param name="item"></param>
	    /// <param name="navTitleFieldName"></param>
	    /// <param name="pageHeadingFieldName"></param>
	    /// <returns></returns>
	    public static string GetNavTitleOrPageHeading(Item item, string navTitleFieldName, string pageHeadingFieldName)
		{
			if (item == null) return string.Empty;
			return FieldMethods.FieldHasValue(item, navTitleFieldName) ? item[navTitleFieldName] : item[pageHeadingFieldName];
		}
	}
}
