using System.Text.RegularExpressions;
using Sitecore.Pipelines.RenderField;

namespace HMPPS.Utilities.Pipelines
{
    public class ImageFieldSizeAttributesRemover
    {
        public void Process(RenderFieldArgs args)
        {
            if (args.FieldTypeKey != "image")
                return;
            if (!args.Result.FirstPart.Contains("remove-size-attributes"))
                return;
            var imageTag = args.Result.FirstPart;
            imageTag = Regex.Replace(imageTag, @"(<img[^>]*?)\s+height\s*=\s*\S+", "$1", RegexOptions.IgnoreCase);
            imageTag = Regex.Replace(imageTag, @"(<img[^>]*?)\s+width\s*=\s*\S+", "$1", RegexOptions.IgnoreCase);
            imageTag = Regex.Replace(imageTag, @"(<img[^>]*?)\s+responsive\s*=\s*\S+", "$1",
                RegexOptions.IgnoreCase);
            args.Result.FirstPart = imageTag;
        }
    }
}
