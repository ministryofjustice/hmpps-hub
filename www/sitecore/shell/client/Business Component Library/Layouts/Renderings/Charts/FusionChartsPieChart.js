require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
  }
});

define(["sitecore", "fusionChartBaseComponent"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsPieChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsPieChart",
    attributes: [
      { name: "data", defaultValue: null },
      { name: "chartProperties", defaultValue: null }
    ],
    initialize: function () {
      this._super();
      this.initializeChart(true);
      this.allowsDeselection = true;
    },
    
    // Returns the FusionCharts component name
    getChartComponentName: function () {
      return "Pie2D";
    }
  });
});