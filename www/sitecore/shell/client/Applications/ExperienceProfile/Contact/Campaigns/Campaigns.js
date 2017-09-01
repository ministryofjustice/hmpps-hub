define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var tableName = "campaigns";
      var localUrl = "/intel/" + tableName;

      providerHelper.setupHeaders([
        { urlKey: localUrl + "?", headerValue: tableName }
      ]);

      var url = sc.Contact.baseUrl + localUrl;

      providerHelper.initProvider(this.CampaignsDataProvider, tableName, url, this.CampaignsTabMessageBar);
      providerHelper.subscribeSorting(this.CampaignsDataProvider, this.Campaigns);
      providerHelper.setDefaultSorting(this.CampaignsDataProvider, "VisitStartDateTime", true);
      providerHelper.getListData(this.CampaignsDataProvider);

      providerHelper.subscribeAccordionHeader(this.CampaignsDataProvider, this.CampaignsAccordion);

      sc.Contact.subscribeVisitDialog(this.Campaigns);
    }
  });
  return app;
});