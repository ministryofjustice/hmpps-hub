using System.Diagnostics;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using HMPPS.ErrorReporting;
using HMPPS.Utilities.Helpers;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor
{
    /// <summary>
    /// Generate thumbnail of the uploaded media
    /// </summary>
    public class GenerateThumbnail
    {
        private ILogManager _logManager;

        public GenerateThumbnail()
        {
            _logManager = DependencyInjectionHelper.ResolveService<ILogManager>();
        }

        public void Process(MediaProcessorArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            _logManager.LogDebug("MediaStorageProvider - Generating Thumbnails for uploaded File Based uploads", GetType());

            var sw = new Stopwatch();
            sw.Start();

            foreach (Item file in args.UploadedItems.Where(file => file.Paths.IsMediaItem))
            {
                var helper = new MediaHelper(file);
                helper.GenerateThumbnail();
            }
            
            sw.Stop();
            _logManager.LogDebug("MediaStorageProvider - Finished generating thumbnails: " + sw.Elapsed, GetType());
        }
    }
}
