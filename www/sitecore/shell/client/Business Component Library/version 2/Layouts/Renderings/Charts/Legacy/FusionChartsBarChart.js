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
        if (chartProperties.appearance.stackSeries) {
          return "StackedBar2D";
        }

        switch (chartProperties.dataType) {
          case "MultiSeries":
            return "MSBar2D";
          default:
            return "Bar2D";
        }
      }
    });

  }, "LegacyBarChart");
})(Sitecore.Speak);