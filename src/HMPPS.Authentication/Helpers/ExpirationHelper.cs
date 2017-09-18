using System;
using IdentityModel;

namespace HMPPS.Authentication.Helpers
{
    public static class ExpirationHelper
    {

        public static DateTime GetExpirationTime(long expirySeconds)
        {
           return (DateTime.UtcNow.ToEpochTime() + expirySeconds).ToDateTimeFromEpoch();
        }

        public static string GetExpirationTimeString(long expirySeconds)
        {
            return GetExpirationTime(expirySeconds).ToString();
        }

        public static bool IsExpired(string expiryDateTime)
        {
            DateTime expiration;

            if (DateTime.TryParse(expiryDateTime, out expiration))
            {
                return expiration <= DateTime.UtcNow;
            }
            return true;
        }
    }
}
