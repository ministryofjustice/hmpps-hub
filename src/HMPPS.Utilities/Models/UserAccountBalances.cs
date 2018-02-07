using System;
using System.Globalization;

namespace HMPPS.Utilities.Models
{
    [Serializable]
    public class UserAccountBalances
    {
        public UserAccountBalances(decimal spends, decimal savings, decimal cash, DateTime lastUpdated)
        {
            AreAccountBalancesAvailable = spends != decimal.MinusOne && cash != decimal.MinusOne && savings != decimal.MinusOne;
            if (AreAccountBalancesAvailable)
            {
                AccountSpends = spends;
                AccountPrivateCash = cash;
                AccountSavings = savings;
                AccountBalancesLastUpdated =
                    lastUpdated;
            }

             
        }
        public bool AreAccountBalancesAvailable { get; }
        public decimal AccountSpends { get; }
        public decimal AccountPrivateCash { get; }
        public decimal AccountSavings { get; }
        public DateTime AccountBalancesLastUpdated { get; }

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
