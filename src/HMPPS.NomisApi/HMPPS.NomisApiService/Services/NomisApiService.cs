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
using HMPPS.NomisApiService.Models;
using HMPPS.ErrorReporting;

namespace HMPPS.NomisApiService.Services
{
    /// <summary>
    /// API docs: http://ministryofjustice.github.io/nomis-api/index.html
    /// </summary>
    public class NomisApiService : INomisApiService
    {
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

        static HttpClient Client = new HttpClient();

        private ILogManager _logManager;

        public NomisApiService(ILogManager logManager)
            : this(logManager, true)
        {
        }

        public NomisApiService(ILogManager logManager, bool useAppSettings)
        {
            _logManager = logManager;

            if (useAppSettings)
            {
                ApiBaseUrl = Settings.NomisApiBaseUrl;
                ClientToken = Settings.NomisApiClientToken;
                SecretPkcs8 = Settings.NomisApiSecretKey;
            }
        }

        public void InitializeClient()
        {
            AuthenticationToken = GenerateToken();
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AuthenticationToken);
            Client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
        }

        public Establishment GetPrisonerLocationDetails(string prisonerId)
        {
            InitializeClient();
            Task<string> task = Task.Run<string>(async () => await GetPrisonerLocationDetailsAsync(prisonerId));
            try
            {
                var result = task.Result;
                var establishment = JsonConvert.DeserializeObject<EstablishmentResponse>(result).Establishment;
                return establishment;
            }
            catch (AggregateException aex)
            {
                var detailMessage = $"GetPrisonerLocationDetails({prisonerId})";
                aex.Handle(e => HandleInnerException(e, detailMessage));
                return null;
            }
        }

        public Accounts GetPrisonerAccounts(string prisonId, string prisonerId)
        {
            InitializeClient();
            Task<string> task = Task.Run<string>(async () => await GetPrisonerAccountsAsync(prisonId, prisonerId));
            try
            {
                var result = task.Result;
                var accountsResponse = JsonConvert.DeserializeObject<AccountsResponse>(result);
                return new Accounts(accountsResponse);
            }
            catch (AggregateException aex)
            {
                var detailMessage = $"GetPrisonerAccounts({prisonId}, {prisonerId})";
                aex.Handle(e => HandleInnerException(e, detailMessage));
                return null;
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

        /// <summary>
        /// Retrieve an offender’s financial account balances.
        /// Returns balances for the offender’s three sub accounts(Spends, Saves and Cash) for the specified prison.
        /// Amounts are in all cases represented as an integer number of pence.
        /// To get: /prison/{prison_id}/offenders/{noms_id}/accounts
        /// </summary>
        /// <param name="prisonId"></param>
        /// <param name="prisonerId"></param>
        /// <returns></returns>
        private async Task<string> GetPrisonerAccountsAsync(string prisonId, string prisonerId)
        {
            var url = $"{ApiBaseUrl}/prison/{prisonId}/offenders/{prisonerId}/accounts";
            return await Client.GetStringAsync(url);
        }

        private bool HandleInnerException(Exception e, string detailMessage)
        {
            _logManager.LogError($"Error trying to get prisoner's data from Nomis: {detailMessage}", GetType());
            return false; // exception is not handled
        }

    }
}
