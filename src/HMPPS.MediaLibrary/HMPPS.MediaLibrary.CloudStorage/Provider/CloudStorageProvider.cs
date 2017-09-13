using HMPPS.MediaLibrary.CloudStorage.Helpers;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using Sitecore.Configuration;
using Sitecore.Data.Items;

namespace HMPPS.MediaLibrary.CloudStorage.Provider
{
    public class CloudStorageProvider : ICloudStorageProvider
    {
        private ICloudStorage Provider;

        public CloudStorageProvider()
        {
            Provider = Factory.CreateObject("cloudMediaStorage/storageProvider", true) as ICloudStorage;
        }

        public string Put(MediaItem media, string containerName)
        {
            return Provider.Put(media, containerName);
        }

        public string Update(MediaItem media)
        {
            return Provider.Update(media);
        }

        public bool Delete(MediaItem media)
        {

            var mediaHelper = new MediaHelper(media);
            mediaHelper.DeleteThumbnail();

            return Provider.Delete(media.FilePath);
        }

        public string GetUrlWithSasToken(MediaItem media, int expiryMinutes)
        {
            return Provider.GetUrlWithSasToken(media, expiryMinutes);
        }
    }
}
