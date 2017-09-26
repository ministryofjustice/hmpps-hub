using System.Diagnostics;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Constants;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using HMPPS.MediaLibrary.CloudStorage.Provider;
using Sitecore;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.IO;
using Sitecore.SecurityModel;
using HMPPS.MediaLibrary.CloudStorage.Helpers;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor
{
    /// <summary>
    /// Uploads media item to azure cloud storage
    /// </summary>
    public class UploadToCdn
    {
        ICloudStorageProvider cloudStorage;

        public UploadToCdn()
        {
            cloudStorage = new CloudStorageProvider();
        }

        public void Process(MediaProcessorArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            Log.Debug("MediaStorageProvider - Processing file upload to CDN", this);
            var sw = new Stopwatch();
            sw.Start();

            foreach (Item file in args.UploadedItems.Where(file => file.Paths.IsMediaItem))
            {
                /* NOTE: We don't deal with versioned files, should prepend file.Language and file.Version... */

                var containerName = PipelineHelper.GetContainerNameFromArgs(args);

                // delete if previously uploaded
                if (MainUtil.GetBool(file[FieldNameConstants.MediaItem.UploadedToCloud], false))
                    cloudStorage.Delete(file);

                // upload to CDN
                string filename = cloudStorage.Put(file, containerName);

                // delete the existing file from disk
                FileUtil.Delete(StringUtil.EnsurePrefix('/', file[FieldNameConstants.MediaItem.FilePath]));

                // update the item file location to CDN
                using (new EditContext(file, SecurityCheck.Disable))
                {
                    file[FieldNameConstants.MediaItem.FilePath] = filename;
                    file[FieldNameConstants.MediaItem.UploadedToCloud] = "1";
                }
            }

            sw.Stop();
            Log.Debug("MediaStorageProvider - File Upload process to CDN complete: " + sw.Elapsed, this);
        }
    }
}
