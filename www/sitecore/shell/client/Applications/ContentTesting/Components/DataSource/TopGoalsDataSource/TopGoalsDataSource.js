define([
  "sitecore",
  "/-/speak/v1/contenttesting/TopMetricsBaseDataSource.js"
], function (Sitecore, topMetricsBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "TopGoalsDataSource",
    base: "TopMetricsBaseDataSource",
    selector: "script[type='x-sitecore-topgoalsdatasource']",

    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/TopGoals/GetTopGoals" },
      { name: "actionUrlForTestValue", defaultValue: "/sitecore/shell/api/ct/TopGoals/GetTopGoalsByTestValue" }
    ],

    initialize: function () {
      this._super();
    }
  });
});