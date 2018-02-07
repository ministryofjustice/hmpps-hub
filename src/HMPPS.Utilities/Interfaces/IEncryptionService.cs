namespace HMPPS.Utilities.Interfaces
{
    public interface IEncryptionService
    {
        string Encode(string plainValue, bool urlEncode = false);

        string Decode(string encryptedValue, bool urlDecode = false);
    }
}
