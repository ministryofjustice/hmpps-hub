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
        public LocationConfiguration Config { get; private set; }

        public EnsureFileBasedMedia()
        {
            Config = new LocationConfiguration();
        }

        public void Process(UploadArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            if (args.Destination != UploadDestination.Database) return;       
            var mediaLocation = EnsureUploadIntoCloud(args.Folder);
            if (mediaLocation != null)
            {
                args.Destination = UploadDestination.File;
                PipelineHelper.AddContainerNameToArgs(args, mediaLocation.ContainerName);
            }
        }

        /// <summary>
        /// Checks if media folder is configured to force upload to cloud storage
        /// </summary>
        /// <param name="folder">Location current item is being uploaded to</param>
        /// <returns>boolean</returns>
        private Location EnsureUploadIntoCloud(string folder)
        {
            Database db = Sitecore.Context.ContentDatabase ?? Sitecore.Context.Database;
            folder = db.GetItem(folder).Paths.FullPath.ToLower();

            return Config.Locations.FirstOrDefault(location => folder.StartsWith(location.MediaFolder.ToLower()));
        }
    }
}
