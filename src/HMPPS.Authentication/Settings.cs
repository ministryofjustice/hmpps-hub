using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMPPS.Authentication
{
    public static class Settings
    {
        public static string SignInCallbackUrl => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.SignInCallbackUrl");

        public static string TempCookieName => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.TempCookieName", "TempCookie");

        public static string Scope => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.Scope", "openid profile roles all_claims");

        public static string ClientId => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.ClientId");

        public static string ClientSecret => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.ClientSecret");

        public static string ValidIssuer => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.ValidIssuer");

        public static string AuthorizeEndpoint => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.AuthorizeEndpoint");

        public static string TokenEndpoint => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.TokenEndpoint");

        public static string LogoutEndpoint => Sitecore.Configuration.Settings.GetSetting("HMPPS.Authentication.LogoutEndpoint");
    }
}
