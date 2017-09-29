using System.Collections.Generic;
using System.Security.Claims;
using System.Web;
using HMPPS.Utilities.Helpers;
using HMPPS.Utilities.Interfaces;
using HMPPS.Utilities.Models;

namespace HMPPS.Utilities.Services
{
    public class UserDataService : IUserDataService
    {

        public string UserDataCookieName { get; private set; }

        public string UserDataCookieKey { get; private set; }

        public string JwtTokenSecurityKey { get; private set; }


        public UserDataService(string userDataCookieName, string userDataCookieKey, string jwtTokenSecurityKey)
        {
            UserDataCookieName = userDataCookieName;
            UserDataCookieKey = userDataCookieKey;
            JwtTokenSecurityKey = jwtTokenSecurityKey;
        }

        public void SaveUserDataToCookie(IEnumerable<Claim> claims, HttpContext context)
        {
            // store claims into a secure cookie
            var jwtTokenService = new JwtTokenService();
            var jwtToken = jwtTokenService.GenerateJwtToken(claims, JwtTokenSecurityKey);

            var encryptionService = new EncryptionService();
            var encryptedJwtToken = encryptionService.Encrypt(jwtToken);

            var userDataCookie = new CookieHelper(UserDataCookieName, context);
            userDataCookie.SetValue(UserDataCookieKey, encryptedJwtToken);
            userDataCookie.Save();
        }

        public UserData GetUserDataFromCookie(HttpContext context)
        {
            var cookie = new CookieHelper(UserDataCookieName, context);
            if (cookie == null)
                return null;

            cookie.GetCookie();
            var encryptedJwtToken = cookie.GetValue(UserDataCookieKey);
            if (string.IsNullOrEmpty(encryptedJwtToken))
                return null;

            var encryptionService = new EncryptionService();
            var jwtToken = encryptionService.Decrypt(encryptedJwtToken);

            var claims = new JwtTokenService().GetClaimsFromJwtToken(jwtToken, JwtTokenSecurityKey);
            return new UserData(claims);
        }

        public void DeleteUserDataCookie(HttpContext context)
        {
            var cookie = new CookieHelper(UserDataCookieName, context);
            if (cookie == null)
                return;
            cookie.Delete();
        }

    }
}
