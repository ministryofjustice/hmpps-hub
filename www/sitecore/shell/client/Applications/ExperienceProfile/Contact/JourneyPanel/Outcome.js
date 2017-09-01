define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var intelPath = "/intel",
      cintelTableNameProperty = "cintelTableName",
      outcomeTable = "journey-detail-outcome",
      cidParam = "cid";

  var app = sc.Definitions.App.extend({
    initialized: function () {
      var contactId = cintelUtil.getQueryParam(cidParam),
          baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + outcomeTable, headerValue: outcomeTable }
      ]);

      sc.off("showOutcomeApp").on("showOutcomeApp", function (application, timeLineEventId) {
          providerHelper.initProvider(application.OutcomeDataProvider, outcomeTable, baseUrl + intelPath + "/" + outcomeTable + "/" + timeLineEventId);

        providerHelper.getData(
        application.OutcomeDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[application.OutcomeDataProvider.get(cintelTableNameProperty)];
          if (!dataSet || dataSet.length < 1) {
            return;
          }

          var data = dataSet[0];
         
		  cintelUtil.setText(this.RecencyValue,  data.FormattedOutcomeDateTime, false);	
		  cintelUtil.setText(this.SourceHyperlinkButton,  data.SourceSystemDisplayName, false);	
          this.SourceHyperlinkButton.set("navigateUrl", "http://" + data.SourceSystemUrl);
		  
		  cintelUtil.setText(this.ChannelValue,  data.ChannelDisplayName, false);	  
		  cintelUtil.setText(this.GoalsValue,  data.GoalDisplayNameList, false);
		  cintelUtil.setText(this.OutcomeValue,  data.OutcomeDefinitionDisplayName, false);
          
		  cintelUtil.setText(this.CampaignValue,  data.CampaignDisplayName, false);
		  cintelUtil.setText(this.AssetValue,  data.AssetDisplayNameList, false);

          if (data.OutcomeMonetaryValue != null) {
			  cintelUtil.setText(this.SalesAmountValue,  "$" + data.outcomemonetaryvalue, false);
          } else {
			  cintelUtil.setText(this.SalesAmountValue,  "", false);
          }

		  cintelUtil.setText(this.DurationValue,  data.TimeOnPage, false);
		  cintelUtil.setText(this.VisitNumberValue,  data.InteractionIndex == 0 ? "0" : data.InteractionIndex, false);
		  cintelUtil.setText(this.ValueGeneratedValue,  data.InteractionEngagementValue == 0 ? "0" : data.InteractionEngagementValue, false);

        }, this)
      );
      }, this);
	 
    }
  });
  return app;
});
