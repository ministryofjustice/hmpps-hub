using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HMPPS.Authentication
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
