require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
  }
});

define(["sitecore", "fusionChartBaseComponent"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsAreaChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsAreaChart",
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
            componentName = "ScrollArea2D";
          }
          else if (chartProperties.appearance.stackSeries) {
            componentName = "StackedArea2D";
          }
          else {
            componentName = "MSArea";
          }
          break;
        default:
          componentName = "Area2D";
          break;
      }

      return componentName;
    }
  });
});