using Sitecore.Data.Items;

namespace HMPPS.MediaLibrary.CloudStorage.Interface
{
    public interface ICloudStorageProvider
    {
        string Put(MediaItem media, string containerName);
        string Update(MediaItem media);
        bool Delete(MediaItem media);
        void Move(MediaItem media, string newPath);
        string GetUrlWithSasToken(MediaItem media, int expiryMinutes);
    }
}
