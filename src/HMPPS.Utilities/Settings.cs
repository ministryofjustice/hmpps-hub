using System.Configuration;

namespace HMPPS.Utilities
{
    public static class Settings
    {
 
        public static string JwtTokenSecurityKey => ConfigurationManager.AppSettings["HMPPS.Utilities.JwtTokenSecurityKey"];

        public static string UserDataCookieName => ConfigurationManager.AppSettings["HMPPS.Utilities.UserDataCookieName"];

        public static string UserDataCookieKey => ConfigurationManager.AppSettings["HMPPS.Utilities.UserDataCookieKey"];

        public static int DefaultDotNetCacheTime => GetIntSetting(ConfigurationManager.AppSettings["HMPPS.Utilities.DefaultDotNetCacheTime"], 300);

        public static int RadioEpisodesCacheTime => GetIntSetting(ConfigurationManager.AppSettings["HMPPS.Utilities.RadioEpisodesCacheTime"], 300);

        private static int GetIntSetting(string value, int defaultValue)
        {
            int intValue = 0;
            if (int.TryParse(value, out intValue))
                return intValue;
            return defaultValue;
        }

    }
}
