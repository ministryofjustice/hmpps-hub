define(["sitecore", "/-/speak/v1/contenttesting/OptimizationEntriesBaseDataSource.js"], function (Sitecore, optimizationEntriesBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "BestGuessingDataSource",
    base: "OptimizationEntriesBaseDataSource",
    selector: "script[type='x-sitecore-bestguessingdatasource']",
    
    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/GuessForDateRange" },
      { name: "actionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/GuessForDateRangeWithComparisonForUser" }
    ],

    initialize: function () {
      this._super();
    }
  });
});