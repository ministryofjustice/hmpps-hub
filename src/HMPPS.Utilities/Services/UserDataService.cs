using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Web;
using HMPPS.ErrorReporting;
using HMPPS.Utilities.Helpers;
using HMPPS.Utilities.Interfaces;
using HMPPS.Utilities.Models;


namespace HMPPS.Utilities.Services
{
    public class UserDataService : IUserDataService
    {
        private readonly IEncryptionService _encryptionService;

        private readonly IJwtTokenService _jwtTokenService;

        private ILogManager _logManager;

        private const string AccountBalancesSessionKey = "AccountBalances";

        public UserDataService(IEncryptionService encryptionService, IJwtTokenService jwtTokenService, ILogManager logManager)
        {
            _encryptionService = encryptionService;
            _jwtTokenService = jwtTokenService;
            _logManager = logManager;
        }

        public void SaveUserIdamDataToCookie(IEnumerable<Claim> claims, HttpContext context)
        {
            // store claims into a secure cookie
            var jwtToken = _jwtTokenService.GenerateJwtToken(claims, Settings.JwtTokenSecurityKey);

            var encodedJwtToken = _encryptionService.Encode(jwtToken);

            var userDataCookie = new CookieHelper(Settings.UserDataCookieName, context);
            userDataCookie.SetValue(Settings.UserDataCookieKey, encodedJwtToken);
            userDataCookie.Save();
        }

        public UserIdamData GetUserIdamDataFromCookie(HttpContext context)
        {
            var cookie = new CookieHelper(Settings.UserDataCookieName, context);

            cookie.GetCookie();
            var encodedJwtToken = cookie.GetValue(Settings.UserDataCookieKey);
            if (string.IsNullOrEmpty(encodedJwtToken))
                return null;

            var jwtToken = _encryptionService.Decode(encodedJwtToken);

            IEnumerable<Claim> claims;
            try
            {
                claims = _jwtTokenService.GetClaimsFromJwtToken(jwtToken, Settings.JwtTokenSecurityKey);
            }
            catch (Exception)
            {
                //_logManager.LogError("GetUserDataFromCookie failed", ex, this); // Uncomment for debug purposes
                return null;
            }
            return new UserIdamData(claims);
        }

        public void DeleteUserIdamDataCookie(HttpContext context)
        {
            var cookie = new CookieHelper(Settings.UserDataCookieName, context);
            cookie.Delete();
        }

        public UserAccountBalances GetAccountBalancesFromSession(HttpContext context)
        {
            return SessionHelper.Get<UserAccountBalances>(context, AccountBalancesSessionKey);
        }

        public void SaveAccountBalancesToSession(HttpContext context, UserAccountBalances balances)
        {
            SessionHelper.Set(context, AccountBalancesSessionKey, balances);
        }

        public void DeleteAccountBalancesFromSession(HttpContext context)
        {
            SessionHelper.Remove(context, AccountBalancesSessionKey);
        }
    }
}
