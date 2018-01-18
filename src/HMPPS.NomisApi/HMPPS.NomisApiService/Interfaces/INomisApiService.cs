namespace HMPPS.NomisApiService.Interfaces
{
    public interface INomisApiService
    {
        string GetVersion();

        Models.Accounts GetPrisonerAccounts(string prisonId, string prisonerId);
    }
}
