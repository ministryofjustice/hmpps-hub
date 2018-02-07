using System.Collections.Generic;
using System.Security.Claims;
using System.Web;
using HMPPS.Utilities.Models;

namespace HMPPS.Utilities.Interfaces
{
    public interface IUserDataService
    {
        void SaveUserIdamDataToCookie(IEnumerable<Claim> claims, HttpContext context);
        UserIdamData GetUserIdamDataFromCookie(HttpContext context);
        void DeleteUserIdamDataCookie(HttpContext context);

        UserAccountBalances GetAccountBalancesFromSession(HttpContext context);
        void SaveAccountBalancesToSession(HttpContext context, UserAccountBalances balances);
        void DeleteAccountBalancesFromSession(HttpContext context);
    }
}
