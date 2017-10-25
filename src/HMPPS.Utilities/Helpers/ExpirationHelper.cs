using System;
using IdentityModel;

namespace HMPPS.Utilities.Helpers
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
            if (DateTime.TryParse(expiryDateTime, out var expiration))
            {
                return expiration <= DateTime.UtcNow;
            }
            return true;
        }
    }
}
