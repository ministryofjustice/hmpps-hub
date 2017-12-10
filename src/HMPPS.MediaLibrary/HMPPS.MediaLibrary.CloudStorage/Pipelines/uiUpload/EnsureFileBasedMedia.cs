using System.Collections.Generic;
using System.Linq;
using Sitecore.Data;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.Upload;
using HMPPS.MediaLibrary.CloudStorage.Configuration;
using HMPPS.MediaLibrary.CloudStorage.Helpers;

namespace HMPPS.MediaLibrary.CloudStorage.Pipelines.uiUpload
{
    /// <summary>
    /// Ensures media uploaded to specified folders is file based
    /// </summary>
    public class EnsureFileBasedMedia : UploadProcessor
    {
        public void Process(UploadArgs args)
        {
            Assert.ArgumentNotNull(args, "args");

            if (args.Destination != UploadDestination.Database)
            {
                return;
            }

            var containerName = GetContainerName(args.Folder);

            if (string.IsNullOrEmpty(containerName))
                return;
            
            args.Destination = UploadDestination.File;
            PipelineHelper.AddContainerNameToArgs(args, containerName);
        }

        public string GetContainerName(string folder)
        {
            var db = Sitecore.Context.ContentDatabase ?? Sitecore.Context.Database;
            folder = db.GetItem(folder).Paths.FullPath.ToLower();

            return BlobHelper.GetContainerNameForSitecorePath(folder);
        }
    }
}
