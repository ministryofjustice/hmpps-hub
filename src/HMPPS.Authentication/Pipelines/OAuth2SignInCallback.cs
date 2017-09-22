using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.ServiceModel.Security.Tokens;
using System.Text;
using System.Web;
using Sitecore;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security;
using Sitecore.Security.Accounts;
using Sitecore.Security.Authentication;
using Sitecore.Web;
using IdentityModel.Client;
using IdentityModel;

namespace HMPPS.Authentication.Pipelines
{
    public class OAuth2SignInCallback : HttpRequestProcessor
    {
        public override void Process(HttpRequestArgs args)
        {
            // NOTE - no error handling added. Failed requests are expected to result in an unhandled exception, which should show friendly error page.

            // Only act on unauthenticated requests against the sign-in callback URL
            if (Context.User == null || Context.User.IsAuthenticated ||
                Context.User.Identity.GetType() == typeof(UserProfile) ||
                !args.Context.Request.Url.AbsoluteUri.StartsWith(Settings.SignInCallbackUrl)) return;

            // Validate token and obtain claims
            var tempCookie = args.Context.Request.Cookies[Settings.TempCookieName];
            var claims = ValidateCodeAndGetClaims(args.Context.Request.QueryString["code"], args.Context.Request.QueryString["state"], tempCookie);

            // Build sitecore user and log in - this will persist until log out or session ends.
            var user = BuildVirtualUser(claims);
            AuthenticationManager.LoginVirtualUser(user);

            if (tempCookie != null)
            {
                tempCookie.Expires = DateTime.Now.AddDays(-1);
                args.Context.Response.Cookies.Add(tempCookie);
            }
            var targetUrl = tempCookie?.Values["returnUrl"] ?? "/";
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

            //TODO: Use an Owin auth context to record claims inc tokens in secure cookie and check them each request.
            //var id = new ClaimsIdentity(claims, "Cookies");
            //Request.GetOwinContext().Authentication.SignIn(id);

            //TODO: When detect token has expired, attempt to renew with refresh token, or log out if this fails:
            //var refreshedToken = tokenManager.RequestRefreshToken(tokenResponse.RefreshToken);

            return claims;
        }
        
        private User BuildVirtualUser(IEnumerable<Claim> claims)
        {
            var domain = "extranet";
            var userId = claims.Single(c => c.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            var email = claims.SingleOrDefault(c => c.Type.Equals(ClaimTypes.Email))?.Value;
            var roles = claims.Where(c => c.Type.Equals(ClaimTypes.Role)).Select(c => c.Value);

            var username = $"{domain}\\{userId}";
            var user = AuthenticationManager.BuildVirtualUser(username, true);
            user.Profile.Email = email;
            user.Profile.FullName = claims.Single(c => c.Type.Equals("name")).Value;
            AssignUserRoles(user, roles);
            return user;
        }
        
        private void AssignUserRoles(User user, IEnumerable<string> roles)
        {
            user.RuntimeSettings.AddedRoles.Clear();
            user.Roles.RemoveAll();

            foreach (var role in roles.Where(Role.Exists))
            {
                user.Roles.Add(Role.FromName(role));
            }
        }
    }
}
