using System;
using System.Linq;
using Sitecore;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Sites;
using Sitecore.Web;
using IdentityModel.Client;
using HMPPS.Utilities.Helpers;

namespace HMPPS.Authentication.Pipelines
{
    public class LoginRedirector : HttpRequestProcessor
    {
        public override void Process(HttpRequestArgs args)
        {
            if (Context.Database == null || Context.Site == null) return;
            // Not checking IDAM authentication of content editors
            if ((new[] { "shell", "login", "admin" }).Contains(Context.Site.Name)) return;
            // force login only for normal website usage, not for preview / debugging / experienceediting / profiling
            if (!Context.PageMode.IsNormal) return;
            if (Context.User.IsAuthenticated) return;
            if (!SiteManager.CanEnter(Context.Site.Name, Context.User)) return;
            if (Context.Item != null && Context.Item.Access.CanRead()) return;
            if (Context.Item == null && args.PermissionDenied)
            {
                // generate nonces and set temporary cookie
                var state = Guid.NewGuid().ToString("N");
                var nonce = Guid.NewGuid().ToString("N");

                var cookie = new CookieHelper(Settings.TempCookieName, args.Context);
                cookie.SetValue("state", state);
                cookie.SetValue("nonce", nonce);
                cookie.SetValue("returnUrl", args.Context.Request.Url.ToString());
                cookie.Save();

                var request = new AuthorizeRequest(Settings.AuthorizeEndpoint);

                var url = request.CreateAuthorizeUrl(
                    clientId: Settings.ClientId,
                    responseType: "code",
                    scope: Settings.Scope,
                    redirectUri: Settings.SignInCallbackUrl,
                    state: state,
                    nonce: nonce);

                // Redirect the user to the login page of the identity provider
                WebUtil.Redirect(url);
            }
        }
    }
}
