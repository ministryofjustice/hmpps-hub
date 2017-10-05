using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;

namespace HMPPS.Utilities.Models
{
    public class UserData
    {
        public string NameIdentifier { get; private set; }
        public IList<string> Roles { get; private set; }
        public string GivenName { get; private set; }
        public string Surname { get; private set; }
        public string Email { get; private set; }
        public string Name { get; private set; }
        public string AccessToken { get; private set; }
        public string RefreshToken { get; private set; }
        public string ExpiresAt { get; private set; }
        public string PrisonId { get; private set; }
        public string PrisonName { get; private set; }
        public decimal AccountBalance { get; private set; }
        public DateTime AccountBalanceLastUpdated { get; private set; }

        public UserData(IEnumerable<Claim> claims)
        {
            NameIdentifier = (claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier))?.Value;
            Roles = claims.Where(c => c.Type.Equals(ClaimTypes.Role)).Select(c => c.Value).ToList();
            GivenName = (claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName))?.Value;
            Surname = (claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname))?.Value;
            Email = (claims.FirstOrDefault(c => c.Type == ClaimTypes.Email))?.Value;
            Name = (claims.FirstOrDefault(c => c.Type == "name"))?.Value;
            AccessToken = (claims.FirstOrDefault(c => c.Type == "access_token"))?.Value;
            RefreshToken = (claims.FirstOrDefault(c => c.Type == "refresh_token"))?.Value;
            ExpiresAt = (claims.FirstOrDefault(c => c.Type == "expires_at"))?.Value;
            PrisonId = (claims.FirstOrDefault(c => c.Type == "prison_id"))?.Value;
            PrisonName = (claims.FirstOrDefault(c => c.Type == "prison_name"))?.Value;
            AccountBalance = ParseToDecimal((claims.FirstOrDefault(c => c.Type == "account_balance"))?.Value);
            AccountBalanceLastUpdated = ParseToUkDateTime((claims.FirstOrDefault(c => c.Type == "account_balance_lastupdated"))?.Value);
        }

        private static decimal ParseToDecimal(string value)
        {
            decimal retval = 0;
            if (decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture.NumberFormat, out retval))
                return retval;
            return (decimal)0;
        }

        private static DateTime ParseToUkDateTime(string value)
        {
            DateTime utcDateTime;
            if (DateTime.TryParse(value, out utcDateTime))
            {
                DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

                TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time");
                TimeSpan offset = tzi.GetUtcOffset(DateTime.Now);
                DateTime britishDateTime = utcDateTime.Add(offset);
                return britishDateTime;
            }
            return DateTime.MinValue;
        }
    }
}
