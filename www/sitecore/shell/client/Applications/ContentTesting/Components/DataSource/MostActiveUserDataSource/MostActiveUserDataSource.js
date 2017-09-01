define(["sitecore", "/-/speak/v1/contenttesting/OptimizationEntriesBaseDataSource.js"], function (Sitecore, optimizationEntriesBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "MostActiveUserDataSource",
    base: "OptimizationEntriesBaseDataSource",
    selector: "script[type='x-sitecore-mostactiveusersdatasource']",
    
    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/ActivityForDateRange" },
      { name: "actionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/ActivityForDateRangeWithComparisonForUser" }
    ],

    initialize: function () {
      this._super();
    }
  });
});