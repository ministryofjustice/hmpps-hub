namespace HMPPS.NomisApiService
{
    public static class Settings
    {

        public static string NomisApiBaseUrl => Sitecore.Configuration.Settings.GetSetting("HMPPS.NomisApiService.BaseUrl");

        public static string NomisApiClientToken => Sitecore.Configuration.Settings.GetSetting("HMPPS.NomisApiService.ClientToken");

        public static string NomisApiSecretKey => Sitecore.Configuration.Settings.GetSetting("HMPPS.NomisApiService.SecretKey");

    }
}
