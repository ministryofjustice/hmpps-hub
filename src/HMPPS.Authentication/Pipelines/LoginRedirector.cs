using System;
using System.Text;
using System.Web;
using Sitecore;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Sites;
using Sitecore.Web;
using IdentityModel.Client;

namespace HMPPS.Authentication.Pipelines
{
    public class LoginRedirector : HttpRequestProcessor
    {
        public override void Process(HttpRequestArgs args)
        {
            if (Context.Database == null || Context.Site == null) return;
            if (Context.User.IsAuthenticated) return;
            if (!SiteManager.CanEnter(Context.Site.Name, Context.User)) return;
            if (Context.Item != null && Context.Item.Access.CanRead()) return;
            if (Context.Item == null && args.PermissionDenied)
            {
                // generate nonces and set temporary cookie
                //TODO: consider setting this with claims in a fake owin auth session as per MVC Manual Code Flow Client (IdentityServer3.Samples)
                var state = Guid.NewGuid().ToString("N");
                var nonce = Guid.NewGuid().ToString("N");

                var cookie = new HttpCookie(Settings.TempCookieName);
                cookie.Values.Add("state", state);
                cookie.Values.Add("nonce", nonce);
                cookie.Values.Add("returnUrl", args.Context.Request.Url.ToString());
                args.Context.Response.Cookies.Add(cookie);

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
