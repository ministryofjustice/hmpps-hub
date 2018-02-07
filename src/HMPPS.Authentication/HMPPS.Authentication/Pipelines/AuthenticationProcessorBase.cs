using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using HMPPS.ErrorReporting;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security.Accounts;
using Sitecore.Security.Authentication;
using HMPPS.Utilities.Models;

namespace HMPPS.Authentication.Pipelines
{
    public abstract class AuthenticationProcessorBase : HttpRequestProcessor
    {
        protected ILogManager LogManager;

        public IEnumerable<Claim> RefreshUserIdamData(ref UserIdamData userIdamData)
        {
            var tokenManager = new TokenManager(LogManager);
            var tokenResponse = tokenManager.RequestRefreshToken(userIdamData.RefreshToken);
            if (tokenResponse.IsError)
            {
                Sitecore.Diagnostics.Log.Error("HMPPS.Authentication.Pipelines.AuthenticationProcessorBase - " + tokenResponse.ErrorType + " error in RefreshUserData(): " + tokenResponse.ErrorDescription, tokenResponse.Exception, this);
                return new List<Claim>();
            }
            var claimsPrincipal = tokenManager.ValidateIdentityToken(tokenResponse.IdentityToken);
            var claims = tokenManager.ExtractClaims(tokenResponse, claimsPrincipal).ToList();
            userIdamData = new UserIdamData(claims);
            return claims;
        }

        protected User BuildVirtualUser(UserIdamData idamData)
        {
            var domain = "extranet";
            var userId = idamData.NameIdentifier;

            var username = $"{domain}\\{userId}";
            var user = AuthenticationManager.BuildVirtualUser(username, true);
            user.Profile.Save();
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
