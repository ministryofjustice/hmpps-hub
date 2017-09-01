define([
  "sitecore",
  "/-/speak/v1/contenttesting/ItemCallMetricBaseDataSource.js"
], function (Sitecore, itemCallMetricBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "ReachDataSource",
    base: "ItemCallMetricBaseDataSource",
    selector: "script[type='x-sitecore-reachdatasource']",

    attributes: [
      { name: "actionUrl", defaultValue: "/sitecore/shell/api/ct/Reach/GetReachValue" },
      { name: "actionUrlForTestValue", defaultValue: "/sitecore/shell/api/ct/Reach/GetReachByTestValue" },
      { name: "value", defaultValue: 0 },
      { name: "rate", defaultValue: 0 }
    ],

    initialize: function () {
      this._super();
    },

    extendModel: {
      _setData: function (data) {
        if (data && data[0]) {
          var item = data[0];
          this.set({
            value: parseInt(item.Value, 10),
            rate: parseInt(item.Rate, 10)
          });
        }
        else {
          console.log("Cannot parse data in ReachDataSource");
          console.log(data);
        }
      }
    }
  });
});