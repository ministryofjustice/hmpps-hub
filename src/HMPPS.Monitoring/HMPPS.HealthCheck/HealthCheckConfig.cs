namespace HMPPS.HealthCheck
{
    public class HealthCheckConfig
    {
        public string MongoDbConnectionString { get; set; }
        public string RedisDbConnectionString { get; set; }
        public string IdamHealthCheckUrl { get; set; }
    }
}
