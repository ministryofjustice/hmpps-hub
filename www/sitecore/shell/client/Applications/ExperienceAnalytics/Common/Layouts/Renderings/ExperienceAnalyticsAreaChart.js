require.config({
    paths: {
        experienceAnalyticsD3ChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsD3ChartBase"
    }
});

define(["sitecore", "experienceAnalyticsD3ChartBase"], function (Sitecore, experienceAnalyticsD3ChartBase) {

  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsAreaChart",
    base: "ExperienceAnalyticsD3ChartBase",
    selector: ".sc-ExperienceAnalyticsAreaChart",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsD3ChartBase.prototype._scAttrs.concat([
      { name: "chartName", value: "AreaChart" }
    ]),

    initialize: function () {
      this._super();
    },

    afterRender: function () {
      if (this.model.get("configurationError")) {
        return;
      }
      var chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.chartModel = chartModel;
      this.setupMessageBar(chartModel);
      this.setChartProperties(chartModel);
      this.chartModel.on("ItemSelected", this.model.viewModel.drillDownToKey, this);
    },

    setMetricsFormat: function (lang, timeResolution) {
        var metricsFormat = this.chartModel.viewModel.getMetrics();
        metricsFormat.xOptions.numberScale = 'Date';
        metricsFormat.xOptions.numberScaleUnits = timeResolution;
        metricsFormat.xOptions.numberScaleValues = lang;
    },

  });

});