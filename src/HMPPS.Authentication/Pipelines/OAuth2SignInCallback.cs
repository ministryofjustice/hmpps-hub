using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Sitecore;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security;
using Sitecore.Security.Authentication;
using Sitecore.Web;
using HMPPS.Utilities.Helpers;
using HMPPS.Utilities.Models;
using HMPPS.Utilities.Services;

namespace HMPPS.Authentication.Pipelines
{
    public class OAuth2SignInCallback : AuthenticationProcessorBase
    {
        public override void Process(HttpRequestArgs args)
        {
            // NOTE - no error handling added. Failed requests are expected to result in an unhandled exception, which should show friendly error page.

            // Only act on unauthenticated requests against the sign-in callback URL
            if (Context.User == null || Context.User.IsAuthenticated ||
                Context.User.Identity.GetType() == typeof(UserProfile) ||
                !args.Context.Request.Url.AbsoluteUri.StartsWith(Settings.SignInCallbackUrl)) return;

            // Validate token and obtain claims
            //var tempCookie = args.Context.Request.Cookies[Settings.TempCookieName];
            var tempCookie = new CookieHelper(Settings.TempCookieName, args.Context);
            var tempHttpCookie = tempCookie.GetCookie();
            var claims = ValidateCodeAndGetClaims(args.Context.Request.QueryString["code"], args.Context.Request.QueryString["state"], tempHttpCookie).ToList();
            var prisonerId = (claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier))?.Value;
            AddPrisonerDetailsToClaims(prisonerId, ref claims);

            var userData = new UserData(claims);
            var userDataService = new UserDataService(Settings.AuthenticationCheckerCookieName, Settings.AuthenticationCheckerCookieKey, Settings.JwtTokenSecurityKey);

            // store claims into a secure cookie - TODO: use UserData, not claims
            userDataService.SaveUserDataToCookie(claims, args.Context);

            // Build sitecore user and log in - this will persist until log out or session ends.

            var user = BuildVirtualUser(userData);
            AuthenticationManager.LoginVirtualUser(user);

            var targetUrl = tempCookie.GetValue("returnUrl") ?? "/";

            tempCookie.Delete();

            WebUtil.Redirect(targetUrl);
        }

        private IEnumerable<Claim> ValidateCodeAndGetClaims(string code, string state, HttpCookie tempCookie)
        {
            if (tempCookie == null)
                throw new InvalidOperationException("Could not validate identity token. No temp cookie found.");

            if (string.IsNullOrWhiteSpace(tempCookie.Values["state"]) || tempCookie.Values["state"] != state)
                throw new InvalidOperationException("Could not validate identity token. Invalid state.");

            if (string.IsNullOrWhiteSpace(tempCookie.Values["nonce"]))
                throw new InvalidOperationException("Could not validate identity token. Invalid nonce.");
            var nonce = tempCookie.Values["nonce"];

            var tokenManager = new TokenManager();

            //TODO: Call the async version - but you can't from within a pipeline! Move this into a controller and redirect to it?
            var tokenResponse = tokenManager.RequestAccessToken(code);

            var claimsPrincipal = tokenManager.ValidateIdentityToken(tokenResponse.IdentityToken, nonce);

            var claims = tokenManager.ExtractClaims(tokenResponse, claimsPrincipal);

            return claims;
        }
    }
}
