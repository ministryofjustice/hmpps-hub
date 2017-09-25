using System;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Helpers;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using HMPPS.MediaLibrary.CloudStorage.Provider;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.Attach;
using Sitecore.StringExtensions;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.AttachFile
{
    /// <summary>
    /// Deletes media from Cloud storage that was previously associated with item
    /// </summary>
    public class DeletePreviousMedia
    {
        ICloudStorageProvider cloudStorage;

        public DeletePreviousMedia()
        {
            cloudStorage = new CloudStorageProvider();
        }

        /// <summary>
        /// Deletes media from Cloud storage that was previously associated with item
        /// </summary>
        /// <param name="args"></param>
        public void Process(AttachArgs args)
        {
            Assert.ArgumentNotNull(args, "args");

            if (!args.MediaItem.FileBased)
                return;

            Log.Audit("MediaStorageProvider - Deleting '{0}' from Cloud storage".FormatWith(args.MediaItem.FilePath), this);

            PipelineHelper.AddContainerNameToArgs(args,  GetContainerNameFromFilePath(args.MediaItem.FilePath));
            cloudStorage.Delete(args.MediaItem);
        }

        private string GetContainerNameFromFilePath(string filePath)
        {
            return filePath.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
        }
    }
}
