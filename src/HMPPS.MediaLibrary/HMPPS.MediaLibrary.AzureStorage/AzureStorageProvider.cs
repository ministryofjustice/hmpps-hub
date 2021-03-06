using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using HMPPS.MediaLibrary.CloudStorage.Provider;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Sitecore;
using Sitecore.Data.Items;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using HMPPS.ErrorReporting;
using HMPPS.Utilities.Helpers;
using Sitecore.SecurityModel;
using HMPPS.MediaLibrary.CloudStorage.Constants;
using HMPPS.MediaLibrary.CloudStorage.Helpers;

namespace HMPPS.MediaLibrary.AzureStorage
{
    /// <summary>
    /// Uploads media items into Azure Blob storage container
    /// </summary>
    public class AzureStorageProvider : CloudStorageBase
    {
        private CloudBlobContainer _blobDefaultContainer;
        private Dictionary<string, CloudBlobContainer> _blobContainers;
        private readonly ILogManager _logManager;
        private readonly string _storageAccountName;
        private readonly string _storageAccountKey;
        private readonly string _storageDefaultContainer;
        private readonly IList<string> _storageContainers;

        #region ctor
        public AzureStorageProvider(string defaultContainer, string containers)
        {
            _storageAccountName = Settings.AccountName;
            _storageAccountKey = Settings.AccountKey;
            _storageDefaultContainer = defaultContainer;
            _storageContainers = containers.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();
            _logManager = DependencyInjectionHelper.ResolveService<ILogManager>();

            Initialize();
        }

        private void Initialize()
        {
            CloudStorageAccount storageAccount = new CloudStorageAccount(new StorageCredentials(_storageAccountName, _storageAccountKey), true);

            BlobRequestOptions interactiveRequestOption = new BlobRequestOptions()
            {
                RetryPolicy = new LinearRetry(TimeSpan.FromMilliseconds(1000), 3),
                // For Read-access geo-redundant storage, use PrimaryThenSecondary.
                // Otherwise set this to PrimaryOnly.
                // Write operations will only work on primary so we will use PrimaryOnly.
                LocationMode = LocationMode.PrimaryOnly
            };

            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            blobClient.DefaultRequestOptions = interactiveRequestOption;

            _blobDefaultContainer = blobClient.GetContainerReference(_storageDefaultContainer);

            _blobContainers = new Dictionary<string, CloudBlobContainer>();
            foreach (var storageContainer in _storageContainers)
            {
                var container = blobClient.GetContainerReference(storageContainer.ToLower());

                container.CreateIfNotExists();

                _blobContainers.Add(storageContainer, container);
            }
        }
        #endregion


        #region Implementation

        /// <summary>
        /// Uploads the media file into Azure Storage container
        /// </summary>
        /// <param name="media">Media Item to upload</param>
        /// <param name="containerName"></param>
        /// <returns>Location of file in container</returns>
        public override string Put(MediaItem media, string containerName)
        {
            string filename = base.ParseMediaFileName(media);

            var blobContainer = GetCloudBlobContainer(containerName);
            CloudBlockBlob blob = blobContainer.GetBlockBlobReference(filename);
            blob.Properties.ContentType = !string.IsNullOrEmpty(media.MimeType) ? media.MimeType : "application/octet-stream";

            using (Stream fileStream = media.GetMediaStream())
            {
                blob.UploadFromStream(fileStream);
            }

            // extend file path with container name
            filename = AddContainerNameToFilePath(filename, containerName);
            _logManager.LogAudit("File successfully uploaded to Azure Blob Storage: " + filename, GetType());

            return filename;
        }

        /// <summary>
        /// Overrides the existing media item with this new one
        /// </summary>
        /// <param name="media">Media Item to upload</param>
        /// <returns>Location of file in container</returns>
        public override string Update(MediaItem media)
        {
            var containerName = GetContainerNameFromFilePath(media.FilePath);
            return Put(media, containerName);
        }

        /// <summary>
        /// Delete the associated media file from Azure storage
        /// </summary>
        /// <param name="filename">Location fo file to delete in storage</param>
        /// <returns>Bool indicating success</returns>
        public override bool Delete(string filename)
        {
            var containerName = GetContainerNameFromFilePath(filename);

            var fileToDelete = RemoveContainerNameFromfilePath(filename, containerName);

            var blobContainer = GetCloudBlobContainer(containerName);
            CloudBlockBlob blob = blobContainer.GetBlockBlobReference(fileToDelete);

            return blob.DeleteIfExists();
        }

        /// <summary>
        /// Performs a psuedo-move of the azure blob by copying the content of said blob to the desired location and removing the original blob.
        /// </summary>
        /// <param name="item">The media item which has been moved</param>
        /// <param name="fromPath">The path which the item has been moved from</param>
        public override void Move(Item item, string fromPath)
        {
            var moveToContainerName = BlobHelper.GetContainerNameForSitecorePath(item.Paths.FullPath);
            var moveToContainer = GetCloudBlobContainer(moveToContainerName);

            var moveFromContainerName = BlobHelper.GetContainerNameForSitecorePath(fromPath);
            var moveFromContainer = GetCloudBlobContainer(moveFromContainerName);

            var mediaItem = new MediaItem(item);

            var moveToFileName = ParseMediaFileName(mediaItem);
            var moveFromFileName = mediaItem.FilePath;

            var existingBlob = moveFromContainer.GetBlockBlobReference(RemoveContainerNameFromfilePath(moveFromFileName, moveFromContainerName));
            var newBlob = moveToContainer.GetBlockBlobReference(moveToFileName);

            if (existingBlob.Name.Equals(newBlob.Name))
            {
                _logManager.LogDebug($"Source blob is the same as target blob. Blob copy not carried out.", GetType());

                return;
            }

            if (!existingBlob.Exists())
            {
                _logManager.LogWarning($"Unable to copy blob as the source blob at {moveFromFileName} could not be found.", GetType());

                return;
            }

            newBlob.StartCopy(existingBlob);

            var containerQualifiedFileName = AddContainerNameToFilePath(moveToFileName, moveToContainerName);

            try
            {
                using (new EditContext(item, SecurityCheck.Disable))
                {
                    item[FieldNameConstants.MediaItem.FilePath] = containerQualifiedFileName;
                    item[FieldNameConstants.MediaItem.UploadedToCloud] = "1";
                }
            }
            catch (Exception ex)
            {
                _logManager.LogError($"Unable to update Sitecore media item '{item.Name}' with the filepath " +
                    $"{containerQualifiedFileName} during blob move. New blob will be removed and old blob will be persisted.", ex, GetType());

                Delete(moveToFileName);

                throw;
            }

            Delete(moveFromFileName);
        }

        public override string GetUrlWithSasToken(MediaItem media, int expiryMinutes)
        {
            var filename = media.FilePath;

            var containerName = GetContainerNameFromFilePath(filename);

            var fileToAccess = RemoveContainerNameFromfilePath(filename, containerName);

            var blobContainer = GetCloudBlobContainer(containerName);

            return GetBlobSasUri(blobContainer, fileToAccess, expiryMinutes);

        }

        public bool CanConnect()
        {
            try
            {
                _blobDefaultContainer.ListBlobs(null, true, BlobListingDetails.All)
                                     .ToList();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        #endregion

        private static string GetBlobSasUri(CloudBlobContainer container, string blobName, int expiryMinutes)
        {
            // Get a reference to a blob within the container.
            // Note that the blob may not exist yet, but a SAS can still be created for it.
            var blob = container.GetBlockBlobReference(blobName);

            // Create a new access policy and define its constraints.
            // Note that the SharedAccessBlobPolicy class is used both to define the parameters of an ad-hoc SAS, and
            // to construct a shared access policy that is saved to the container's shared access policies.
            var adHocSas = new SharedAccessBlobPolicy()
            {
                // When the start time for the SAS is omitted, the start time is assumed to be the time when the storage service receives the request.
                // Omitting the start time for a SAS that is effective immediately helps to avoid clock skew.
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(expiryMinutes),
                Permissions = SharedAccessBlobPermissions.Read
            };

            // Generate the shared access signature on the blob, setting the constraints directly on the signature.
            var sasBlobToken = blob.GetSharedAccessSignature(adHocSas);

            // Return the URI string for the container, including the SAS token.
            return blob.Uri + sasBlobToken;
        }

        private CloudBlobContainer GetCloudBlobContainer(string containerName)
        {
            if (string.IsNullOrEmpty(containerName))
            {
                return _blobDefaultContainer;
            }
            if (_blobContainers.Keys.Contains(containerName) && _blobContainers[containerName] != null)
            {
                return _blobContainers[containerName];
            }
            return _blobDefaultContainer;
        }

        private string AddContainerNameToFilePath(string filePath, string containerName)
        {
            return $"{containerName}/{StringUtil.RemovePrefix("/", filePath)}";
        }

        private string GetContainerNameFromFilePath(string filePath)
        {
            return filePath.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
        }

        private string RemoveContainerNameFromfilePath(string filePath, string containerName)
        {
            if (filePath.StartsWith(containerName + "/"))
            {
                return filePath.Substring(containerName.Length + 1);
            }
            return filePath;
        }
    }
}
