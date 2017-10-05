using System;
using Newtonsoft.Json;

namespace HMPPS.NomisApiService.Models
{
    public class AccountsResponse
    {
        [JsonProperty]
        public int Spends { get; set; }
        [JsonProperty]
        public int Cash { get; set; }
        [JsonProperty]
        public int Savings { get; set; }
    }
}
