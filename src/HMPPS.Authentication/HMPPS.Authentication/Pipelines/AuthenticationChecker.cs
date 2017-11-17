using System.Linq;
using Sitecore;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security.Authentication;
using HMPPS.Utilities.Helpers;
using HMPPS.Utilities.Interfaces;
using HMPPS.NomisApiService.Interfaces;
using System.Web;

namespace HMPPS.Authentication.Pipelines
{
    /// <summary>
    /// Verifies authentication tickets:
    /// If sitecore logged in and IDAM token missing: log out from sitecore, it will trigger a redirect to login
    /// If sitecore logged out, and IDAM token is valid: login sitecore user
    /// If sitecore logged in and IDAM token expired: refresh token
    /// If sitecore logged in and IDAM token refresh fails: log out
    /// If both the sitecore logged in user and IDAM token are available:
    ///     Check identities: if they are equal: OK
    ///     Else: logout both identities , it will trigger a redirect to login
    /// </summary>
    /// If both are unavailable: anonymous user - do nothing, it will trigger a redirect to login

    public class AuthenticationChecker : AuthenticationProcessorBase
    {

        private readonly IUserDataService _userDataService;

        public AuthenticationChecker(IUserDataService userDataService, INomisApiService nomisApiService)
        {
            _userDataService = userDataService;
            NomisApiService = nomisApiService;
        }

        public override void Process(HttpRequestArgs args)
        {
            // Not checking IDAM authentication of content editors
            if ((new[] { "shell", "login", "admin" }).Contains(Context.Site.Name)) return;
            // force login only for normal website usage, not for preview / debugging / experienceediting / profiling
            if (!Context.PageMode.IsNormal) return;
            // Not checking IDAM auth for /-/speak/v1/assets/main.js
            // Unfortunately it is requested with Context.Site.Name == "website" and Context.PageMode.IsNormal == true
            if (Context.IsLoggedIn && Context.User.Domain.Name == "sitecore") return;

            Assert.ArgumentNotNull(args, "args");
            var sitecoreUserLoggedIn = Context.IsLoggedIn;

            var userData = _userDataService.GetUserDataFromCookie(args.Context);

            if (sitecoreUserLoggedIn && userData == null)
            {
                AuthenticationManager.Logout();
                return;
            }
            if (!sitecoreUserLoggedIn && userData != null)
            {
                var user = BuildVirtualUser(userData);
                AuthenticationManager.LoginVirtualUser(user);
            }
            if (sitecoreUserLoggedIn)
            {
                if (!Context.User.LocalName.Equals(userData.NameIdentifier))
                {
                    LogoutAndClearUserDataCookie(args.Context);
                    return;
                }
                if (ExpirationHelper.IsExpired(userData.ExpiresAt))
                {
                    var claims = RefreshUserData(ref userData);
                    if (!claims.ToList().Any())
                    {
                        LogoutAndClearUserDataCookie(args.Context);
                        return;
                    }
                    _userDataService.SaveUserDataToCookie(claims, args.Context);
                }
                var user = BuildVirtualUser(userData);
                AuthenticationManager.LoginVirtualUser(user);
            }
        }

        private void LogoutAndClearUserDataCookie(HttpContext context)
        {
            AuthenticationManager.Logout();
            _userDataService.DeleteUserDataCookie(context);
        }
    }
}
