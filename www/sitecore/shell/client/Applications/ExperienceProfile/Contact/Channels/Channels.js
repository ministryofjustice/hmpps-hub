define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper) {
  var intelPath = "/intel",
      intelBaseUrl = sc.Contact.baseUrl + intelPath;
      
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      this.setupInteractionDistribution();
      this.setupGoalDistribution();
      this.setupSummaryListControl();

    },
    
    setupInteractionDistribution: function () {
      var viewName = "channel-interaction-distribution",
          transposedData;
      
      this.InteractionDistributionDataProvider.on("pageAdded", function (newData) {
        transposedData = this.setTransposedData(newData);
        this.InteractionDistributionChart.set("data", transposedData);
      }, this);

      providerHelper.initProvider(this.InteractionDistributionDataProvider, viewName, intelBaseUrl + "/" + viewName, this.ChannelTabMessageBar);
      providerHelper.getListData(this.InteractionDistributionDataProvider);
    },
    
    setupGoalDistribution: function () {
      var viewName = "channel-goal-distribution",
          transposedData ;

      this.GoalDistributionDataProvider.on("pageAdded", function (data) {
        transposedData = this.setTransposedData(data);
        this.GoalDistributionChart.set("data", transposedData);
      }, this);

      providerHelper.initProvider(this.GoalDistributionDataProvider, viewName, intelBaseUrl + "/" + viewName, this.ChannelTabMessageBar);
      providerHelper.getListData(this.GoalDistributionDataProvider);
    },
    
    setTransposedData: function (data) {
      var transposedData = {
        "dataset": [{ "data": [] }]
      };
      for (var i = 0; i < data.length; i++) {
        var channelTypeName = data[i].ChannelDisplayName,
            count = data[i].SumValue,
            id = channelTypeName;

        transposedData.dataset[0].data.push({ "id": id, "value": count, "category": channelTypeName });
      }

      return transposedData;
    },
    
    setupSummaryListControl: function () {
      var tableName = "channel-summary",
          localUrl = /intel/ + tableName;

      providerHelper.setupHeaders([
        { urlKey: localUrl + "?", headerValue: tableName }
      ]);
      var url = sc.Contact.baseUrl + localUrl;

      providerHelper.initProvider(this.SummaryDataProvider, tableName, url, this.ChannelTabMessageBar);
      providerHelper.subscribeSorting(this.SummaryDataProvider, this.SummaryListControl);
      providerHelper.setDefaultSorting(this.SummaryDataProvider, "TotalInteractionCount", true);
      providerHelper.getListData(this.SummaryDataProvider);
      providerHelper.subscribeAccordionHeader(this.SummaryDataProvider, this.SummaryListControl);
    }
    
  });
  return app;
});
