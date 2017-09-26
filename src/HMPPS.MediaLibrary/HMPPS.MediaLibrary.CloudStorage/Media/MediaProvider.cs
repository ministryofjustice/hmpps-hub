using HMPPS.MediaLibrary.CloudStorage.Configuration;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using Sitecore.Abstractions;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Resources.Media;
using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;


namespace HMPPS.MediaLibrary.CloudStorage.Media
{
   
    public class MediaProvider : Sitecore.Resources.Media.MediaProvider
    {

        public MediaProvider() : base(ServiceProviderServiceExtensions.GetRequiredService<BaseFactory>(ServiceLocator.ServiceProvider))
        { }

        public MediaProvider(BaseFactory factory) : base(factory)
        {
        }

        public override string GetMediaUrl(MediaItem item)
        {
            Assert.ArgumentNotNull(item, "item");
            return GetMediaUrl(item, MediaUrlOptions.Empty);
        }

        public override string GetMediaUrl(MediaItem item, MediaUrlOptions options)
        {
            Assert.ArgumentNotNull(item, "item");
            Assert.ArgumentNotNull(options, "options");

            if (!Settings.AlwaysIncludeCdnServerUrl || !item.FileBased || options.Thumbnail)
            {
                return base.GetMediaUrl(item, options);
            }

            var helper = new MediaHelper(item);
            return helper.GetCloudBasedMediaUrl();
        }

        public override bool HasMediaContent(Item item)
        {
            var mi = new MediaItem(item);
            if (mi.FileBased && item[Constants.FieldNameConstants.MediaItem.UploadedToCloud] == "1")
            {
                return true;
            }

            return base.HasMediaContent(item);
        }
    }
}
