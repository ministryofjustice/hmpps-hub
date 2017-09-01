require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
  }
});

define(["sitecore", "fusionChartBaseComponent"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsRadarChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsRadarChart",
    attributes: [
      { name: "data", defaultValue: null },
      { name: "chartProperties", defaultValue: null }
    ],
    initialize: function () {
      this._super();
      this.initializeChart(false);
    },

    // Returns the FusionCharts component name
    getChartComponentName: function () {
      return "Radar";
    }
  });
});