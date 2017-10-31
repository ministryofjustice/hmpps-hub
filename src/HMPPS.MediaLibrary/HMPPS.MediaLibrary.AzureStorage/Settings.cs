using System.Configuration;

namespace HMPPS.MediaLibrary.AzureStorage
{
    public static class Settings
    {
        public static string AccountName => ConfigurationManager.AppSettings["HMPPS.MediaLibrary.AzureStorage.AccountName"];

        public static string AccountKey => ConfigurationManager.AppSettings["HMPPS.MediaLibrary.AzureStorage.AccountKey"];

    }
}
