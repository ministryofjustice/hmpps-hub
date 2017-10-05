using System;
using System.Collections.Generic;
using System.IdentityModel.Protocols.WSTrust;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.ServiceModel.Security.Tokens;
using System.Text;
using HMPPS.Utilities.Interfaces;
using HMPPS.Utilities.Helpers;
using Sitecore.Links;
using Sitecore.Sites;

namespace HMPPS.Utilities.Services
{
    public class JwtTokenService : IJwtTokenService
    {

        public string GenerateJwtToken(IEnumerable<Claim> claims, string jwtTokenSecurityKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var symmetricKey = Encoding.UTF8.GetBytes(jwtTokenSecurityKey);

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

        public IEnumerable<Claim> GetClaimsFromJwtToken(string tokenString, string jwtTokenSecurityKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var symmetricKey = Encoding.UTF8.GetBytes(jwtTokenSecurityKey);

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
            var website = SiteContext.GetSite("website");

            if (!string.IsNullOrEmpty(website.TargetHostName))
                return website.TargetHostName;

            using (var siteContextSwitcher = new SiteContextSwitcher(website))
            {
                var homeItem = website.Database.GetItem(website.StartPath);
                var urlOptions = new UrlOptions() { AlwaysIncludeServerUrl = true, LanguageEmbedding = LanguageEmbedding.Never, SiteResolving = true };
                return LinkManager.GetItemUrl(homeItem, urlOptions);
            }
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
