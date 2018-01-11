using HMPPS.MediaLibrary.CloudStorage.Constants;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using Sitecore.Data.Events;
using Sitecore.Data.Items;
using Sitecore.Events;
using Sitecore.SecurityModel;
using System;

namespace HMPPS.MediaLibrary.CloudStorage.Events
{
    public class MediaItemCreated
    {
        public void OnItemCreated(object sender, EventArgs e)
        {
            var itemCreatedEvent = Event.ExtractParameter(e, 0) as ItemCreatedEventArgs;

            var item = itemCreatedEvent.Item;

            if (!item.Paths.IsMediaItem)
            {
                return;
            }

            var mediaItem = new MediaItem(item);

            var containerName = BlobHelper.GetContainerNameForSitecorePath(mediaItem.Path);

            if (string.IsNullOrEmpty(containerName))
            {
                return;
            }

            using (new SecurityDisabler())
            {
                item.Editing.BeginEdit();
                item.Appearance.ReadOnly = true;
                item.Editing.EndEdit();
            }           
        }
    }
}
