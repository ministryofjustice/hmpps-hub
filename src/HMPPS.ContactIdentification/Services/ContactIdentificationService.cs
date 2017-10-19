using System;
using System.Linq;
using Sitecore.Analytics;
using Sitecore.Analytics.Model;
using Sitecore.Security.Accounts;
using Sitecore.Analytics.Model.Entities;
using HMPPS.ContactIdentification.Interfaces;

namespace HMPPS.ContactIdentification.Services
{
    public class ContactIdentificationService : IContactIdentificationService
    {

        public void IdentifyTrackerContact()
        {
            var contactId = Tracker.Current?.Contact?.Identifiers?.Identifier;
            if (string.IsNullOrEmpty(contactId) || contactId != Sitecore.Context.User.LocalName)
            {
                Tracker.Initialize();
                Tracker.Current.Contact.Identifiers.AuthenticationLevel = AuthenticationLevel.PasswordValidated;
                Tracker.Current.Session.Identify(Sitecore.Context.User.LocalName);
                SetContactFacets(Sitecore.Context.User);
            }
        }

        private void SetContactFacets(User user)
        {
            IContactPersonalInfo personalFacet = Tracker.Current.Contact.GetFacet<IContactPersonalInfo>("Personal");
            personalFacet.FirstName = GetFirstName(user.Profile.FullName);
            personalFacet.Surname = GetSurName(user.Profile.FullName);
            IContactEmailAddresses addressesFacet = Tracker.Current.Contact.GetFacet<IContactEmailAddresses>("Emails");
            IEmailAddress address;
            if (!addressesFacet.Entries.Contains("work_email"))
            {
                address = addressesFacet.Entries.Create("work_email");
                address.SmtpAddress = user.Profile.Email;
                addressesFacet.Preferred = "work_email";
            }
        }
        private static string GetFirstName(string fullname)
        {
            if (fullname.Contains(' '))
                return fullname.Substring(0, fullname.IndexOf(" "));
            return fullname;
        }
        private static string GetSurName(string fullname)
        {
            if (fullname.Contains(' '))
                return fullname.Substring(fullname.IndexOf(" ") + 1);
            return String.Empty;
        }
    }
}
