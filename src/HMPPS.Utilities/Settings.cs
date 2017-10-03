namespace HMPPS.Utilities
{
    public static class Settings
    {
 
        public static string JwtTokenSecurityKey => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.JwtTokenSecurityKey");

        public static string UserDataCookieName => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.AuthenticationChecker.CookieName");

        public static string UserDataCookieKey => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.AuthenticationChecker.CookieKey");

    }
}
