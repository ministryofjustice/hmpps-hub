using System.Web;
using Sitecore.Diagnostics;
using Sitecore.Resources.Media;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using Sitecore.Configuration;

namespace HMPPS.MediaLibrary.CloudStorage.Media
{
    public class MediaRequestHandler : Sitecore.Resources.Media.MediaRequestHandler
    {
        private readonly ICloudStorage _provider;

        public MediaRequestHandler()
        {
            _provider = Factory.CreateObject("cloudMediaStorage/storageProvider", true) as ICloudStorage;
        }

        protected override bool DoProcessRequest(HttpContext context)
        {
            Assert.ArgumentNotNull((object) context, "context");
            MediaRequest request = MediaManager.ParseMediaRequest(context.Request);
            if (request == null)
                return false;
            Sitecore.Resources.Media.Media media = MediaManager.GetMedia(request.MediaUri);

            if (!IsCdnMedia(media))
                return base.DoProcessRequest(context);

            if (request.Options.Thumbnail)
            {
                request.Options.UseMediaCache = false;
                return base.DoProcessRequest(context, request, media);
            }

            return this.DoProcessRequest(context, media);
        }

        private bool DoProcessRequest(HttpContext context, Sitecore.Resources.Media.Media media)
        {
            //var helper = new MediaHelper(media.MediaData.MediaItem);
            //string redirectUrl = helper.GetCloudBasedMediaUrl();
            //all blob urls set to expire in 24h (1440 minutes)
            var redirectUrl = _provider.GetUrlWithSasToken(media.MediaData.MediaItem, 1440);
            context.Response.Redirect(redirectUrl, false);
            context.ApplicationInstance.CompleteRequest();
            return true;
        }

        private bool IsCdnMedia(Sitecore.Resources.Media.Media media)
        {
            return (media != null && media.MediaData.MediaItem.FileBased);
        }
    }
}
