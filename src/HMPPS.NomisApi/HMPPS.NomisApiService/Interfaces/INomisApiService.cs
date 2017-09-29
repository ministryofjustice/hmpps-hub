namespace HMPPS.NomisApiService.Interfaces
{
    public interface INomisApiService
    {
        Establishment GetPrisonerLocationDetails(string prisonerId);
    }
}
