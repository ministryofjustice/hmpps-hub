using System.Web;
using Sitecore.Diagnostics;
using Sitecore.Resources.Media;
using HMPPS.MediaLibrary.CloudStorage.Interface;
using Sitecore.Configuration;
using Sitecore.SecurityModel;
using Sitecore.Web;

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

            //Sitecore produces media search result icons with wrong querystring (2 question marks):
            // "?h=48&thn=1&w=48&db=master?w=80&h=60&db=master"
            // using the 1st part only "?h=48&thn=1&w=48&db=master" and redirect to the fixed url:
            FixSearchResultIconUrl(context.Request);

            MediaRequest request = MediaManager.ParseMediaRequest(context.Request);
            if (request == null)
                return false;

            Sitecore.Resources.Media.Media media = MediaManager.GetMedia(request.MediaUri);

            // handle 404 of media items
            if (media == null)
            {
                using (new SecurityDisabler())
                    media = MediaManager.GetMedia(request.MediaUri);

                string str;

                if (media == null)
                {
                    str = Settings.ItemNotFoundUrl;
                }
                else
                {
                    Assert.IsNotNull(Sitecore.Context.Site, "site");
                    str = Sitecore.Context.Site.LoginPage != string.Empty ? Sitecore.Context.Site.LoginPage : Settings.NoAccessUrl;
                }
                if (Settings.RequestErrors.UseServerSideRedirect)
                    HttpContext.Current.Server.TransferRequest(str);
                else
                    HttpContext.Current.Response.Redirect(str);
                return true;
            }

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

        private void FixSearchResultIconUrl(HttpRequest request)
        {
            var firstQueryStarts = request.RawUrl.IndexOf("?");
            var secondQueryStarts = request.RawUrl.LastIndexOf("?");
            if (firstQueryStarts < secondQueryStarts)
            {
                var fixedUrl = request.RawUrl.Substring(0, secondQueryStarts);
                WebUtil.Redirect(fixedUrl);
            }
        }
    }
}
