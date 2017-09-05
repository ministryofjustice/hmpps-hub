using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Web;
//using Microsoft.Practices.ServiceLocation;
using Sitecore;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security;
using Sitecore.Security.Accounts;
using Sitecore.Security.Authentication;
using Sitecore.Web;
using Convert = System.Convert;
using IdentityModel.Client;
using IdentityModel;

namespace HMPPS.Authentication.Pipelines
{
    public class OAuth2SignInCallback : HttpRequestProcessor
    {
        public override void Process(HttpRequestArgs args)
        {
            // NOTE - no error handling added. Failed requests are expected to result in an unhandled exception. 

            // Only act on unauthenticated requests against the sign-in callback URL
            if (Context.User == null || Context.User.IsAuthenticated ||
                Context.User.Identity.GetType() == typeof(UserProfile) ||
                !args.Context.Request.Url.AbsoluteUri.StartsWith(Settings.SignInCallbackUrl)) return;

            // Validate token and construct claims prinicpal / session security token
            var tempCookie = args.Context.Request.Cookies[Settings.TempCookieName];
            var claims = ValidateCodeAndGetClaims(args.Context.Request.QueryString["code"], args.Context.Request.QueryString["state"], tempCookie);
            var identity = new ClaimsIdentity(claims, "Forms", ClaimTypes.Name, ClaimTypes.Role);
            var principal = new ClaimsPrincipal(identity);
            var sessionSecurityToken = new SessionSecurityToken(principal);

            // Build sitecore user and log in 
            var user = BuildVirtualUser(sessionSecurityToken);
            AuthenticationManager.LoginVirtualUser(user);

            if (tempCookie != null)
            {
                tempCookie.Expires = DateTime.Now.AddDays(-1);
                args.Context.Response.Cookies.Add(tempCookie);
            }
            var targetUrl = tempCookie?.Values["returnUrl"] ?? "/";
            WebUtil.Redirect(targetUrl);
        }

        public IEnumerable<Claim> ValidateCodeAndGetClaims(string code, string state, HttpCookie tempCookie)
        {
            if (tempCookie == null)
                throw new InvalidOperationException("Could not validate identity token. No temp cookie found.");

            if (string.IsNullOrWhiteSpace(tempCookie.Values["state"]) || tempCookie.Values["state"] != state)
                throw new InvalidOperationException("Could not validate identity token. Invalid state.");

            if (string.IsNullOrWhiteSpace(tempCookie.Values["nonce"]))
                throw new InvalidOperationException("Could not validate identity token. Invalid nonce.");

            return GetTokenAndClaims(code, tempCookie.Values["nonce"]);
        }

        public IEnumerable<Claim> GetTokenAndClaims(string code, string nonce)
        {
            //TODO: Remove these SSL hacks
            // Dev service uses fake cert
            System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            // Dev service doesn't work with TLS 1.2 within .NET
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls11;

            var client = new TokenClient(
                Settings.TokenEndpoint,
                Settings.ClientId,
                Settings.ClientSecret);
            
            var response = client.RequestAuthorizationCodeAsync(
                code,
                Settings.SignInCallbackUrl).Result;

            return ValidateResponseAndSignIn(response, nonce);
        }

        private IEnumerable<Claim> ValidateResponseAndSignIn(TokenResponse response, string nonce)
        {
            if (string.IsNullOrWhiteSpace(response.IdentityToken))
                throw new InvalidOperationException("Could not validate identity token, empty or missing.");
            
            var tokenClaims = ValidateIdentityToken(response.IdentityToken, nonce);

            //TODO: Sign in to record tokens and check them each request.
            return tokenClaims;

            var claims = new List<Claim>();

            if (!string.IsNullOrWhiteSpace(response.AccessToken))
            {
                //claims.AddRange(await GetUserInfoClaimsAsync(response.AccessToken));

                claims.Add(new Claim("access_token", response.AccessToken));
                claims.Add(new Claim("expires_at", (DateTime.UtcNow.ToEpochTime() + response.ExpiresIn).ToDateTimeFromEpoch().ToString()));
            }

            if (!string.IsNullOrWhiteSpace(response.RefreshToken))
            {
                claims.Add(new Claim("refresh_token", response.RefreshToken));
            }

            //TODO: Sign in to record tokens and check them each request.
            //var id = new ClaimsIdentity(claims, "Cookies");
            //Request.GetOwinContext().Authentication.SignIn(id);
        }

        private IEnumerable<Claim> ValidateIdentityToken(string token, string nonce)
        {
            var cert = new X509Certificate2(Convert.FromBase64String(Settings.PublicKey));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidAudience = Settings.ClientId,
                ValidIssuer = Settings.ValidIssuer,
                IssuerSigningToken = new X509SecurityToken(cert)
            };

            var handler = new JwtSecurityTokenHandler();
            SecurityToken jwt;
            var principal = handler.ValidateToken(token, tokenValidationParameters, out jwt);

            // validate nonce
            var nonceClaim = principal.FindFirst("nonce");

            if (!string.Equals(nonceClaim.Value, nonce, StringComparison.Ordinal))
            {
                throw new InvalidOperationException("Could not validate identity token. Invalid nonce");
            }

            return principal.Claims;
        }

        private User BuildVirtualUser(SessionSecurityToken sessionToken)
        {
            var domain = "extranet";
            var userId = sessionToken.ClaimsPrincipal.Claims.Single(c => c.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var roles = sessionToken.ClaimsPrincipal.Claims.Where(c => c.Type.Equals("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")).Select(c => c.Value);

            var username = $"{domain}\\{userId}";
            var user = AuthenticationManager.BuildVirtualUser(username, true);
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
