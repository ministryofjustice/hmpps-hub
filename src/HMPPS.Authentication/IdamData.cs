using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace HMPPS.Authentication
{
    public class IdamData
    {
        public string NameIdentifier { get; private set; }
        public IList<string> Roles { get; private set; }
        public string GivenName { get; private set; }
        public string Surname { get; private set; }
        public string Email { get; private set; }
        public string Name { get; private set; }
        public string AccessToken { get; private set; }
        public string RefreshToken { get; private set; }
        public string ExpiresAt { get; private set; }

        public IdamData(IEnumerable<Claim> claims)
        {

            NameIdentifier = (claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier))?.Value;
            Roles = claims.Where(c => c.Type.Equals(ClaimTypes.Role)).Select(c => c.Value).ToList();
            GivenName = (claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName))?.Value;
            Surname = (claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname))?.Value;
            Email = (claims.FirstOrDefault(c => c.Type == ClaimTypes.Email))?.Value;
            Name = (claims.FirstOrDefault(c => c.Type == "name"))?.Value;
            AccessToken = (claims.FirstOrDefault(c => c.Type == "access_token"))?.Value;
            RefreshToken = (claims.FirstOrDefault(c => c.Type == "refresh_token"))?.Value;
            ExpiresAt = (claims.FirstOrDefault(c => c.Type == "expires_at"))?.Value;
        }
    }
}
