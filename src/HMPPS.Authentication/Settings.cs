using System.Configuration;

namespace HMPPS.Authentication
{
    public static class Settings
    {
        public static string SignInCallbackUrl => ConfigurationManager.AppSettings["HMPPS.Authentication.SignInCallbackUrl"];

        public static string LogoutUrl => ConfigurationManager.AppSettings["HMPPS.Authentication.LogoutUrl"];

        public static string TempCookieName => ConfigurationManager.AppSettings["HMPPS.Authentication.TempCookieName"];

        public static string Scope => ConfigurationManager.AppSettings["HMPPS.Authentication.Scope"];

        public static string ClientId => ConfigurationManager.AppSettings["HMPPS.Authentication.ClientId"];

        public static string ClientSecret => ConfigurationManager.AppSettings["HMPPS.Authentication.ClientSecret"];

        public static string ValidIssuer => ConfigurationManager.AppSettings["HMPPS.Authentication.ValidIssuer"];

        public static string AuthorizeEndpoint => ConfigurationManager.AppSettings["HMPPS.Authentication.AuthorizeEndpoint"];

        public static string TokenEndpoint => ConfigurationManager.AppSettings["HMPPS.Authentication.TokenEndpoint"];

        public static string LogoutEndpoint => ConfigurationManager.AppSettings["HMPPS.Authentication.LogoutEndpoint"];

    }
}
