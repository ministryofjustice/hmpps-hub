using System.Collections.Generic;
using HMPPS.MediaLibrary.CloudStorage.Pipelines.MediaProcessor;
using Sitecore.Data.Items;
using Sitecore.Pipelines;

namespace HMPPS.MediaLibrary.CloudStorage.Helpers
{
    public class PipelineHelper
    {
        /// <summary>
        /// Creates and starts a Sitecore Job to run as a long running background task
        /// </summary>
        public void StartMediaProcessorJob(IEnumerable<Item> uploadedItems, string containerName)
        {
            var args = new MediaProcessorArgs { UploadedItems = uploadedItems };

            AddContainerNameToArgs(args, containerName);

            var jobOptions = new Sitecore.Jobs.JobOptions("CloudMediaProcessor", "MediaProcessing",
                                                          Sitecore.Context.Site.Name,
                                                          this, "RunMediaProcessor", new object[] { args });
            Sitecore.Jobs.JobManager.Start(jobOptions);
        }

        /// <summary>
        /// Calls Custom Pipeline with the supplied args
        /// </summary>
        /// <param name="args">The UploadArgs</param>
        public void RunMediaProcessor(MediaProcessorArgs args)
        {
            CorePipeline.Run("cloud.MediaProcessor", args);
        }

        public static void AddContainerNameToArgs(PipelineArgs args, string containerName)
        {
            args.CustomData.Add("containerName", containerName);
        }

        public static string GetContainerNameFromArgs(PipelineArgs args)
        {
            // get container name
            var containerName = string.Empty;
            if (args.CustomData.TryGetValue("containerName", out var containerNameObj))
            {
                containerName = containerNameObj.ToString();
            }

            return containerName;
        }
    }
}
