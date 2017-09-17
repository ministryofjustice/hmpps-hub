using System;
using System.Collections.Generic;
using System.IdentityModel.Protocols.WSTrust;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.ServiceModel.Security.Tokens;
using System.Text;
using HMPPS.Authentication.Interfaces;
using HMPPS.Authentication.Helpers;
using Sitecore.Links;

namespace HMPPS.Authentication.Services
{
    public class JwtTokenService : IJwtTokenService
    {

        public string GenerateJwtToken(IEnumerable<Claim> claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var symmetricKey = Encoding.UTF8.GetBytes(Settings.JwtTokenSecurityKey);

            var now = DateTime.UtcNow;
            var expiration = ExpirationHelper.GetExpirationTime(86400); // 1 day in sec
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                TokenIssuerName = "self",
                AppliesToAddress = GetHomeAddress(),
                Lifetime = new Lifetime(now, expiration),
                SigningCredentials = new SigningCredentials(
                        new InMemorySymmetricSecurityKey(symmetricKey),
                        "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256",
                        "http://www.w3.org/2001/04/xmlenc#sha256"),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
       
        public IEnumerable<Claim> GetClaimsFromJwtToken(string tokenString)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var symmetricKey = Encoding.UTF8.GetBytes(Settings.JwtTokenSecurityKey);

            var validationParameters = new TokenValidationParameters()
            {
                IssuerSigningToken = new BinarySecretSecurityToken(symmetricKey),
                ValidAudience = GetHomeAddress(),
                ValidIssuer = "self"
            };
            // todo: error handling if token is invalid
            SecurityToken securityToken;
            var claimsPrincipal = tokenHandler.ValidateToken(tokenString, validationParameters, out securityToken);

            return claimsPrincipal.Claims;
        }
    

        private static string GetHomeAddress()
        {
            // TODO: check why hostname and targethostname of "website" are missing from Sitecore.config 
            if (!string.IsNullOrEmpty(Sitecore.Context.Site.TargetHostName))
                return Sitecore.Context.Site.TargetHostName;
            var homeItem = Sitecore.Context.Database.GetItem(Sitecore.Context.Site.ContentStartPath);
            var urlOptions = new UrlOptions() { AlwaysIncludeServerUrl = true, LanguageEmbedding = LanguageEmbedding.Never };
            return LinkManager.GetItemUrl(homeItem, urlOptions);
        }

        private static byte[] GetRandomBytes(int len)
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                var key = new byte[256];
                rng.GetBytes(key);
                return key;
            }
        }

    }
}
