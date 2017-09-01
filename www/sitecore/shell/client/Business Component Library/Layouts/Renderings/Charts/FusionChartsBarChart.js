require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
  }
});

define(["sitecore", "fusionChartBaseComponent"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsBarChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsBarChart",
    attributes: [
      { name: "data", defaultValue: null },
      { name: "chartProperties", defaultValue: null }
    ],
    initialize: function () {
      this._super();
      this.initializeChart(false);
      this.allowsDeselection = true;      
    },

    // Returns the FusionCharts component name
    getChartComponentName: function (chartProperties) {
      if (chartProperties.appearance.stackSeries) {
        return "StackedBar2D";
      }

      switch (chartProperties.dataType) {
        case "MultiSeries":
          return "MSBar2D";
        default:
          return "Bar2D";
      }
    },
  });
});