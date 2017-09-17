using System.Collections.Generic;
using System.Security.Claims;

namespace HMPPS.Authentication.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateJwtToken(IEnumerable<Claim> claims);

        IEnumerable<Claim> GetClaimsFromJwtToken(string tokenString);
    }
}
