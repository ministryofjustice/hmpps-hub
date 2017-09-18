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
    public class LogoutRedirector : AuthenticationProcessorBase
    {
        public override void Process(HttpRequestArgs args)
        {
            // Only act on requests against the logout URL
            if (!args.Context.Request.Url.AbsoluteUri.StartsWith(Settings.LogoutUrl)) return;

            // Temporary so we can test log in and out with different user. Probably can delete this whole thing later.
            // unless we need to add a log out button.
            Sitecore.Security.Authentication.AuthenticationManager.Logout();
            DeleteIdamDataCookie(args.Context);

            // Redirect the user to the SSO logout URL.
            WebUtil.Redirect(Settings.LogoutEndpoint);
        }
    }
}
