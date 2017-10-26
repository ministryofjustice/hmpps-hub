using HMPPS.MediaLibrary.CloudStorage.Constants;
using Sitecore;
using SC = Sitecore.Configuration;

namespace HMPPS.MediaLibrary.CloudStorage.Configuration
{
    public class Settings
    {
        public static string CloudMediaUrl => StringUtil.EnsurePostfix('/', SC.Settings.GetSetting(ConfigSettings.MediaLinkCdnServerUrl));

        public static string MediaThumbnailCacheFolder => StringUtil.EnsurePostfix('/', SC.Settings.GetSetting(ConfigSettings.MediaThumbnailCacheFolder, "/App_Data/MediaThumbnailCache"));

        public static bool AlwaysIncludeCdnServerUrl => SC.Settings.GetBoolSetting(ConfigSettings.AlwaysIncludeCdnServerUrl, false);
    }
}
