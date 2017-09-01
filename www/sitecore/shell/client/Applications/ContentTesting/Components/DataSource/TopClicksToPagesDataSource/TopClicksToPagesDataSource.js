define([
  "sitecore",
  "/-/speak/v1/contenttesting/TopMetricsBaseDataSource.js"
], function (Sitecore, topMetricsBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "TopClicksToPagesDataSource",
    base: "TopMetricsBaseDataSource",
    selector: "script[type='x-sitecore-topclickstopagesdatasource']",

    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/TopClicksToPages/GetTopClicksToPages" },
      { name: "actionUrlForTestValue", defaultValue: "/sitecore/shell/api/ct/TopClicksToPages/GetTopClicksToPagesByTestValue" }
    ],

    initialize: function () {
      this._super();
    }
  });
});