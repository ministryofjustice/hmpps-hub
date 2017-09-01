define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var intelPath = "/intel",
      cintelTableNameProperty = "cintelTableName",
      onlineTable = "journey-detail-online-interaction",
      cidParam = "cid";

  var app = sc.Definitions.App.extend({
    initialized: function () {
      var contactId = cintelUtil.getQueryParam(cidParam),
          baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + onlineTable, headerValue: onlineTable }
      ]);

      sc.off("showOnlineInteractionApp").on("showOnlineInteractionApp", function (application, timeLineEventId) {
        providerHelper.initProvider(application.OnlineDataProvider, onlineTable, baseUrl + intelPath + "/" + onlineTable + "/" + timeLineEventId);

        providerHelper.getData(
        application.OnlineDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[application.OnlineDataProvider.get(cintelTableNameProperty)];
          if (!dataSet || dataSet.length < 1) {
            return;
          }

          var data = dataSet[0];
          
          cintelUtil.setText(this.ChannelValue, data.InteractionChannelDisplayName, false);
          cintelUtil.setText(this.GoalsValue, data.GoalDisplayNameList, false);
          cintelUtil.setText(this.CampaignValue, data.CampaignDisplayName, false);
		  cintelUtil.setText(this.AssetValue, data.AssetDisplayNameList, false);

		  cintelUtil.setText(this.TimeValue,  data.TimeOnPage, false);
		  cintelUtil.setText(this.VisitNumberValue, data.InteractionIndex == 0 ? "0" : data.InteractionIndex , false);
		  cintelUtil.setText(this.ValueGeneratedValue,  data.InteractionEngagementValue == 0 ? "0" : data.InteractionEngagementValue, false);
		  cintelUtil.setText(this.PageviewsValue,  data.InteractionPageViewCount == 0 ? "0" : data.InteractionPageViewCount, false);
				  
		  cintelUtil.setText(this.LocationValue,  data.LocationDisplayName, false);
		  cintelUtil.setText(this.RecencyValue,  data.FormattedInteractionStartDateTime, false);
		
        }, this)
      );
      }, this);
    }

  });
  return app;
});