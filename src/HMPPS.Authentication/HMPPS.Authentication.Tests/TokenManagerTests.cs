using System;
using System.IdentityModel;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using IdentityModel.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using HMPPS.ErrorReporting;

namespace HMPPS.Authentication.Tests
{
    [TestClass]
    public class TokenManagerTests
    {
        private string testClientId = "www.example.com";
        private string testClientSecret = "qwertyuiopasdfghjklzxcvbnm123456";
        private string testIssuer = "Online JWT Builder";
        private string testIdentityToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDQ4MzM3NDEsImV4cCI6MTkxNTA2MDk0MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IkpvaG5ueSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJSb2NrZXQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwibm9uY2UiOiI2ZWRmODhjN2UwMWY0MjhjYWUwM2QzNDZlYjgyZTk2MiJ9.c3xr-M6-RzFU6FgIXSwcDEjijF1jjASTp2uSr7oqD6s";
        private string testNonce = "6edf88c7e01f428cae03d346eb82e962";

        [TestMethod]
        public void TokenManager_GetAuthenticationRedirectUrl()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ClientId = "clientid",
                AuthorizeEndpoint = "http://auth/endpoint",
                Scope = "scope",
                SignInCallbackUrl = "redirect_uri"
            };
            var state = "state";
            var nonce = "nonce";

            var url = tm.GetAuthenticationRedirectUrl(state, nonce);

            Assert.AreEqual(url, "http://auth/endpoint?client_id=clientid&response_type=code&scope=scope&redirect_uri=redirect_uri&state=state&nonce=nonce");
        }

        [TestMethod]
        public void TokenManager_ValidateIdentityToken_CanVerifyValidToken()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ValidIssuer = testIssuer,
                ClientId = testClientId,
                ClientSecret = testClientSecret
            };

            var principal = tm.ValidateIdentityToken(testIdentityToken, testNonce);

            Assert.AreEqual("Johnny", principal.FindFirst(ClaimTypes.GivenName).Value);
            Assert.AreEqual("jrocket@example.com", principal.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        [TestMethod]
        public void TokenManager_ValidateIdentityToken_RejectsBadIssuer()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ValidIssuer = "https://wrong_issuer/openam/oauth2",
                ClientId = testClientId,
                ClientSecret = testClientSecret
            };

            Assert.ThrowsException<SecurityTokenInvalidIssuerException>(() => tm.ValidateIdentityToken(testIdentityToken, testNonce));
        }

        [TestMethod]
        public void TokenManager_ValidateIdentityToken_RejectsBadClientId()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ValidIssuer = testIssuer,
                ClientId = "bad_client_id",
                ClientSecret = testClientSecret
            };

            Assert.ThrowsException<SecurityTokenInvalidAudienceException>(() => tm.ValidateIdentityToken(testIdentityToken, testNonce));
        }

        [TestMethod]
        public void TokenManager_ValidateIdentityToken_RejectsBadClientSecret()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ValidIssuer = testIssuer,
                ClientId = testClientId,
                ClientSecret = "bad_client_secret"
            };

            Assert.ThrowsException<SignatureVerificationFailedException>(() => tm.ValidateIdentityToken(testIdentityToken, testNonce));
        }

        [TestMethod]
        public void TokenManager_ValidateIdentityToken_RejectsBadNonce()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ValidIssuer = testIssuer,
                ClientId = testClientId,
                ClientSecret = testClientSecret
            };
            var nonce = "bad_nonce";

            Assert.ThrowsException<InvalidOperationException>(() => tm.ValidateIdentityToken(testIdentityToken, nonce));
        }

        [TestMethod]
        public void TokenManager_ExtractClaims_ExtractsClaimsFromPrincipal()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false)
            {
                ValidIssuer = testIssuer,
                ClientId = testClientId,
                ClientSecret = testClientSecret
            };
            var claimsPrincipal = tm.ValidateIdentityToken(testIdentityToken, testNonce);
            var tokenResponse = new TokenResponse("");

            var claims = tm.ExtractClaims(tokenResponse, claimsPrincipal);

            Assert.IsNotNull(claims);
            Assert.AreEqual(2, claims.Count());
            Assert.AreEqual("Johnny", claims.Single(c => c.Type == ClaimTypes.GivenName).Value);
            Assert.AreEqual("jrocket@example.com", claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value, true);
        }

        [TestMethod]
        public void TokenManager_ExtractClaims_ExtractsClaimsFromToken()
        {
            var tm = new TokenManager(new Mock<ILogManager>().Object, false);
            var claimsPrincipal = new ClaimsPrincipal();
            var tokenResponse = new TokenResponse("{\"access_token\":\"a08cee40-3113-4092-b7a9-a38902f6e4f2\",\"refresh_token\":\"a051ec5f-be15-40b0-9540-210511d892b2\",\"scope\":\"openid profile email\",\"id_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdF9oYXNoIjoiVy04VEE0VHg4TW56emxQRC1ZZnpFUSIsInN1YiI6InVzZXIuMCIsImF1ZGl0VHJhY2tpbmdJZCI6ImM1MTZmYzcxLWMxMGMtNGQ1Ny1iN2Q4LWFkMGNiNWM2ODM1NC0zOTkxNyIsImlzcyI6Imh0dHBzOi8vNTEuMTQxLjU1LjE1OTo4MDgwL29wZW5hbS9vYXV0aDIiLCJ0b2tlbk5hbWUiOiJpZF90b2tlbiIsImdpdmVuX25hbWUiOiJBYWNjZiIsIm5vbmNlIjoiMTc4YzJiMjEwYjU5NDZkZjg0OGUyYTM5ZjM4ZWFjMWYiLCJhdWQiOiJDTVNfRTNfQ0xJRU5USUQiLCJjX2hhc2giOiJtdm8zRkYwWTlXOUlnMTQyMXVIcmVnIiwib3JnLmZvcmdlcm9jay5vcGVuaWRjb25uZWN0Lm9wcyI6ImZhODFkYTQ4LTRkMWYtNDM3ZS1iZWEwLWNjYTEzMDdhZGUxZiIsImF6cCI6IkNNU19FM19DTElFTlRJRCIsImF1dGhfdGltZSI6MTUwNDgyODQ3OSwibmFtZSI6IkFhY2NmIEFtYXIiLCJyZWFsbSI6Ii8iLCJleHAiOjE1MDQ4MzIwOTUsInRva2VuVHlwZSI6IkpXVFRva2VuIiwiaWF0IjoxNTA0ODI4NDk1LCJmYW1pbHlfbmFtZSI6IkFtYXIiLCJlbWFpbCI6InVzZXIuMEBtYWlsZG9tYWluLm5ldCIsImZvcmdlcm9jayI6eyJzaWciOiJ9RnkwLjh5SGU8dnpUUTRoZC9zeE5hPEMqVyQqeUhMW2FCPmdqc1QvIn19.Rdv3OEb48Kvjmgib8RA-gQqm8YhG5ytBQnB2aj6Qq7Y\",\"token_type\":\"Bearer\",\"expires_in\":599,\"nonce\":\"178c2b210b5946df848e2a39f38eac1f\"}");

            var claims = tm.ExtractClaims(tokenResponse, claimsPrincipal);

            Assert.IsNotNull(claims);
            Assert.AreEqual(3, claims.Count());
            Assert.AreEqual("a08cee40-3113-4092-b7a9-a38902f6e4f2", claims.Single(c => c.Type == "access_token").Value);
            Assert.AreEqual("a051ec5f-be15-40b0-9540-210511d892b2", claims.Single(c => c.Type == "refresh_token").Value);
            Assert.IsNotNull(claims.Single(c => c.Type == "expires_at").Value);
        }
    }
}
