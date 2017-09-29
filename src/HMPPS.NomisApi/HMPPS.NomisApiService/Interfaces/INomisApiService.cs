namespace HMPPS.NomisApiService.Interfaces
{
    public interface INomisApiService
    {
        Models.Establishment GetPrisonerLocationDetails(string prisonerId);
    }
}
