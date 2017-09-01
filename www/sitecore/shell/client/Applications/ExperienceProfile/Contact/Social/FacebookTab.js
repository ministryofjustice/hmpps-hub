define(["sitecore", "/-/speak/v1/experienceprofile/CintelUtl.js", "./SocialUtil.js"], function (sc, cintelUtil, socialUtil) {
  var app = sc.Definitions.App.extend({

    initialized: function () {
      var contactId = cintelUtil.getQueryParam("cid");

      var facebookDataService = socialUtil.getEntityService("/sitecore/api/ssc/sitecore-social-experienceprofile-client-controllers/facebookdata");
      var that = this;
      facebookDataService.fetchEntity(contactId).execute().then(function(facebookData) {

        that.NoFacebookDataPanel.set("isVisible", false);
        that.FacebookInformationPanel.set("isVisible", true);
        cintelUtil.setText(that.FacebookUpdatedTimeValue, facebookData.UpdatedTime, false);
        cintelUtil.setText(that.FacebookFirstNameValue, facebookData.FirstName, false);
        cintelUtil.setText(that.FacebookMiddleNameValue, facebookData.MiddleName, false);
        cintelUtil.setText(that.FacebookLastNameValue, facebookData.LastName, false);
        cintelUtil.setText(that.FacebookGenderValue, facebookData.Gender, false);
        cintelUtil.setText(that.FacebookDayOfBirthValue, facebookData.DayOfBirth, false);
        cintelUtil.setText(that.FacebookRelationshipStatusValue, facebookData.RelationshipStatus, false);
        cintelUtil.setText(that.FacebookLocationValue, facebookData.Location, false);
        cintelUtil.setText(that.FacebookWebsiteValue, facebookData.Website, false);
        cintelUtil.setText(that.FacebookLinkValue, facebookData.LinkText, false);
        that.FacebookLinkValue.set("navigateUrl", facebookData.LinkUrl);
        cintelUtil.setText(that.FacebookLanguagesValue, facebookData.Languages, false);
        cintelUtil.setText(that.FacebookEducationValue, facebookData.Education, false);
        cintelUtil.setText(that.FacebookCompaniesValue, facebookData.Companies, false);
        cintelUtil.setText(that.FacebookPoliticalValue, facebookData.Political, false);
        cintelUtil.setText(that.FacebookReligionValue, facebookData.Religion, false);
        cintelUtil.setText(that.FacebookLikesValue, facebookData.Likes, false);

      }).fail(function (error) {

        that.NoFacebookDataPanel.set("isVisible", true);
        that.FacebookInformationPanel.set("isVisible", false);

      });
      
    }
    
  });
  
  return app;
});

