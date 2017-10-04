using System.Collections.Generic;
using Sitecore;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Sites;
using HMPPS.MediaLibrary.CloudStorage.Constants;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor
{
    public class RepublishMedia
    {
        public void Process(MediaProcessorArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            Log.Debug("HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor.RepublishMedia - Republishing Media item", this);

            RepublishItems(args.UploadedItems);
        }

        private void RepublishItems(IEnumerable<Item> items)
        {
            foreach (var item in items)
            {
                if (IsAzureMediaItem(item) && IsPublished(item))
                {
                    RepublishItem(item);
                }
            }
        }

        private bool IsAzureMediaItem(Item item)
        {
            return MainUtil.GetBool(item[FieldNameConstants.MediaItem.UploadedToCloud], false);
        }

        private bool IsPublished(Item item)
        {
            // todo: check web database
            SiteContext targetSiteContext = SiteContext.GetSite("website");
            using (var switcher = new SiteContextSwitcher(targetSiteContext))
            {
                // do something on the new site context
                var publishedItem = Context.Database.GetItem(item.ID);
                return publishedItem != null;
            }
        }

        private void RepublishItem(Item item)
        {

            // Get all publishing targets
            var publishingTargets = Sitecore.Publishing.PublishManager.GetPublishingTargets(item.Database);

            // Loop through each target, determine the database, and publish
            foreach (var publishingTarget in publishingTargets)
            {
                // Find the target database name, move to the next publishing target if it is empty.
                var targetDatabaseName = publishingTarget["Target database"];
                if (string.IsNullOrEmpty(targetDatabaseName))
                    continue;

                // Get the target database, if missing skip
                var targetDatabase = Sitecore.Configuration.Factory.GetDatabase(targetDatabaseName);
                if (targetDatabase == null)
                    continue;
                // Setup publishing options based on your need
                Sitecore.Publishing.PublishOptions publishOptions =
                                    new Sitecore.Publishing.PublishOptions(item.Database,
                                         targetDatabase,
                                         Sitecore.Publishing.PublishMode.SingleItem,
                                         item.Language,
                                         System.DateTime.Now);
                Sitecore.Publishing.Publisher publisher = new Sitecore.Publishing.Publisher(publishOptions);
                publisher.Options.RootItem = item;
                publisher.Options.Deep = true;
                var publishResult = publisher.PublishWithResult();
            }
        }
    }
}
