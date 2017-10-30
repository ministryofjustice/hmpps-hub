using System.Diagnostics;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Constants;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.SecurityModel;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor
{
    /// <summary>
    /// Calculates MD5 hash of uploaded file and stores in media template
    /// </summary>
    public class CalculateFileHash
    {
        public void Process(MediaProcessorArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            Log.Debug("MediaStorageProvider - Processing file MD5 calculation", this);

            var sw = new Stopwatch();
            sw.Start();

            foreach (Item file in args.UploadedItems.Where(file => file.Paths.IsMediaItem))
            {
                using (new EditContext(file, SecurityCheck.Disable))
                {
                    var helper = new MediaHelper(file);
                    file[FieldNameConstants.MediaItem.Md5Hash] = helper.CalculateMd5();
                }
            }

            sw.Stop();
            Log.Debug("MediaStorageProvider - Finished calculating MD5 hash for files: " + sw.Elapsed, this);
        }
    }
}
