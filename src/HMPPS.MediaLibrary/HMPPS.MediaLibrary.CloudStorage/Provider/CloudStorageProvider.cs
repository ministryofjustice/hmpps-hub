using HMPPS.MediaLibrary.CloudStorage.Helpers;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using Sitecore.Configuration;
using Sitecore.Data.Items;

namespace HMPPS.MediaLibrary.CloudStorage.Provider
{
    public class CloudStorageProvider : ICloudStorageProvider
    {
        private readonly ICloudStorage _provider;

        public CloudStorageProvider()
        {
            _provider = Factory.CreateObject("cloudMediaStorage/storageProvider", true) as ICloudStorage;
        }

        public string Put(MediaItem media, string containerName)
        {
            return _provider.Put(media, containerName);
        }

        public string Update(MediaItem media)
        {
            return _provider.Update(media);
        }

        public bool Delete(MediaItem media)
        {

            var mediaHelper = new MediaHelper(media);
            mediaHelper.DeleteThumbnail();

            return _provider.Delete(media.FilePath);
        }

        public string GetUrlWithSasToken(MediaItem media, int expiryMinutes)
        {
            return _provider.GetUrlWithSasToken(media, expiryMinutes);
        }

        public void Move(MediaItem media, string fromPath)
        {
            _provider.Move(media, fromPath);
        }
    }
}
