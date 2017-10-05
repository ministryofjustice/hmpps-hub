using System.Collections.Generic;
using System.Security.Claims;

namespace HMPPS.Utilities.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateJwtToken(IEnumerable<Claim> claims, string jwtTokenSecurityKey);

        IEnumerable<Claim> GetClaimsFromJwtToken(string tokenString, string jwtTokenSecurityKey);
    }
}
