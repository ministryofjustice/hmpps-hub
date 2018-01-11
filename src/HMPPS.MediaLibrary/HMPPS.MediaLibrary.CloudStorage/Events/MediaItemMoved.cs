using HMPPS.MediaLibrary.CloudStorage.Interface;
using HMPPS.MediaLibrary.CloudStorage.Provider;
using Sitecore.Data.Items;
using Sitecore.Events;
using System;

namespace HMPPS.MediaLibrary.CloudStorage.Events
{
    public class MediaItemMoved
    {
        readonly ICloudStorageProvider _cloudStorageProvider;

        public MediaItemMoved()
        {
            _cloudStorageProvider = new CloudStorageProvider();
        }

        public void OnItemMoved(object sender, EventArgs e)
        {
            var item = Event.ExtractParameter(e, 0) as Item;
            var fromLocation = Event.ExtractParameter(e, 1);

            if (!item.Paths.IsMediaItem)
            {
                return;
            }

            var mediaItem = new MediaItem(item);

            if (!mediaItem.FileBased)
            {
                return;
            }

            var fromLocationItem = item.Database.GetItem(new Sitecore.Data.ID(fromLocation.ToString()));

            _cloudStorageProvider.Move(item, fromLocationItem.Paths.FullPath);
        }
    }
}
