using System;
using Newtonsoft.Json;

namespace HMPPS.NomisApiService.Models
{
    public class Establishment
    {
        [JsonProperty]
        public String Code { get; set; }
        [JsonProperty]
        public String Desc { get; set; }
    }

    internal class EstablishmentResponse
    {
        [JsonProperty]
        internal Establishment Establishment { get; set; }
    }
}
