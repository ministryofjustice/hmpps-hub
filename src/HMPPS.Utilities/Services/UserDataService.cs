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

        public UserDataService(IEncryptionService encryptionService, IJwtTokenService jwtTokenService, ILogManager logManager)
        {
            _encryptionService = encryptionService;
            _jwtTokenService = jwtTokenService;
            _logManager = logManager;
        }

        public void SaveUserDataToCookie(IEnumerable<Claim> claims, HttpContext context)
        {
            // store claims into a secure cookie
            var jwtToken = _jwtTokenService.GenerateJwtToken(claims, Settings.JwtTokenSecurityKey);

            var encryptedJwtToken = _encryptionService.Encrypt(jwtToken);

            var userDataCookie = new CookieHelper(Settings.UserDataCookieName, context);
            userDataCookie.SetValue(Settings.UserDataCookieKey, encryptedJwtToken);
            userDataCookie.Save();
        }

        public UserData GetUserDataFromCookie(HttpContext context)
        {
            var cookie = new CookieHelper(Settings.UserDataCookieName, context);

            cookie.GetCookie();
            var encryptedJwtToken = cookie.GetValue(Settings.UserDataCookieKey);
            if (string.IsNullOrEmpty(encryptedJwtToken))
                return null;

            var jwtToken = _encryptionService.Decrypt(encryptedJwtToken);

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
            return new UserData(claims);
        }

        public void DeleteUserDataCookie(HttpContext context)
        {
            var cookie = new CookieHelper(Settings.UserDataCookieName, context);
            cookie.Delete();
        }

    }
}
