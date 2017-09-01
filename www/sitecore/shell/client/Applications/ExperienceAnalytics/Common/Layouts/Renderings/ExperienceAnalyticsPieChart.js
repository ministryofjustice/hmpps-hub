require.config({
  paths: {
      experienceAnalyticsD3ChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsD3ChartBase"
  }
});

define(["sitecore", "experienceAnalyticsD3ChartBase"], function (Sitecore, experienceAnalyticsD3ChartBase) {
    Sitecore.Factories.createBaseComponent({
        name: "ExperienceAnalyticsPieChart",
        base: "ExperienceAnalyticsD3ChartBase",
        selector: ".sc-ExperienceAnalyticsPieChart",
        attributes: Sitecore.Definitions.Views.ExperienceAnalyticsD3ChartBase.prototype._scAttrs.concat([
            { name: "chartName", value: "PieChart" },
            { name: "targetPageUrl", value: "$el.data:sc-targetpageurl" }
        ]),

        chartModel: null,
        keyProperty: "key",
        rawKeys: {},

        initialize: function() {
            this._super();
            if (this.model.get("configurationError")) {
              return;
            }

            this.model.setPreferredTimeResolution("-");
        },

        afterRender: function () {
          if (this.model.get("configurationError")) {
            return;
          }
          this.chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
          this.setupMessageBar(this.chartModel);
          this.setChartProperties(this.chartModel);
          var chartModel = this.chartModel;

          //chartModel.attributes.chartProperties.appearance.enableAnimation = false;

          chartModel.on("change:chartControls", function () {
            chartModel.off("change:chartControls");
            chartModel.get("chartControls")[0].addEventListener("Rendered", function () {
              chartModel.get("chartControls")[0].setChartAttribute("enableRotation", 0);
            });
          });

          if (this.model.get("targetPageUrl")) {
              this.chartModel.on("ItemSelected", this.model.viewModel.drillDownToKey, this);
          }
        },

        setChartFieldProperties: function (data) {
            var chartProperties = this.chartModel.get("chartProperties"),
                seriesChartField = this.model.get("seriesChartField");

            if (this.useCartesianKey(data)) {
                    chartProperties.dataMapping.categoryChartField = {
                        dataField: seriesChartField.cartesianKeyField
                    };
                }
        }     
    });

});