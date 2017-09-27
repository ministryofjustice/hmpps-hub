namespace HMPPS.Authentication.Interfaces
{
    public interface INomisApiService
    {
        Establishment GetPrisonerLocationDetails(string prisonerId);
    }
}
