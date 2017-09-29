namespace HMPPS.NomisApiService.Interfaces
{
    public interface INomisApiService
    {
        Models.Establishment GetPrisonerLocationDetails(string prisonerId);

        Models.Accounts GetPrisonerAccounts(string prisonId, string prisonerId);
    }
}
