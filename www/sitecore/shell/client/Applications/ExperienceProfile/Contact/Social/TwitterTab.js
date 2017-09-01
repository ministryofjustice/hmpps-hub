define(["sitecore", "/-/speak/v1/experienceprofile/CintelUtl.js", "./SocialUtil.js"], function (sc, cintelUtil, socialUtil) {
  var app = sc.Definitions.App.extend({

    isTwitterRecentActivityRendering: false,

    initialized: function () {
      var contactId = cintelUtil.getQueryParam("cid");

      var twitterDataService = socialUtil.getEntityService("/sitecore/api/ssc/sitecore-social-experienceprofile-client-controllers/twitterdata");
      var that = this;

      this.TwitterRecentActivityPanel.set("isOpen", false);
      this.TwitterRecentActivityPanel.on("change:isOpen", function () {
        that.TwitterRecentActivityProgressIndicator.set("isBusy", that.isTwitterRecentActivityRendering && that.TwitterRecentActivityPanel.get("isOpen"));
      });
      
      var toogleVisibility = function (visible) {
        that.NoTwitterDataPanel.set("isVisible", !visible);
        that.TwitterInformationPanel.set("isVisible", visible);
        that.TwitterRecentActivityPanel.set("isVisible", visible);
      };

      twitterDataService.fetchEntity(contactId).execute()
        .then(function (twitterData) {
          cintelUtil.setText(that.TwitterScreenNameValue, twitterData.ScreenName, false);
          cintelUtil.setText(that.TwitterLocationValue, twitterData.Location, false);
          cintelUtil.setText(that.TwitterNumberOfFollowersValue, twitterData.NumberOfFollowers, false);
          cintelUtil.setText(that.TwitterNameValue, twitterData.Name, false);
          cintelUtil.setText(that.TwitterTimezoneValue, twitterData.Timezone, false);
          cintelUtil.setText(that.TwitterNumberOfTweetsValue, twitterData.NumberOfTweets, false);
          cintelUtil.setText(that.TwitterLanguageValue, twitterData.Language, false);
          cintelUtil.setText(that.TwitterWebsiteValue, twitterData.Website, false);
          cintelUtil.setText(that.TwitterCreatedValue, twitterData.Created, false);

          toogleVisibility(true);
          that.renderRecentActivity(contactId, that);
        })
        .fail(function () {
          toogleVisibility(false);
        });
    },

    renderRecentActivity: function (contactId, context) {

      context.isTwitterRecentActivityRendering = true;

      var twitterRecentActivityDataService = socialUtil.getEntityService("/sitecore/api/ssc/sitecore-social-experienceprofile-client-controllers/twitterrecentactivity");

      var onRecentActivityFail = function () {
        context.TwitterRecentActivityBorder.set("isVisible", false);
        context.NoTwitterRecentActivityBorder.set("isVisible", true);
        context.TwitterRecentActivityProgressIndicator.set("isBusy", false);
        context.isTwitterRecentActivityRendering = false;
      };

      twitterRecentActivityDataService.fetchEntity(contactId).execute()
        .then(function (twitterRecentActivity) {
          require(["//platform.twitter.com/widgets.js"], function () {
            twttr.widgets.createTimeline(
              twitterRecentActivity.WidgetId,
              context.TwitterRecentActivityBorder.viewModel.$el[0],
              {
                tweetLimit: twitterRecentActivity.TweetCount,
                screenName: twitterRecentActivity.ScreenName,
                showReplies: false,
                lang: twitterRecentActivity.Language,
                theme: "light",
                chrome: "transparent"
              }).then(function () {
                
                // HACK: override style from Contact.css:
                // code, iframe, .scLoadingIndication {  /* should be delete after fixing itemWebApi problem about page editor */
                //   display: none !important;
                // }
                context.TwitterRecentActivityBorder.viewModel.$el.find("iframe").each(function () {
                  var iframe = $(this);
                  iframe.attr("style", iframe.attr("style") + "; display: inline !important;");
                });
                // ENDHACK

                context.TwitterRecentActivityProgressIndicator.set("isBusy", false);
                context.isTwitterRecentActivityRendering = false;
              }, function (error) {
                onRecentActivityFail();
                window.console && console.error && console.error("And error has occured when creating Twitter timeline: " + error);
              });
          });
        })
        .fail(onRecentActivityFail);
    }
  });

  return app;
});