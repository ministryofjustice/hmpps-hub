using HMPPS.ErrorReporting;
using HMPPS.HealthCheck.Services;
using HMPPS.MediaLibrary.AzureStorage;
using HMPPS.NomisApiService.Interfaces;
using StackExchange.Redis;
using System;
using System.Net;
using System.Net.Http;
using System.Reflection;

namespace HMPPS.HealthCheck.Extended
{
    public class ExtendedHealthCheckService : BaseHealthCheckService
    {
        private readonly INomisApiService _nomisApiService;
        private readonly HealthCheckConfig _config;

        public ExtendedHealthCheckService(ILogManager logManager, HealthCheckConfig config, INomisApiService nomisApiService)
            : base(logManager)
        {
            _nomisApiService = nomisApiService;
            _config = config;
        }

        public HealthCheckFacet Nomis()
        {
            var versionDetails = _nomisApiService.GetVersion();

            return new HealthCheckFacet
            {
                Name = "Nomis API",
                Healthy = !string.IsNullOrEmpty(versionDetails)
            };
        }

        public HealthCheckFacet Idam()
        {
            using (var client = new HttpClient())
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                var response = client.GetAsync(_config.IdamHealthCheckUrl).Result;

                return new HealthCheckFacet
                {
                    Name = "IDAM",
                    Healthy = response.StatusCode == HttpStatusCode.OK
                };
            }
        }

        public HealthCheckFacet Redis()
        {
            var checkResult = new HealthCheckFacet
            {
                Name = "Redis",
                Healthy = true
            };

            var redisConnection = new Lazy<ConnectionMultiplexer>(() =>
                ConnectionMultiplexer.Connect(_config.RedisDbConnectionString));

            var redisDb = redisConnection.Value.GetDatabase();

            return checkResult;
        }

        public HealthCheckFacet BlobStorage()
        {
            var azureBlobProvider = new AzureStorageProvider("blobs", string.Empty);

            return new HealthCheckFacet
            {
                Name = "BlobStorage",
                Healthy = azureBlobProvider.CanConnect(),
            };
        }

        protected override MethodInfo GetHealthCheckMethod(string checkName)
        {
            return GetType().GetMethod(checkName);
        }
    }
}
