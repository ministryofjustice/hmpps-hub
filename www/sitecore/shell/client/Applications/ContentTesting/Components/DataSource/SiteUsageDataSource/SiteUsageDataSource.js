define([
  "sitecore",
  "/-/speak/v1/contenttesting/TopMetricsBaseDataSource.js"
], function (Sitecore, topMetricsBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "SiteUsageDataSource",
    base: "TopMetricsBaseDataSource",
    selector: "script[type='x-sitecore-siteusagedatasource']",

    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/TestResults/GetSiteUsage" },
      { name: "actionUrlForTestValue", defaultValue: "/sitecore/shell/api/ct/TestResults/GetSiteUsage" }
    ],

    initialize: function () {
      this._super();
    }
  });
});