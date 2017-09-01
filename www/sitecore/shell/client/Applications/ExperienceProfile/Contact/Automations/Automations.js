define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var tableName = "automations";
      var url = sc.Contact.baseUrl + "/intel/" + tableName;

      providerHelper.initProvider(this.AutomationsDataProvider, tableName, url, this.AutomationsTabMessageBar);
      providerHelper.subscribeSorting(this.AutomationsDataProvider, this.EngagementPlans);
      providerHelper.getListData(this.AutomationsDataProvider);

      providerHelper.subscribeAccordionHeader(this.AutomationsDataProvider, this.Accordion);
    }
  });
  return app;
});