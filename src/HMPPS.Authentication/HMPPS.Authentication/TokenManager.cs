using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.ServiceModel.Security.Tokens;
using System.Text;
using System.Threading.Tasks;
using IdentityModel.Client;
using HMPPS.Utilities.Helpers;

namespace HMPPS.Authentication
{
    public class TokenManager
    {
        public TokenManager() : this(true)
        {
        }

        public TokenManager(bool useSitecoreSettings)
        {
            if (!useSitecoreSettings) return;
            AuthorizeEndpoint = Settings.AuthorizeEndpoint;
            SignInCallbackUrl = Settings.SignInCallbackUrl;
            TokenEndpoint = Settings.TokenEndpoint;
            ClientId = Settings.ClientId;
            ClientSecret = Settings.ClientSecret;
            Scope = Settings.Scope;
            ValidIssuer = Settings.ValidIssuer;
        }

        public string AuthorizeEndpoint { get; set; }
        public string SignInCallbackUrl { get; set; }
        public string TokenEndpoint { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Scope { get; set; }
        public string ValidIssuer { get; set; }

        public string GetAuthenticationRedirectUrl(string state, string nonce)
        {
            var request = new AuthorizeRequest(AuthorizeEndpoint);

            var url = request.CreateAuthorizeUrl(
                clientId: ClientId,
                responseType: "code",
                scope: Scope,
                redirectUri: SignInCallbackUrl,
                state: state,
                nonce: nonce);

            return url;
        }
        
        public TokenResponse RequestAccessToken(string code)
        {
            // Dev service uses fake cert
            System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            // Dev service does work with TLS 1.2 within .NET
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

            var client = new TokenClient(
                TokenEndpoint,
                ClientId,
                ClientSecret);

            var response = client.RequestAuthorizationCodeAsync(
                code,
                SignInCallbackUrl).Result;

            return response;
        }

        public TokenResponse RequestRefreshToken(string refreshToken)
        {
            // Dev service uses fake cert
            System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            // Dev service does work with TLS 1.2 within .NET
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

            var client = new TokenClient(
                TokenEndpoint,
                ClientId,
                ClientSecret);

            var response = client.RequestRefreshTokenAsync(
                refreshToken).Result;

            return response;
        }

        public async Task<TokenResponse> ObtainAccessTokenAsync(string code)
        {
            // Dev service uses fake cert
            System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            // Dev service does work with TLS 1.2 within .NET
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

            var client = new TokenClient(
                TokenEndpoint,
                ClientId,
                ClientSecret);
            
            var response = await client.RequestAuthorizationCodeAsync(
                code,
                SignInCallbackUrl);

            return response;
        }
        
        public ClaimsPrincipal ValidateIdentityToken(string token, string nonce = null)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new InvalidOperationException("Could not validate identity token, empty or missing.");

            // Token is signed HS256 by the client secret 
            // see https://stackoverflow.com/a/25376518
            var signingSecretKey = Encoding.UTF8.GetBytes(ClientSecret);
            if (signingSecretKey.Length < 64)
            {
                Array.Resize(ref signingSecretKey, 64);
            }

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidAudience = ClientId,
                ValidIssuer = ValidIssuer,
                IssuerSigningToken = new BinarySecretSecurityToken(signingSecretKey)
            };

            var handler = new JwtSecurityTokenHandler();
            SecurityToken jwt;
            var principal = handler.ValidateToken(token, tokenValidationParameters, out jwt);

            // validate nonce only if parameter is provided
            if (string.IsNullOrEmpty(nonce))
            {
                return principal;
            }

            var nonceClaim = principal.FindFirst("nonce");
            if (nonceClaim == null)
            {
                throw new InvalidOperationException("Could not validate identity token. Missing nonce");
            }

            if (!string.Equals(nonceClaim.Value, nonce, StringComparison.Ordinal))
            {
                throw new InvalidOperationException("Could not validate identity token. Invalid nonce");
            }

            return principal;
        }

        public IEnumerable<Claim> ExtractClaims(TokenResponse response, ClaimsPrincipal tokenClaims)
        {
            var claims = new List<Claim>();

            var prisonerIdClaim = tokenClaims.FindFirst(c => c.Type == ClaimTypes.NameIdentifier);
            if (prisonerIdClaim != null)
            {
                claims.Add(new Claim(ClaimTypes.NameIdentifier, prisonerIdClaim.Value.ToUpperInvariant()));
            }

            claims.AddRange(tokenClaims.FindAll(c => c.Type == ClaimTypes.Role
                                                     || c.Type == ClaimTypes.GivenName
                                                     || c.Type == ClaimTypes.Surname
                                                     || c.Type == ClaimTypes.Email
                                                     || c.Type == "name"));

            if (!string.IsNullOrWhiteSpace(response.AccessToken))
            {
                //claims.AddRange(await GetUserInfoClaimsAsync(response.AccessToken));

                claims.Add(new Claim("access_token", response.AccessToken));
                claims.Add(new Claim("expires_at", ExpirationHelper.GetExpirationTimeString(response.ExpiresIn)));
            }

            if (!string.IsNullOrWhiteSpace(response.RefreshToken))
            {
                claims.Add(new Claim("refresh_token", response.RefreshToken));
            }
            return claims;
        }
    }
}
