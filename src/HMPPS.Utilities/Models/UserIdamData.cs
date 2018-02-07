using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace HMPPS.Utilities.Models
{
    /// <summary>
    /// Stores the user claims IDAM returns post SSO login
    /// </summary>
    public class UserIdamData
    {
        /// <summary>
        /// Prisoner ID
        /// </summary>
        public string NameIdentifier { get; }
        /// <summary>
        /// First name
        /// </summary>
        public string GivenName { get; }
        public string AccessToken { get;  }
        public string RefreshToken { get;  }
        public string ExpiresAt { get; }
        public string PrisonId { get;  }
      

        public UserIdamData(IEnumerable<Claim> claims)
        {
            if (claims == null) return;
            NameIdentifier = (claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier))?.Value;
            GivenName = (claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName))?.Value;
            AccessToken = (claims.FirstOrDefault(c => c.Type == "access_token"))?.Value;
            RefreshToken = (claims.FirstOrDefault(c => c.Type == "refresh_token"))?.Value;
            ExpiresAt = (claims.FirstOrDefault(c => c.Type == "expires_at"))?.Value;
            PrisonId = (claims.FirstOrDefault(c => c.Type == "pnomisLocation"))?.Value;
        }
    }  
}
