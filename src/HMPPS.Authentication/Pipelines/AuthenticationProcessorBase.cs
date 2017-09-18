using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security.Accounts;
using Sitecore.Security.Authentication;
using HMPPS.Authentication.Services;
using HMPPS.Authentication.Helpers;

namespace HMPPS.Authentication.Pipelines
{
    public abstract class AuthenticationProcessorBase : HttpRequestProcessor
    {
        protected void SaveIdamDataToCookie(IEnumerable<Claim> claims, HttpContext context)
        {
            // store claims into a secure cookie
            var jwtTokenService = new JwtTokenService();
            var jwtToken = jwtTokenService.GenerateJwtToken(claims);
            var authenticationCheckerCookie = new CookieHelper(Settings.AuthenticationCheckerCookieName, context);
            authenticationCheckerCookie.SetValue(Settings.AuthenticationCheckerCookieKey, jwtToken);
            authenticationCheckerCookie.Save();
        }

        protected IdamData GetIdamDataFromCookie(HttpContext context)
        {
            var cookie = new CookieHelper(Settings.AuthenticationCheckerCookieName, context);
            if (cookie == null)
                return null;

            cookie.GetCookie();
            var token = cookie.GetValue(Settings.AuthenticationCheckerCookieKey);
            if (string.IsNullOrEmpty(token))
                return null;

            var claims = new JwtTokenService().GetClaimsFromJwtToken(token);
            return new IdamData(claims);
        }

        protected void DeleteIdamDataCookie(HttpContext context)
        {
            var cookie = new CookieHelper(Settings.AuthenticationCheckerCookieName, context);
            if (cookie == null)
                return;
            cookie.Delete();
        }

        protected IEnumerable<Claim> RefreshIdamData(ref IdamData idamData)
        {
            var tokenManager = new TokenManager();
            var tokenResponse = tokenManager.RequestRefreshToken(idamData.RefreshToken);
            var claimsPrincipal = tokenManager.ValidateIdentityToken(tokenResponse.IdentityToken);
            var claims = tokenManager.ExtractClaims(tokenResponse, claimsPrincipal);
            idamData = new IdamData(claims);
            return claims;
        }

        protected User BuildVirtualUser(IdamData idamData)
        {
            var domain = "extranet";
            var userId = idamData.NameIdentifier;
            var email = idamData.Email;
            var roles = idamData.Roles;

            var username = $"{domain}\\{userId}";
            var user = AuthenticationManager.BuildVirtualUser(username, true);
            user.Profile.Email = email;
            user.Profile.FullName = idamData.Name;
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
