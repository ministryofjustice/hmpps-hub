require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
  }
});

define(["sitecore", "fusionChartBaseComponent"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsLineChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsLineChart",
    attributes: [
      { name: "data", defaultValue: null },
      { name: "chartProperties", defaultValue: null }
    ],
    initialize: function () {
      this._super();
      this.initializeChart(false);      
    },
    
    // Returns the FusionCharts component name
    getChartComponentName: function (chartProperties) {
      var componentName;
      
      switch (chartProperties.dataType) {
        case "MultiSeries":
          if (chartProperties.appearance.visibleCategoriesRange) {
            componentName = "ScrollLine2D";
          }
          else {
            componentName = "MSLine";
          }
          break;
        case "MultiAxis":
          componentName = "MultiAxisLine";
          break;
        default:
          componentName = "Line";
          break;
      }

      return componentName;
    }
  });
});