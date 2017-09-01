(function (speak) {

  speak.component(["bclFusionChartBaseComponent"], function (fusionChartBaseComponent) {

    return speak.extend(fusionChartBaseComponent, {
      initialized: function () {
        try {
          this.initializeFusionChartsBaseComponent();
          this.initializeChart(true);
          this.allowsDeselection = true;
        } catch (error) {
          console.log(error);
        }
      },

      // Returns the FusionCharts component name      
      getChartComponentName: function () {
        return "Doughnut2D";
      }
    });

  }, "LegacyDoughnutChart");
})(Sitecore.Speak);
