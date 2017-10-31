using System.Configuration;

namespace HMPPS.Utilities
{
    public static class Settings
    {
 
        public static string JwtTokenSecurityKey => ConfigurationManager.AppSettings["HMPPS.Utilities.JwtTokenSecurityKey"];

        public static string UserDataCookieName => ConfigurationManager.AppSettings["HMPPS.Utilities.UserDataCookieName"];

        public static string UserDataCookieKey => ConfigurationManager.AppSettings["HMPPS.Utilities.UserDataCookieKey"];

    }
}
