using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;

namespace HMPPS.Utilities.Models
{
    public class UserData
    {
        public string NameIdentifier { get; }
        public IList<string> Roles { get; }
        public string GivenName { get; }
        public string Surname { get;  }
        public string Email { get;  }
        public string Name { get;  }
        public string AccessToken { get;  }
        public string RefreshToken { get;  }
        public string ExpiresAt { get; }
        public string PrisonId { get;  }
        public bool AreAccountBalancesAvailable { get; }
        public decimal AccountSpends { get;  }
        public decimal AccountPrivateCash { get; }
        public decimal AccountSavings { get; }
        public DateTime AccountsLastUpdated { get; }

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
            PrisonId = (claims.FirstOrDefault(c => c.Type == "pnomisLocation"))?.Value;

            var accountSpendsValue = claims.FirstOrDefault(c => c.Type == "account_spends")?.Value;
            var accountCashValue = claims.FirstOrDefault(c => c.Type == "account_cash")?.Value;
            var accountSavingsValue = claims.FirstOrDefault(c => c.Type == "account_savings")?.Value;
            AreAccountBalancesAvailable = accountSpendsValue != null && accountCashValue != null && accountSavingsValue != null;
            if (AreAccountBalancesAvailable)
            {
                AccountSpends = ParseToDecimal(accountSpendsValue);
                AccountPrivateCash = ParseToDecimal(accountCashValue);
                AccountSavings = ParseToDecimal(accountSavingsValue);
                AccountsLastUpdated =
                    ParseToUkDateTime((claims.FirstOrDefault(c => c.Type == "accounts_lastupdated"))?.Value);
            }
        }

        private static decimal ParseToDecimal(string value)
        {
            if (decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture.NumberFormat, out var retval))
                return retval;
            return 0;
        }

        private static DateTime ParseToUkDateTime(string dateString)
        {
            var culture = CultureInfo.CreateSpecificCulture("en-US");
            if (DateTime.TryParse(dateString, culture, DateTimeStyles.AssumeUniversal, out var utcDateTime))
            {
                DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

                var tzi = TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time");
                var offset = tzi.GetUtcOffset(DateTime.Now);
                var britishDateTime = utcDateTime.Add(offset);
                return britishDateTime;
            }
            return DateTime.MinValue;
        }
    }
}
