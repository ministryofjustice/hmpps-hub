using System.Configuration;

namespace HMPPS.NomisApiService
{
    public static class Settings
    {
        public static string NomisApiBaseUrl => ConfigurationManager.AppSettings["HMPPS.NomisApiService.BaseUrl"];

        public static string NomisApiClientToken => ConfigurationManager.AppSettings["HMPPS.NomisApiService.ClientToken"];

        public static string NomisApiSecretKey => ConfigurationManager.AppSettings["HMPPS.NomisApiService.SecretKey"];

    }
}
