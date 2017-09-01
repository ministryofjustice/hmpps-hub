define(["sitecore", "/-/speak/v1/experienceprofile/CintelUtl.js", "./SocialUtil.js"], function (sc, cintelUtil, socialUtil) {
  var app = sc.Definitions.App.extend({
    
    initialized: function()
    {
      var contactId = cintelUtil.getQueryParam("cid");

      var linkedInDataService = socialUtil.getEntityService("/sitecore/api/ssc/sitecore-social-experienceprofile-client-controllers/linkedindata");
      var that = this;
      linkedInDataService.fetchEntity(contactId).execute().then(function (linkedInData) {

        that.NoLinkedInDataPanel.set("isVisible", false);
        that.LinkedInInformationPanel.set("isVisible", true);
        cintelUtil.setText(that.LinkedInFirstNameValue, linkedInData.FirstName, false);
        cintelUtil.setText(that.LinkedInLastNameValue, linkedInData.LastName, false);
        cintelUtil.setText(that.LinkedInLocationValue, linkedInData.Location, false);
        cintelUtil.setText(that.LinkedInMainAddressValue, linkedInData.MainAddress, false);
        cintelUtil.setText(that.LinkedInPhoneNumberValue, linkedInData.PhoneNumber, false);
        cintelUtil.setText(that.LinkedInDayOfBirthValue, linkedInData.DayOfBirth, false);
        cintelUtil.setText(that.LinkedInTwitterAccountsValue, linkedInData.TwitterAccounts, false);
        cintelUtil.setText(that.LinkedInIMAccountsValue, linkedInData.ImAccounts, false);
        cintelUtil.setText(that.LinkedInIndustryValue, linkedInData.Industry, false);
        cintelUtil.setText(that.LinkedInNumberOfConnectionsValue, linkedInData.NumberOfConnections, false);
        cintelUtil.setText(that.LinkedInEducationValue, linkedInData.Education, false);
        cintelUtil.setText(that.LinkedInPositionValue, linkedInData.Position, false);
        cintelUtil.setText(that.LinkedInCurrentPositionsValue, linkedInData.CurrentPositions, false);
        cintelUtil.setText(that.LinkedInPastPositionsValue, linkedInData.PastPositions, false);

      }).fail(function (error) {

        that.NoLinkedInDataPanel.set("isVisible", true);
        that.LinkedInInformationPanel.set("isVisible", false);

      });

    }
    
  });
  
  return app;
});