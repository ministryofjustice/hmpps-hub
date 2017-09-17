using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Sitecore;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.HttpRequest;
using HMPPS.Authentication.Helpers;
using HMPPS.Authentication.Services;
using Sitecore.Security.Authentication;

namespace HMPPS.Authentication.Pipelines
{
    /// <summary>
    /// Verifies authentication tickets:
    /// If sitecore logged in and IDAM tokan missing: log out from sitecore, it will trigger a redirect to login
    /// If sitecore logged out, and IDAM token is valid: login sitecore user
    /// If sitecore logged in and IDAM token expired: refresh token
    /// If both are available:
    ///     Check identities: if they are equal: OK
    ///     Else: logout both identities , it will trigger a redirect to login
    /// </summary>
    /// If both are unavailable: anonymous user - do nothing, it will trigger a redirect to login

    public class AuthenticationChecker : AuthenticationProcessorBase
    {
        public override void Process(HttpRequestArgs args)
        {
            // Not checking IDAM authentication of content editors
            if ((new String[] { "shell", "login", "admin" }).Contains(Sitecore.Context.Site.Name)) return;

            Assert.ArgumentNotNull(args, "args");
            var sitecoreUserLoggedIn = Context.IsLoggedIn;

            var idamData = GetIdamDataFromCookie(args.Context);

            if (sitecoreUserLoggedIn && idamData == null)
            {
                AuthenticationManager.Logout();
                return;
            }
            if (!sitecoreUserLoggedIn && idamData != null)
            {
                var user = BuildVirtualUser(idamData);
                AuthenticationManager.LoginVirtualUser(user);
            }
            if (sitecoreUserLoggedIn && idamData != null)
            {
                if (ExpirationHelper.IsExpired(idamData.ExpiresAt))
                {
                    var claims = RefreshIdamData(ref idamData);
                    SaveIdamDataToCookie(claims, args.Context);
                }
                else if (! Sitecore.Context.User.LocalName.Equals(idamData.NameIdentifier))
                {
                    AuthenticationManager.Logout();
                    DeleteIdamDataCookie(args.Context);
                }
            }
        }
    }
}
