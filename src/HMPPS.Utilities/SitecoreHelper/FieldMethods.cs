using System;
using System.Collections.Generic;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Resources.Media;

namespace HMPPS.Utilities.SitecoreHelper
{
    /// <summary>
    ///Helper class to get values for various Sitecore field types
    /// </summary>
    public static class FieldMethods
    {
        /// <summary>
        /// </summary>
        /// <param name="item"></param>
        /// <param name="fieldName"></param>
        /// <param name="includeServerUrl"></param>
        /// <param name="ensureMediaUrlPrefix"></param>
        /// <returns></returns>
        public static string GetMediaItemUrl(Item item, string fieldName, bool includeServerUrl,
            bool ensureMediaUrlPrefix = false)
        {
            ImageField imgField = item?.Fields[fieldName];
            if (imgField?.MediaItem == null) return string.Empty;
            var image = new MediaItem(imgField.MediaItem);
            var m = new MediaUrlOptions
            {
                AlwaysIncludeServerUrl = includeServerUrl
            };
            var mediaUrl = MediaManager.GetMediaUrl(image, m);
            return ensureMediaUrlPrefix ? Sitecore.StringUtil.EnsurePrefix('/', mediaUrl) : mediaUrl;
        }

        ///  <summary>
        ///  Gets the URL of a media item
        ///  Use this method for Sitecore up to version 7.5 (excluding 7.5)
        ///  </summary>
        ///  <param name="item">
        /// 		The Data source Item for the media field which
        /// 		stores the vale of the desired media item
        ///  </param>
        ///  <param name="imageField">
        /// 		The string value of the name of the media field
        /// 		on the data source item, which has a value of the media item
        /// 		to be reffrenced.
        ///  </param>
        /// <param name="maxWidth"></param>
        /// <param name="ensureMediaUrlPrefix"></param>
        /// <returns>(string) media item url relative to the root of the site</returns>
        public static string GetMediaItemUrl(Item item, string imageField, int? maxWidth = null,
            bool ensureMediaUrlPrefix = false)
        {
            try
            {
                ImageField tgtField = item.Fields[imageField];
                if (tgtField == null) return null;
                var opts = new MediaUrlOptions();
                if (maxWidth != null)
                {
                    opts.Width = maxWidth.Value;
                }

                if (tgtField.MediaItem != null)
                {
                    var mediaUrl = MediaManager.GetMediaUrl(tgtField.MediaItem, opts);
                    return ensureMediaUrlPrefix ? Sitecore.StringUtil.EnsurePrefix('/', mediaUrl) : mediaUrl;
                }
                return null;
            }
            catch
            {
                return null;
            }

        }

        /// <summary>
        /// Use this method for Sitecore version 7.5 and up (including 7.5)
        /// Media hashing not available for earlier versions of Sitecore
        /// </summary>
        /// <returns></returns>
        public static string GetMediaItemUrlWithHash(Item item, string imageField, int? maxWidth = null,
            bool ensureMediaUrlPrefix = false)
        {
            var mediaUrl = GetMediaItemUrl(item, imageField, maxWidth, ensureMediaUrlPrefix);
            try
            {
                if (!string.IsNullOrEmpty(mediaUrl))
                    return HashingUtils.ProtectAssetUrl(mediaUrl);
                return mediaUrl;
            }
            catch
            {
                return mediaUrl;
            }
        }

        /// <summary>
        /// Use this method for Sitecore up to version 7.5 (excluding 7.5)
        /// </summary>
        /// <param name="dataItem"></param>
        /// <returns></returns>
        public static string GetMediaItemUrl(MediaItem dataItem)
        {
            if (dataItem != null)
            {
                return MediaManager.GetMediaUrl(dataItem);
            }
            return string.Empty;
        }

        /// <summary>
        /// Use this method for Sitecore version 7.5 and up (including 7.5)
        /// </summary>
        /// <param name="dataItem"></param>
        /// <param name="width"></param>
        /// <returns></returns>
        public static string GetMediaItemUrl(MediaItem dataItem, int width)
        {
            if (dataItem == null) return string.Empty;
            var opts = new MediaUrlOptions {Width = width};
            return MediaManager.GetMediaUrl(dataItem, opts);
        }

        /// <summary>
        /// </summary>
        /// <param name="dataItem"></param>
        /// <param name="width"></param>
        /// <returns></returns>
        public static string GetMediaItemUrlWithHash(MediaItem dataItem, int width)
        {
            var mediaUrl = GetMediaItemUrl(dataItem, width);
            try
            {
                return !string.IsNullOrEmpty(mediaUrl) ? HashingUtils.ProtectAssetUrl(mediaUrl) : mediaUrl;
            }
            catch
            {
                return mediaUrl;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <param name="imageFieldName"></param>
        /// <returns></returns>
        public static int GetImageHeight(Item item, string imageFieldName)
        {
            if (item == null) return 0;
            var iHeight = 0;
            var img = ((ImageField) item.Fields[imageFieldName]);
            if (img != null)
            {
                int.TryParse(img.Height, out iHeight);
            }

            return iHeight;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <param name="imageFieldName"></param>
        /// <returns></returns>
        public static int GetImageWidth(Item item, string imageFieldName)
        {
            if (item == null) return 0;
            var iWidth = 0;
            var img = ((ImageField) item.Fields[imageFieldName]);
            if (img != null)
            {
                int.TryParse(img.Width, out iWidth);
            }

            return iWidth;
        }

        /// <summary>
        /// Returns the description (alt text) of the image
        /// </summary>
        /// <param name="item"></param>
        /// <param name="imageFieldName"></param>
        /// <returns></returns>
        public static string GetImageDescription(Item item, string imageFieldName)
        {
            if (item == null) return "";
            var desc = "";
            var img = ((ImageField) item.Fields[imageFieldName]);
            if (img != null)
            {
                desc = img.Alt;
            }

            return desc;
        }

        /// <summary>
        /// Returns a datetime value from the given date field of an item
        /// </summary>
        /// <param name="item"></param>
        /// <param name="dateFieldName"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static DateTime GetDateFieldValue(Item item, string dateFieldName, DateTime defaultValue)
        {
            if (item == null) return defaultValue;
            return Sitecore.DateUtil.ParseDateTime(item[dateFieldName], defaultValue);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static bool FieldHasValue(Item item, string fieldName)
        {
            if (item?.Fields[fieldName] != null && !string.IsNullOrEmpty(item.Fields[fieldName].Value))
            {
                // Ensure link fields which are "cleared" in the page editor are treated as without value
                if (item.Fields[fieldName].Type == "General Link" &&
                    string.IsNullOrEmpty(((LinkField) item.Fields[fieldName]).Url))
                    return false;
                if (item.Fields[fieldName].Type == "Droptree" &&
                    Sitecore.Data.ID.IsNullOrEmpty(((InternalLinkField) item.Fields[fieldName]).TargetID))
                    return false;

                return true;
            }
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <param name="linkFieldName"></param>
        /// <returns></returns>
        public static string GetLinkFieldDescription(Item item, string linkFieldName)
        {
            LinkField lf = item.Fields[linkFieldName];
            return lf != null ? lf.Text : string.Empty;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <param name="linkFieldName"></param>
        /// <returns></returns>
        public static string GetLinkFieldTarget(Item item, string linkFieldName)
        {
            LinkField lf = item.Fields[linkFieldName];
            return lf != null ? lf.Target : string.Empty;
        }

        /// <summary>
        /// Returns the URL from a Sitecore link field
        /// </summary>
        /// <param name="item"></param>
        /// <param name="linkFieldName"></param>
        /// <param name="includeServerUrl"></param>
        /// <param name="embedLanguage"></param>
        /// <returns></returns>
        public static string GetLinkFieldUrl(Item item, string linkFieldName, bool includeServerUrl,
            bool embedLanguage = false)
        {
            if (item == null || string.IsNullOrEmpty(linkFieldName))
                return string.Empty;
            LinkField lf = item.Fields[linkFieldName];
            if (lf == null)
                return string.Empty;

            string url;
            var urlOptions = Sitecore.Links.UrlOptions.DefaultOptions;
            urlOptions.AlwaysIncludeServerUrl = includeServerUrl;
            urlOptions.LanguageEmbedding = embedLanguage
                ? Sitecore.Links.LanguageEmbedding.Always
                : Sitecore.Links.LanguageEmbedding.Never;
            var mediaUrlOptions = new MediaUrlOptions {AlwaysIncludeServerUrl = includeServerUrl};
            switch (lf.LinkType.ToLower())
            {
                case "internal":
                    // Use LinkMananger for internal links, if link is not empty
                    url = lf.TargetItem != null
                        ? Sitecore.Links.LinkManager.GetItemUrl(lf.TargetItem, urlOptions)
                        : string.Empty;
                    break;
                case "media":
                    // Use MediaManager for media links, if link is not empty
                    url = lf.TargetItem != null
                        ? MediaManager.GetMediaUrl(lf.TargetItem, mediaUrlOptions)
                        : string.Empty;
                    break;
                case "external":
                    // Just return external links
                    url = lf.Url;
                    break;
                case "anchor":
                    // Prefix anchor link with # if link if not empty
                    url = !string.IsNullOrEmpty(lf.Anchor) ? "#" + lf.Anchor : string.Empty;
                    break;
                case "mailto":
                    // Just return mailto link
                    url = lf.Url;
                    break;
                case "javascript":
                    // Just return javascript
                    url = lf.Url;
                    break;
                default:
                    // Just please the compiler, this
                    // condition will never be met
                    url = lf.Url;
                    break;
            }
            return url;

        }

        /// <summary>
        /// Get a treelist field selected items from the current item
        /// </summary>
        /// <param name="item"></param>
        /// <param name="treelistFieldName"></param>
        /// <returns></returns>
        public static List<Item> GetTreelistSelectedItems(Item item, string treelistFieldName)
        {
            var treelistItems = new List<Item>();
            if (item == null)
                return treelistItems;
            var ids = Sitecore.Data.ID.ParseArray(item[treelistFieldName], false);
            foreach (var id in ids)
            {
                var targetItem = Sitecore.Context.Database.GetItem(id);
                if (targetItem != null)
                    treelistItems.Add(targetItem);
            }

            return treelistItems;
        }

        /// <summary>
        /// Get the selected item from a droplink, droptree, other reference types
        /// </summary>
        /// <param name="item"></param>
        /// <param name="refFieldName"></param>
        /// <returns></returns>
        public static Item GetRefFieldSelectedItem(Item item, string refFieldName)
        {
            if (item == null)
                return null;
            var field = (ReferenceField) item.Fields[refFieldName];
            return field?.TargetItem;
        }

        /// <summary>
        /// Get a multilist field selected items from the current item
        /// </summary>
        /// <param name="item"></param>
        /// <param name="multilistFieldName"></param>
        /// <returns></returns>
        public static List<Item> GetMultilistSelectedValues(Item item, string multilistFieldName)
        {
            if (item == null) return new List<Item>();
            MultilistField multilistField = item.Fields[multilistFieldName];
            var multilistItems = new List<Item>();
            if (multilistField != null)
            {
                foreach (var id in multilistField.TargetIDs)
                {
                    var targetItem = Sitecore.Context.Database.Items[id];
                    if (targetItem != null)
                        multilistItems.Add(targetItem);
                }
            }
            return multilistItems;
        }

        /// <summary>
        /// </summary>
        /// <param name="item"></param>
        /// <param name="fieldName"></param>
        /// <param name="includeServerUrl"></param>
        /// <param name="ensureMediaUrlPrefix"></param>
        /// <returns></returns>
        public static string GetFileUrl(Item item, string fieldName, bool includeServerUrl = false,
            bool ensureMediaUrlPrefix = false)
        {
            var fileField = (FileField) item.Fields[fieldName];
            if (fileField?.MediaItem == null) return string.Empty;
            var mediaItem = new MediaItem(fileField.MediaItem);
            var m = new MediaUrlOptions
            {
                AlwaysIncludeServerUrl = includeServerUrl
            };
            var mediaUrl = MediaManager.GetMediaUrl(mediaItem, m);
            return ensureMediaUrlPrefix ? Sitecore.StringUtil.EnsurePrefix('/', mediaUrl) : mediaUrl;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static string GetFilExtension(Item item, string fieldName)
        {
            var fileField = (FileField)item.Fields[fieldName];
            if (fileField?.MediaItem == null) return string.Empty;
            var mediaItem = new MediaItem(fileField.MediaItem);
            return mediaItem.Extension;
        }
    }
}
