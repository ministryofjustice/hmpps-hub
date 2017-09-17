using System;
using System.Web;
using Sitecore.SecurityModel.Cryptography;
using Sitecore.Diagnostics;
using HMPPS.Authentication.Interfaces;

namespace HMPPS.Authentication.Services
{
    public class EncryptionService : IEncryptionService
    {

        public string Encrypt(string plainValue, bool urlEncode = false)
        {
            string encryptedValue = string.Empty;

            try
            {
                encryptedValue = MachineKeyEncryption.Encode(plainValue);
            }
            catch (Exception e)
            {
                Log.Error(String.Format("HMPPS.Authentication.EncryptionService - Error trying to encrypt {0}", plainValue), this);
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
            catch (Exception e)
            {
                Log.Error(String.Format("HMPPS.Authentication.EncryptionService - Error trying to decrypt {0}", encryptedValue), this);
                return null;
            }
        }
    }
}
