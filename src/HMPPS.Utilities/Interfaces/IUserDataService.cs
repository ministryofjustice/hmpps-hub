using System.Collections.Generic;
using System.Security.Claims;
using System.Web;
using HMPPS.Utilities.Models;

namespace HMPPS.Utilities.Interfaces
{
    public interface IUserDataService
    {
        void SaveUserDataToCookie(IEnumerable<Claim> claims, HttpContext context);

        UserData GetUserDataFromCookie(HttpContext context);

        void DeleteUserDataCookie(HttpContext context);
    }
}
