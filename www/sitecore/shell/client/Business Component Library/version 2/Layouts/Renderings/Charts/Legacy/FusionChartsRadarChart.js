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
      getChartComponentName: function () {
        return "Radar";
      }
    });

  }, "LegacyRadarChart");
})(Sitecore.Speak);