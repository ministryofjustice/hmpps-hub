using HMPPS.ContactIdentification.Interfaces;
using Sitecore.Pipelines;

namespace HMPPS.ContactIdentification.Pipelines
{
    public class IdentifyContact
    {
        private readonly IContactIdentificationService _contactIdentificationService;

        public IdentifyContact(IContactIdentificationService contactIdentificationService)
        {
            _contactIdentificationService = contactIdentificationService;
        }

        public void Process(PipelineArgs args)
        {
            _contactIdentificationService.IdentifyTrackerContact();
        }
    }
}
