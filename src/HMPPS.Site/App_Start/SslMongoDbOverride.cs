using System.Security.Authentication;
using MongoDB.Driver;
using Sitecore.Analytics.Pipelines.UpdateMongoDriverSettings;


namespace HMPPS
{
    public class SslMongoDbOverride: UpdateMongoDriverSettingsProcessor
    {
        public override void UpdateSettings(UpdateMongoDriverSettingsArgs args)
        {
            args.MongoSettings.UseSsl = true;
            args.MongoSettings.VerifySslCertificate = false;
            args.MongoSettings.SslSettings = new SslSettings();
            args.MongoSettings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;
        }
    }
}
