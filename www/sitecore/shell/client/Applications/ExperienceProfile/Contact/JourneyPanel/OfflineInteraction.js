define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var intelPath = "/intel",
      cintelTableNameProperty = "cintelTableName",
      offlineTable = "journey-detail-offline-interaction",
      cidParam = "cid";
      
  var app = sc.Definitions.App.extend({
    initialized: function () {
      var contactId = cintelUtil.getQueryParam(cidParam),
          baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + offlineTable, headerValue: offlineTable }
      ]);

      sc.off("showOfflineInteractionApp").on("showOfflineInteractionApp", function (application, timeLineEventId) {
        providerHelper.initProvider(application.OfflineDataProvider, offlineTable, baseUrl + intelPath + "/" + offlineTable + "/" + timeLineEventId);
        
        providerHelper.getData(
        application.OfflineDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[application.OfflineDataProvider.get(cintelTableNameProperty)];
          if (!dataSet || dataSet.length < 1) {
            return;
          }

          var data = dataSet[0];
       		  
		  cintelUtil.setText(this.ChannelValue, data.InteractionChannelDisplayName, false);	
		  cintelUtil.setText(this.GoalsValue, data.GoalDisplayNameList, false);	
		  cintelUtil.setText(this.CampaignValue, data.CampaignDisplayName, false);	
		  cintelUtil.setText(this.AssetValue, data.AssetDisplayNameList, false);	
        
		  cintelUtil.setText(this.TimeValue, data.DurationDisplayValue, false);	        
		  cintelUtil.setText(this.VisitNumberValue, data.TouchPointViewCount == 0 ? "0" : data.TouchPointViewCount, false);
		  cintelUtil.setText(this.ValueGeneratedValue, data.InteractionEngagementValue == 0 ? "0" : data.InteractionEngagementValue , false);

		  cintelUtil.setText(this.SourceHyperlinkButton, data.SourceSystemDisplayName, false);
          this.SourceHyperlinkButton.set("navigateUrl", "http://" + data.SourceSystemUrl);
		  cintelUtil.setText(this.RecencyValue, data.FormattedInteractionStartDateTime, false);

        }, this)
      );
      }, this);
      
    }
  });
  return app;
});
