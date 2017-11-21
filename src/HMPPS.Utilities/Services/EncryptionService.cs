using System;
using System.Web;
using Sitecore.SecurityModel.Cryptography;
using Sitecore.Diagnostics;
using HMPPS.Utilities.Interfaces;
using HMPPS.ErrorReporting;

namespace HMPPS.Utilities.Services
{
    public class EncryptionService : IEncryptionService
    {
        private ILogManager _logManager;

        public EncryptionService(ILogManager logManager)
        {
            _logManager = logManager;
        }

        public string Encrypt(string plainValue, bool urlEncode = false)
        {
            var encryptedValue = string.Empty;

            try
            {
                encryptedValue = MachineKeyEncryption.Encode(plainValue);
            }
            catch
            {
                _logManager.LogError($"HMPPS.Utilities.Services.EncryptionService - Error trying to encrypt {plainValue}", GetType());
                return encryptedValue;
            }

            if (urlEncode)
            {
                return HttpUtility.UrlEncode(encryptedValue);
            }

            return encryptedValue;
        }

        public string Decrypt(string encryptedValue, bool urlDecode = false)
        {
            if (urlDecode)
            {
                encryptedValue = HttpUtility.UrlDecode(encryptedValue);
            }

            try
            {
                return MachineKeyEncryption.Decode(encryptedValue);
            }
            catch (Exception)
            {
                Log.Error($"HMPPS.Utilities.Services.EncryptionService - Error trying to decrypt {encryptedValue}", this);
                return null;
            }
        }
    }
}
