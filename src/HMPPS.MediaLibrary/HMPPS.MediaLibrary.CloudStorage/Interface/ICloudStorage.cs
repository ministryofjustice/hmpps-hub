using Sitecore.Data.Items;

namespace HMPPS.MediaLibrary.CloudStorage.Interface
{
    public interface ICloudStorage
    {
        string Put(MediaItem media, string containerName);
        string Update(MediaItem media);
        bool Delete(string filename);
        void Move(MediaItem item, string newPath);
        string GetUrlWithSasToken(MediaItem media, int expiryMinutes);
    }
}
