require.config({
  paths: {
    experienceAnalyticsD3ChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsD3ChartBase"
  }
});

define(["sitecore", "experienceAnalyticsD3ChartBase"], function (Sitecore, experienceAnalyticsD3ChartBase) {
  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsBarChart",
    base: "ExperienceAnalyticsD3ChartBase",
    selector: ".sc-ExperienceAnalyticsBarChart",
    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsD3ChartBase.prototype._scAttrs.concat([
      { name: "chartName", value: "BarChart" },
      { name: "targetPageUrl", value: "$el.data:sc-targetpageurl" }
    ]),

    chartModel: null,

    initialize: function () {
      this._super();

      this.model.setPreferredTimeResolution("-");
    },

    afterRender: function () {
      if (this.model.get("configurationError")) {
        return;
      }
      this.chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.setupMessageBar(this.chartModel);
        if (this.model.get("targetPageUrl")) {
            this.chartModel.on("ItemSelected", this.model.viewModel.drillDownToKey, this);
        }
    }
  });

});