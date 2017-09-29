using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Jose;
using Newtonsoft.Json;
using Sitecore.Diagnostics;
using HMPPS.NomisApiService.Interfaces;

namespace HMPPS.NomisApiService.Services
{
    /// <summary>
    /// API docs: http://ministryofjustice.github.io/nomis-api/index.html
    /// </summary>
    public class NomisApiService : INomisApiService
    {
        /// <summary>
        /// EC PRIVATE KEY - NOT USED BY CODE
        /// Use the below code to generate symmetric Secret Key
        ///     var hmac = new HMACSHA256();
        ///     var key = Convert.ToBase64String(hmac.Key);
        /// </summary>
        //private const string Secret =
        //    "MHcCAQEEILYQ31dncLlkX1Y07pzbTy0/5Xg31ZX9ShT/5d/e4TU6oAoGCCqGSM49AwEHoUQDQgAEaS61Nr0aTl4Q4WnNf/kpnjHYv8EuokFdQUYUAEC03CFQsjxJKsah2NXLDtsBz3b2saaPKtujp31h2S5U5rRh1A==";

        /// <summary>
        /// EC PRIVATE KEY converted to PKCS8 format using $ openssl pkcs8 -topk8 -nocrypt -in e3-nomis-api.key -out ec2.pem
        /// This is the key needed below
        /// </summary>
        public string SecretPkcs8 { get; set; }

        /// <summary>
        /// API token HMPPS provided I suppose
        /// </summary>
        public string ClientToken { get; set; }

        /// <summary>
        /// The URL of the API
        /// </summary>
        public string ApiBaseUrl { get; set; }

        private string AuthenticationToken { get; set; }
        private HttpClient Client { get; set; }

        public NomisApiService() : this(true)
        {
        }

        public NomisApiService(bool useSitecoreSettings)
        {
            if (useSitecoreSettings)
            {
                this.ApiBaseUrl = Settings.NomisApiBaseUrl;
                this.ClientToken = Settings.NomisApiClientToken;
                this.SecretPkcs8 = Settings.NomisApiSecretKey;
                InitializeClient();
            }
        }

        private string GenerateToken(int expireMinutes = 20)
        {
            //https://github.com/dvsekhvalnov/jose-jwt
            var unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            var payload = new Dictionary<string, object>()
            {
                {"iat", unixTimestamp},
                {"token", ClientToken}
            };
            var secretKeyFile = Convert.FromBase64String(SecretPkcs8);
            var secretKey = CngKey.Import(secretKeyFile, CngKeyBlobFormat.Pkcs8PrivateBlob);
            return JWT.Encode(payload, secretKey, JwsAlgorithm.ES256);
        }
        public void InitializeClient()
        {
            AuthenticationToken = GenerateToken(); //todo: when does this token expire?
            Client = new HttpClient();
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AuthenticationToken);
            Client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
        }
        /// <summary>
        /// Returns the version of the API running.
        /// /version{?show}
        /// </summary>
        /// <returns></returns>
        private async Task<string> GetApiVersionAsync()
        {
            return await Client.GetStringAsync(ApiBaseUrl + "/version");
        }
        /// <summary>
        /// Returns general offender information.
        /// /offenders/{noms_id}
        /// </summary>
        /// <param name="prisonerId"></param>
        /// <returns></returns>
        private async Task<string> GetPrisonerDetailsAsync(string prisonerId)
        {
            return await Client.GetStringAsync(ApiBaseUrl + "/offenders/" + prisonerId);
        }
        /// <summary>
        /// Since the offender’s location can change often and is fairly sensitive (and therefore should not automatically be exposed to all services), this information is not included in the general offender information call.
        /// /offenders/{noms_id}/location
        /// </summary>
        /// <param name="prisonerId"></param>
        /// <returns></returns>
        private async Task<string> GetPrisonerLocationDetailsAsync(string prisonerId)
        {
            return await Client.GetStringAsync(ApiBaseUrl + "/offenders/" + prisonerId + "/location");
        }

        public Establishment GetPrisonerLocationDetails(string prisonerId)
        {
            Task<string> task = Task.Run<string>(async () => await GetPrisonerLocationDetailsAsync(prisonerId));
            try
            {
                var result = task.Result;
                var establishment = JsonConvert.DeserializeObject<EstablishmentResponse>(result).Establishment;
                return establishment;
            }
            catch (AggregateException aex)
            {
                aex.Handle(e => HandleInnerException(e, prisonerId));
                return null;
            }
        }

        private bool HandleInnerException(Exception e, string prisonerId)
        {
            Log.Error(String.Format("HMPPS.Authentication.Services.NomisApiService - Error trying to get location of prisoner {0}", prisonerId), this);
            return false; // exception is not handled
        }

    }
}
