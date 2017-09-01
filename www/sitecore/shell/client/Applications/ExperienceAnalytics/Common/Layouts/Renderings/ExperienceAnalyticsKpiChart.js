require.config({
  paths: {
    experienceAnalyticsD3ChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsD3ChartBase",
    experienceAnalyticsMetricsFormatter: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsMetricsFormatter"
  }
});

define(["sitecore", "experienceAnalyticsD3ChartBase", "experienceAnalyticsMetricsFormatter"], function (Sitecore, experienceAnalyticsD3ChartBase, metricsFormatter) {

  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsKpiChart",
    base: "ExperienceAnalyticsD3ChartBase",
    selector: ".sc-ExperienceAnalyticsKpiChart",
    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsD3ChartBase.prototype._scAttrs.concat([
      { name: "chartName", value: "KpiChart" },
      { name: "noDataToDisplay", value: '$el.data:sc-nodatatodisplay' }
    ]),

    initialize: function () {
      this._super();
      this.initializeNoDataPanel();
    },

    afterRender: function () {
      if (this.model.get("configurationError")) {
        return;
      }
      var chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.chartModel = chartModel;
      this.setupMessageBar(chartModel);
      this.setChartProperties(chartModel);
      this.setProgressIndicatorPosition();

      _(this.chartModel.viewModel).extend({ toggleProgressIndicator: this.toggleProgressIndicator.bind(this) });
      this.model.setPreferredTimeResolution("-");
    },

    setChartData: function (data) {
      this._super(data);

      var dynamicData = this.chartModel.get("dynamicData");
      _(dynamicData).each(function (dataPoint) {
        var controlName = this.model.get("name") + "value" + dataPoint.metricName;
        var metricValue = metricsFormatter.getFormattedString(dataPoint.metricValue, dataPoint.numberScale.name, dataPoint.numberScale.scaleUnit, dataPoint.numberScale.scaleValue);

        if (this.app[controlName] != null) {
          this.app[controlName].viewModel.text(metricValue);
        }
      }, this);

      this.showDataPanel();
    },

    resetChartData: function () {
      this.showNoDataPanel();
    },

    setProgressIndicatorPosition: function () {
      this.progressindicator = this.app[this.model.get("name") + "ProgressIndicator"];
      this.progressindicator.viewModel._updateModel();
    },

    showMessageForInvalidSettingsOfCharts: function () {
      // no-op
    },

    toggleProgressIndicator: function (status) {
      if (status) {
        this.progressindicator.viewModel.show();
      } else {
        this.progressindicator.viewModel.hide();
      }
    },

    showNoDataPanel: function () {
      this.dataPanel.hide();
      this.noDataPanel.show();
      this.noDataText.text(this.model.get("noDataToDisplay") + '.');
    },

    showDataPanel: function () {
      this.dataPanel.show();
      this.noDataPanel.hide();
    },

    initializeNoDataPanel: function () {
      var name = this.model.get("name");
      this.dataPanel = this.$el.find("[data-sc-id='" + name + "DataPanel']");
      this.noDataPanel = this.$el.find("[data-sc-id='" + name + "NoDataPanel']");
      this.noDataText = this.$el.find("[data-sc-id='" + name + "NoDataText']");

      this.$el.find('.sc-text-largevalue').removeClass('sc-text-largevalue').addClass('sc-metricValue');
      this.noDataPanel.addClass('sc-d3-nodata-panel');
    }
  });
});

