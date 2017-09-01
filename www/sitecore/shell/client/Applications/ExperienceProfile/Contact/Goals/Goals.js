define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var tableName = "goals";
      var localUrl = /intel/ + tableName;

      providerHelper.setupHeaders([
        { urlKey: localUrl + "?", headerValue: tableName }
      ]);
      var url = sc.Contact.baseUrl + localUrl;

      providerHelper.initProvider(this.GoalsDataProvider, tableName, url, this.GoalsTabMessageBar);
      providerHelper.subscribeSorting(this.GoalsDataProvider, this.GoalsList);
      providerHelper.setDefaultSorting(this.GoalsDataProvider, "ConversionDateTime", true);
      providerHelper.getListData(this.GoalsDataProvider);

      providerHelper.subscribeAccordionHeader(this.GoalsDataProvider, this.GoalsAccordion);

      sc.Contact.subscribeVisitDialog(this.GoalsList);
    }
  });
  return app;
});