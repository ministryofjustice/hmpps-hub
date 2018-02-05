using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using HMPPS.ErrorReporting;
using Sitecore.Pipelines.HttpRequest;
using Sitecore.Security.Accounts;
using Sitecore.Security.Authentication;
using HMPPS.Utilities.Models;
using HMPPS.NomisApiService.Interfaces;

namespace HMPPS.Authentication.Pipelines
{
    public abstract class AuthenticationProcessorBase : HttpRequestProcessor
    {

        protected INomisApiService NomisApiService;
        protected ILogManager LogManager;

        public IEnumerable<Claim> RefreshUserData(ref UserData userData)
        {
            var tokenManager = new TokenManager(LogManager);
            var tokenResponse = tokenManager.RequestRefreshToken(userData.RefreshToken);
            if (tokenResponse.IsError)
            {
                Sitecore.Diagnostics.Log.Error("HMPPS.Authentication.Pipelines.AuthenticationProcessorBase - " + tokenResponse.ErrorType + " error in RefreshUserData(): " + tokenResponse.ErrorDescription, tokenResponse.Exception, this);
                return new List<Claim>();
            }
            var claimsPrincipal = tokenManager.ValidateIdentityToken(tokenResponse.IdentityToken);
            var claims = tokenManager.ExtractClaims(tokenResponse, claimsPrincipal).ToList();
            AddPrisonerDetailsToClaims(userData.NameIdentifier, ref claims);
            userData = new UserData(claims);
            return claims;
        }

        protected void AddPrisonerDetailsToClaims(string prisonerId, ref List<Claim> claims)
        {
            var prisonId = (claims.FirstOrDefault(c => c.Type == "pnomisLocation"))?.Value;
            var accounts = NomisApiService.GetPrisonerAccounts(prisonId, prisonerId);
            if (accounts == null) return;
            claims.Add(new Claim("account_spends",
                accounts.Spends.ToString(CultureInfo.InvariantCulture.NumberFormat)));
            claims.Add(new Claim("account_cash",
                accounts.Cash.ToString(CultureInfo.InvariantCulture.NumberFormat)));
            claims.Add(new Claim("account_savings",
                accounts.Savings.ToString(CultureInfo.InvariantCulture.NumberFormat)));
            claims.Add(new Claim("accounts_lastupdated",
                DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)));
        }

        protected User BuildVirtualUser(UserData idamData)
        {
            var domain = "extranet";
            var userId = idamData.NameIdentifier;
            var email = idamData.Email;
            var roles = idamData.Roles;

            var username = $"{domain}\\{userId}";
            var user = AuthenticationManager.BuildVirtualUser(username, true);
            user.Profile.Email = email;
            user.Profile.FullName = idamData.Name;
            user.Profile.Save();
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
