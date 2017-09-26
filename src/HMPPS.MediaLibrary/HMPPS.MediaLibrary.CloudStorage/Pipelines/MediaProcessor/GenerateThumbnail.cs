using System.Diagnostics;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor
{
    /// <summary>
    /// Generate thumbnail of the uploaded media
    /// </summary>
    public class GenerateThumbnail
    {
        public void Process(MediaProcessorArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            Log.Debug("MediaStorageProvider - Generating Thumbnails for uploaded File Based uploads", this);

            var sw = new Stopwatch();
            sw.Start();

            foreach (Item file in args.UploadedItems.Where(file => file.Paths.IsMediaItem))
            {
                var helper = new MediaHelper(file);
                helper.GenerateThumbnail();
            }

            sw.Stop();
            Log.Debug("MediaStorageProvider - Finished generating thumbnails: " + sw.Elapsed, this);
        }
    }
}
