namespace HMPPS.Utilities
{
    public static class Settings
    {
 
        public static string JwtTokenSecurityKey => Sitecore.Configuration.Settings.GetSetting("HMPPS.Utilities.JwtTokenSecurityKey");

        public static string UserDataCookieName => Sitecore.Configuration.Settings.GetSetting("HMPPS.Utilities.UserDataCookieName");

        public static string UserDataCookieKey => Sitecore.Configuration.Settings.GetSetting("HMPPS.Utilities.UserDataCookieKey");

    }
}
