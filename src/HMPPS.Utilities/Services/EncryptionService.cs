using System;
using System.Web;
using Sitecore.SecurityModel.Cryptography;
using HMPPS.Utilities.Interfaces;
using HMPPS.ErrorReporting;

namespace HMPPS.Utilities.Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly ILogManager _logManager;

        public EncryptionService(ILogManager logManager)
        {
            _logManager = logManager;
        }

        public string Encode(string plainValue, bool urlEncode = false)
        {
            var encodedValue = string.Empty;

            try
            {
                encodedValue = MachineKeyEncryption.Encode(plainValue);
            }
            catch
            {
                _logManager.LogError($"Error trying to encode {plainValue}", GetType());
                return encodedValue;
            }

            if (urlEncode)
            {
                return HttpUtility.UrlEncode(encodedValue);
            }

            return encodedValue;
        }

        public string Decode(string encodedValue, bool urlDecode = false)
        {
            if (urlDecode)
            {
                encodedValue = HttpUtility.UrlDecode(encodedValue);
            }

            try
            {
                return MachineKeyEncryption.Decode(encodedValue);
            }
            catch (Exception)
            {
                _logManager.LogError($"Error trying to decode {encodedValue}", GetType());
                return null;
            }
        }
    }
}
