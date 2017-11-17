using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.SecurityModel;
using HMPPS.Models.Common;


namespace HMPPS.Site.ViewModels.Partials
{
    public class HeaderViewModel
    {
        public Link LogoLink { get; set; }


        public HeaderViewModel(Item siteSettingsItem)
        {
            LogoLink = GetLogoLink(siteSettingsItem);
        }

        private Link GetLogoLink(Item siteSettingsItem)
        {
            using (new SecurityDisabler())
            {
                var linkField = (LinkField)siteSettingsItem.Fields["Logo Link"];
                if (linkField != null)
                    return new Link()
                    {
                        Text = linkField.Text,
                        Title = linkField.Title,
                        Url = linkField.IsInternal ? Sitecore.Links.LinkManager.GetItemUrl(linkField.TargetItem) : linkField.Url
                    };
            }
            return null;
        }

    }
}
