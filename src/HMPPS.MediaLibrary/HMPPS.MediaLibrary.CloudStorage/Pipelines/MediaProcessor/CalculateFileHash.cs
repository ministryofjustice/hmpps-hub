using System.Diagnostics;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Constants;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.SecurityModel;
using HMPPS.ErrorReporting;
using HMPPS.Utilities.Helpers;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor
{
    /// <summary>
    /// Calculates MD5 hash of uploaded file and stores in media template
    /// </summary>
    public class CalculateFileHash
    {
        private ILogManager _logManager;

        public CalculateFileHash(ILogManager logManager)
        {
            _logManager = logManager;
        }

        public void Process(MediaProcessorArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            _logManager.LogDebug("MediaStorageProvider - Processing file MD5 calculation", GetType());

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
            _logManager.LogDebug("MediaStorageProvider - Finished calculating MD5 hash for files: " + sw.Elapsed, GetType());
        }
    }
}
