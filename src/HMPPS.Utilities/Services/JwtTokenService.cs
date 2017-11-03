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
using Sitecore.SecurityModel;
using Sitecore.Data.Items;

namespace HMPPS.Utilities.Services
{
    public class JwtTokenService : IJwtTokenService
    {

        private readonly string _homePageAddress;

        public JwtTokenService()
        {
            _homePageAddress = GetHomeAddress();
        }

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
                AppliesToAddress = _homePageAddress,
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
                ValidAudience = _homePageAddress,
                ValidIssuer = "self"
            };
            // todo: error handling if token is invalid
            SecurityToken securityToken;
            var claimsPrincipal = tokenHandler.ValidateToken(tokenString, validationParameters, out securityToken);

            return claimsPrincipal.Claims;
        }


        private static string GetHomeAddress()
        {
            var website = SiteContext.GetSite("website");

            if (!string.IsNullOrEmpty(website.TargetHostName))
                return website.TargetHostName;

            using (var siteContextSwitcher = new SiteContextSwitcher(website))
            {
                Item homeItem = null;
                using (new SecurityDisabler())
                {
                    homeItem = website.Database.GetItem(website.StartPath);
                    var urlOptions = new UrlOptions() { AlwaysIncludeServerUrl = true, LanguageEmbedding = LanguageEmbedding.Never, SiteResolving = true };
                    return LinkManager.GetItemUrl(homeItem, urlOptions);
                }
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
