namespace HMPPS.NomisApiService.Interfaces
{
    public interface INomisApiService
    {
        Models.Accounts GetPrisonerAccounts(string prisonId, string prisonerId);
    }
}
