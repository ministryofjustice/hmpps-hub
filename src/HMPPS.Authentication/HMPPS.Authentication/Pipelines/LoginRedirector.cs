using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Sitecore;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Sites;
using Sitecore.Web;
using IdentityModel.Client;
using HMPPS.Utilities.Helpers;
using System.Globalization;
using HMPPS.Utilities.Models;
using System.Web;
using HMPPS.Utilities.Services;
using Sitecore.Security.Authentication;
using HMPPS.ErrorReporting;

namespace HMPPS.Authentication.Pipelines
{
    public class LoginRedirector : AuthenticationProcessorBase
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

        public void LogInHardcodedIdamUser(HttpContext context)
        {
            if (!Context.User.IsAuthenticated)
            {
                List<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, "A1466AE"));
                claims.Add(new Claim(ClaimTypes.GivenName, "Steven"));
                claims.Add(new Claim(ClaimTypes.Surname, "Woolfe"));
                claims.Add(new Claim(ClaimTypes.Email, "steven.woolfe@example.com"));
                claims.Add(new Claim("name", "Steven Woolfe"));
                claims.Add(new Claim("access_token", ""));
                claims.Add(new Claim("refresh_token", ""));
                claims.Add(new Claim("expires_at", ExpirationHelper.GetExpirationTimeString(86400)));
                claims.Add(new Claim("prison_id", "LEI"));
                claims.Add(new Claim("prison_name", "Leeds Prison"));
                claims.Add(new Claim("account_balance", "123.40"));
                claims.Add(new Claim("account_balance_lastupdated", DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)));
                var userData = new UserData(claims);
                var _logManager = new SitecoreLogManager();
                var _jwtTokenService = new JwtTokenService();
                var _encryptionService = new EncryptionService(_logManager);
                var _userDataService = new UserDataService(_encryptionService, _jwtTokenService);
                _userDataService.SaveUserDataToCookie(claims, context);
                var sitecoreUser = BuildVirtualUser(userData);
                AuthenticationManager.LoginVirtualUser(sitecoreUser);
                //WebUtil.Redirect(context.Request.Url.AbsoluteUri);
            }
        }
    }
}
