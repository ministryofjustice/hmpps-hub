using Sitecore.Analytics;
using Sitecore.Analytics.Model;
using Sitecore.Security.Accounts;
using Sitecore.Analytics.Model.Entities;
using HMPPS.ContactIdentification.Interfaces;
using System;
using HMPPS.ErrorReporting;

namespace HMPPS.ContactIdentification.Services
{
    public class ContactIdentificationService : IContactIdentificationService
    {
        private IErrorManager _errorManager;
        public ContactIdentificationService(IErrorManager errorManager)
        {
            _errorManager = errorManager;
        }
        public void IdentifyTrackerContact()
        {
            var contactId = Tracker.Current?.Contact?.Identifiers?.Identifier;
            if (string.IsNullOrEmpty(contactId) || contactId != Sitecore.Context.User.LocalName)
            {
                try
                {
                    Tracker.Initialize();
                    Tracker.Current.Contact.Identifiers.AuthenticationLevel = AuthenticationLevel.PasswordValidated;
                    Tracker.Current.Session.Identify(Sitecore.Context.User.LocalName);
                    SetContactFacets(Sitecore.Context.User);
                }
                catch (Exception e)
                {
                    _errorManager.LogError("HMPPS.ContactIdentification.Services.ContactIdentificationService - Error in IdentifyTrackerContact()", e, typeof(ContactIdentificationService));
                }
            }
        }

        private void SetContactFacets(User user)
        {
            IContactPersonalInfo personalFacet = Tracker.Current.Contact.GetFacet<IContactPersonalInfo>("Personal");
            personalFacet.FirstName = string.Empty;
            personalFacet.Surname = user.LocalName;
        }
    }
}
