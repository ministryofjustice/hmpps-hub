using Sitecore.Configuration;
using Sitecore.Xml;
using System.Xml;

namespace HMPPS.MediaLibrary.CloudStorage.Helpers
{
    public class BlobHelper
    {
        /// <summary>
        /// Reconciles a Sitecore path with the container under which the media item should be stored
        /// </summary>
        /// <param name="sitecorePath">Path of the item in Sitecore</param>
        public static string GetContainerNameForSitecorePath(string sitecorePath)
        {
            foreach (XmlNode node in Factory.GetConfigNodes("containerMediaPathRelationships/relationship"))
            {
                if (!sitecorePath.ToLower().StartsWith(XmlUtil.GetAttribute("sitecorePath", node).ToLower()))
                {
                    continue;
                }

                return XmlUtil.GetAttribute("containerName", node);
            }

            return null;
        }
    }
}
