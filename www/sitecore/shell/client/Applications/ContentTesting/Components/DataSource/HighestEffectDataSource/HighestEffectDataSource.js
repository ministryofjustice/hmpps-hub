define(["sitecore", "/-/speak/v1/contenttesting/OptimizationEntriesBaseDataSource.js"], function (Sitecore, optimizationEntriesBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "HighestEffectDataSource",
    base: "OptimizationEntriesBaseDataSource",
    selector: "script[type='x-sitecore-highesteffectdatasource']",

    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/EffectForDateRange" },
      { name: "actionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/EffectForDateRangeWithComparisonForUser" }
    ],

    initialize: function () {
      this._super();
    }
  });
});