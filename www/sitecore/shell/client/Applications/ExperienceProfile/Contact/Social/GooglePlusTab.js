define(["sitecore", "/-/speak/v1/experienceprofile/CintelUtl.js", "./SocialUtil.js"], function (sc, cintelUtil, socialUtil) {
  var app = sc.Definitions.App.extend({
    
    isGooglePlusRecentActivityRendering: false,

    initialized: function () {
      
      var contactId = cintelUtil.getQueryParam("cid");

      var that = this;

      this.GooglePlusRecentActivityPanel.set("isOpen", false);
      this.GooglePlusRecentActivityPanel.on("change:isOpen", function () {
        that.GooglePlusRecentActivityProgressIndicator.set("isBusy", that.isGooglePlusRecentActivityRendering && that.GooglePlusRecentActivityPanel.get("isOpen"));
      });

      var googlePlusDataService = socialUtil.getEntityService("/sitecore/api/ssc/sitecore-social-experienceprofile-client-controllers/googleplusdata"); 
      googlePlusDataService.fetchEntity(contactId).execute().then(function (googlePlusData) {

        that.NoGooglePlusDataPanel.set("isVisible", false);
        that.GooglePlusInformationPanel.set("isVisible", true);
        cintelUtil.setText(that.GooglePlusScreenNameValue, googlePlusData.ScreenName, false);
        cintelUtil.setText(that.GooglePlusFirstNameValue, googlePlusData.FirstName, false);
        cintelUtil.setText(that.GooglePlusLastNameValue, googlePlusData.LastName, false);
        cintelUtil.setText(that.GooglePlusGenderValue, googlePlusData.Gender, false);
        cintelUtil.setText(that.GooglePlusRelationshipStatusValue, googlePlusData.RelationshipStatus, false);
        cintelUtil.setText(that.GooglePlusDayOfBirthValue, googlePlusData.DayOfBirth, false);
        cintelUtil.setText(that.GooglePlusLocationValue, googlePlusData.Location, false);
        cintelUtil.setText(that.GooglePlusPreviousLocationsValue, googlePlusData.PreviousLocations, false);
        cintelUtil.setText(that.GooglePlusLinkValue, googlePlusData.LinkText, false);
        that.GooglePlusLinkValue.set("navigateUrl", googlePlusData.LinkUrl);
        cintelUtil.setText(that.GooglePlusCompaniesValue, googlePlusData.Companies, false);
        cintelUtil.setText(that.GooglePlusEducationValue, googlePlusData.Education, false);
        cintelUtil.setText(that.GooglePlusCircledByValue, googlePlusData.CircledBy, false);

        that.GooglePlusRecentActivityPanel.set("isVisible", true);
        that.GooglePlusRecentActivityBorder.set("isVisible", true);
        that.NoGooglePlusRecentActivityBorder.set("isVisible", false);

        that.isGooglePlusRecentActivityRendering = true;

        var googlePlusRecentActivityService = socialUtil.getEntityService("/sitecore/api/ssc/sitecore-social-experienceprofile-client-controllers/googleplusrecentactivity");
        googlePlusRecentActivityService.fetchEntity(contactId).execute().then(function (googlePlusRecentActivity) {

          var postsHtml = "<div style='overflow: hidden;'>";

          googlePlusRecentActivity.PublicPostsUrls.forEach(function(publicPostUrl) {
            postsHtml += "<div style='float: left; width: 450px; min-height: 250px;'><div class='g-post' data-href='" + publicPostUrl + "'></div></div>";
          });

          postsHtml += "</div>";
          postsHtml += "<script type=\"text/javascript\" src=\"https://apis.google.com/js/plusone.js\">{\"parsetags\": \"onload\"}</script>";

          that.GooglePlusRecentActivityBorder.viewModel.$el.append(postsHtml);

          // HACK: override style from Contact.css:
          // code, iframe, .scLoadingIndication {  /* should be delete after fixing itemWebApi problem about page editor */
          //   display: none !important;
          // }
          setTimeout(function () {
            that.GooglePlusRecentActivityBorder.viewModel.$el.find("iframe").each(function () {
              var iframe = $(this);
              iframe.attr("style", iframe.attr("style") + "; display: inline !important; width: 440px;");
            });

            that.GooglePlusRecentActivityProgressIndicator.set("isBusy", false);
          }, 3000);
          // ENDHACK

          that.GooglePlusRecentActivityProgressIndicator.set("isBusy", false);

          that.isGooglePlusRecentActivityRendering = false;

        }).fail(function (error) {

          that.GooglePlusRecentActivityProgressIndicator.set("isBusy", false);
          that.GooglePlusRecentActivityBorder.set("isVisible", false);
          that.NoGooglePlusRecentActivityBorder.set("isVisible", true);

          that.isGooglePlusRecentActivityRendering = false;

        });

      }).fail(function (error) {

        that.NoGooglePlusDataPanel.set("isVisible", true);
        that.GooglePlusInformationPanel.set("isVisible", false);
        that.GooglePlusRecentActivityPanel.set("isVisible", false);
      });

    }
    
  });
  
  return app;
});

