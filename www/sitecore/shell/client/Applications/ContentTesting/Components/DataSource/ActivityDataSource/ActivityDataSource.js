define(["sitecore", "/-/speak/v1/contenttesting/OptimizationBaseDataSource.js"], function (Sitecore, optimizationBaseDataSource) {

  Sitecore.Factories.createBaseComponent({
    name: "ActivityDataSource",
    base: "OptimizationBaseDataSource",
    selector: "script[type = 'x-sitecore-activitydatasource']",

    attributes: [
      { name: "actionUrl", value: "/sitecore/shell/api/ct/Activity/ForDateRange" },
      { name: "testsStarted", defaultValue: 0 },
      { name: "testsRunning", defaultValue: 0 },
      { name: "exposure", defaultValue: 0 },
      { name: "testEffect", defaultValue: 0 }
    ],

    initialize: function() {
      this._super();
    },

    extendModel: {
      setData: function (data) {
        this.set("testsStarted", data.TestsStarted);
        this.set("testsRunning", data.TestsRunning);
        this.set("exposure", data.Exposure);
        this.set("testEffect", data.TestEffect);
      }
    }
  });
});
