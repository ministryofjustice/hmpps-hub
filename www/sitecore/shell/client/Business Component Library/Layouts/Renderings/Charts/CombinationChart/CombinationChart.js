require.config({
  paths: {
    d3: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/D3/d3.min",
    nvd3: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/NVD3/nv.d3.min",
    metricsFormatter: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Models/MetricsFormatter",
    formatterConfig: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Models/FormatterConfig",
    nvd3Models: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Models/NVD3Models",
    combination: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Components/Combination",
    nvd3Style: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/NVD3/nvd3Speak.css"
  },
  shim: {
    "nvd3": { deps: ["d3"] },
    "metricsFormatter": { deps: ["nvd3"] },
    "formatterConfig": { deps: ["metricsFormatter"] },
    "nvd3Models": { deps: ["formatterConfig"] },
    "combination": { deps: ["nvd3Models"] }
  }
});

define(["sitecore", "css!nvd3Style", "d3", "nvd3", "nvd3Models", "formatterConfig", "combination"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "CombinationChart",
    base: "ControlBase",
    selector: ".sc-d3-combinationchart",
    attributes: [
      { name: "dynamicData", defaultValue: null },
      { name: "propertyNotDefined", value: '$el.data:sc-propertynotdefined' },
      { name: "xAxisLabel", value: '$el.data:sc-xaxislabel' },
      { name: "categoryLabelTrimming", value: '$el.data:sc-categorylabeltrimming' },
      { name: "legendMode", value: '$el.data:sc-legendmode' },
      { name: "isTitleVisible", value: '$el.data:sc-istitlevisible' },
      { name: "isLegendHidden", value: '$el.data:sc-islegendhidden' },
      { name: "leftLabelsWidth", value: '$el.data:sc-leftlabelswidth' },
      { name: "seriesDefinitions", value: '$el.data:sc-seriesdefinitions' },
      { name: "xNumberScale", value: '$el.data:sc-xnumberscale' },
      { name: "xNumberScaleValues", value: '$el.data:sc-xnumberscalevalues' },
      { name: "xNumberScaleUnits", value: '$el.data:sc-xnumberscaleunits' },
      { name: "yNumberScale", value: '$el.data:sc-ynumberscale' },
      { name: "yNumberScaleValues", value: '$el.data:sc-ynumberscalevalues' },
      { name: "yNumberScaleUnits", value: '$el.data:sc-ynumberscaleunits' },
      { name: "isSegmentSelectionDisabled", value: '$el.data:sc-issegmentselectiondisabled' }
    ],

    handleItemClick: function (d) {
      this.SelectedItem = d;
    },

    refresh: function (isAnimationEnabled) {
      this.ChartComponent.bindData(this.model.get("dynamicData"), isAnimationEnabled);
    },

    getMetrics: function () {
      return this.ChartComponent.ChartProperties.metricsFormat;
    },

    initialize: function () {

      this.model.dynamicData = [];
      var options = {
        el: this.el,
        xAxisLabel: this.model.get("xAxisLabel"),
        categoryLabelTrimming: this.model.get("categoryLabelTrimming"),
        legendMode: this.model.get("legendMode"),
        isTitleVisible: this.model.get("isTitleVisible"),
        isLegendHidden: this.model.get("isLegendHidden"),
        leftLabelsWidth: this.model.get("leftLabelsWidth"),
        seriesDefinitions: this.model.get("seriesDefinitions") ? JSON.stringify(this.model.get("seriesDefinitions")) : "",
        itemClicked: this.handleItemClick.bind(this),
        xNumberScale: this.model.get("xNumberScale"),
        xNumberScaleValues: this.model.get("xNumberScaleValues"),
        xNumberScaleUnits: this.model.get("xNumberScaleUnits"),
        yNumberScale: this.model.get("yNumberScale"),
        yNumberScaleValues: this.model.get("yNumberScaleValues"),
        yNumberScaleUnits: this.model.get("yNumberScaleUnits"),
        isSegmentSelectionDisabled: this.model.get("isSegmentSelectionDisabled")
      };

      this.ChartComponent = new Sitecore.D3.components.Combination(options);
      this.model.on("change:dynamicData", function () {
        this.ChartComponent.bindData(this.model.get("dynamicData"), true);
      }, this);
    }
  });
});
