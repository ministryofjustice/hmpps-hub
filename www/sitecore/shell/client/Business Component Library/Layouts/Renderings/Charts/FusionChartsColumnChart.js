require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
  }
});

define(["sitecore", "fusionChartBaseComponent"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsColumnChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsColumnChart",
    attributes: [
      { name: "data", defaultValue: null },
      { name: "chartProperties", defaultValue: null }
    ],
    initialize: function () {
      this._super();
      this.initializeChart(false);
      this.allowsDeselection = true;
      this.enableColorChange = true;
    },

    // Returns the FusionCharts component name
    getChartComponentName: function (chartProperties) {
      var componentName;
      
      switch (chartProperties.dataType) {
        case "MultiSeries":
          if (chartProperties.appearance.stackSeries && chartProperties.appearance.visibleCategoriesRange) {
            componentName = "ScrollStackedColumn2D";
          }
          else if (chartProperties.appearance.visibleCategoriesRange) {
            componentName = "ScrollColumn2D";
          }
          else if (chartProperties.appearance.stackSeries) {
            componentName = "StackedColumn2D";
          }
          else {
            componentName = "MSColumn2D";
          }
          break;
        default:
          componentName = "Column2D";
          break;
      }

      return componentName;
    },
  });
});