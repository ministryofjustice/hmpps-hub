(function (speak) {
 
  speak.component(["bclFusionChartBaseComponent"], function (fusionChartBaseComponent) {

    return speak.extend(fusionChartBaseComponent, {
      initialized: function () {
        try {
          this.initializeFusionChartsBaseComponent();
          this.initializeChart(false);
        } catch (error) {
          console.log(error);
        }
      },

      // Returns the FusionCharts component name
      getChartComponentName: function (chartProperties) {
        var componentName;

        switch (chartProperties.dataType) {
          case "MultiSeries":
            if (chartProperties.appearance.visibleCategoriesRange) {
              componentName = "ScrollArea2D";
            } else if (chartProperties.appearance.stackSeries) {
              componentName = "StackedArea2D";
            } else {
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

  }, "LegacyAreaChart");
})(Sitecore.Speak);
