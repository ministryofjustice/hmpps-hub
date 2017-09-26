namespace HMPPS.Authentication.Interfaces
{
    public interface IEncryptionService
    {
        string Encrypt(string plainValue, bool urlEncode = false);

        string Decrypt(string encryptedValue, bool urlDecode = false);
    }
}
