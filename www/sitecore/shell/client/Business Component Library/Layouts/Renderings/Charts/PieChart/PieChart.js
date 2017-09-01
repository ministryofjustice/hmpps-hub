require.config({
  paths: {
    d3: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/D3/d3.min",
    nvd3: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/NVD3/nv.d3.min",
    metricsFormatter: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Models/MetricsFormatter",
    formatterConfig: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Models/FormatterConfig",
    nvd3Models: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Models/NVD3Models",
    pie: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/D3/Components/Pie",
    nvd3Style: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/NVD3/nvd3Speak.css"
  },
  shim: {
    "nvd3": { deps: ["d3"] },
    "metricsFormatter": { deps: ["nvd3"] },
    "formatterConfig": { deps: ["metricsFormatter"] },
    "nvd3Models": { deps: ["formatterConfig"] },
    "pie": { deps: ["nvd3Models"] }
  }
});

define(["sitecore", "css!nvd3Style", "d3", "nvd3", "nvd3Models", "formatterConfig", "pie"], function (Sitecore) {

  Sitecore.Factories.createBaseComponent({
    name: "PieChart",
    base: "ControlBase",
    selector: ".sc-d3-piechart",
    attributes: [
      { name: "dynamicData", defaultValue: null },
      { name: "propertyNotDefined", value: '$el.data:sc-propertynotdefined' },
      { name: "isTitleVisible", value: '$el.data:sc-istitlevisible' },
      { name: "isLegendHidden", value: '$el.data:sc-islegendhidden' },
      { name: "legendMode", value: '$el.data:sc-legendmode' },
      { name: "sortByValue", value: '$el.data:sc-sortbyvalue' },
      { name: "maxNumberOfSegments", value: '$el.data:sc-maxnumberofsegments' },
      { name: "otherText", value: '$el.data:sc-othertext' },
      { name: "isColorPaletteShaded", value: '$el.data:sc-iscolorpaletteshaded' },
      { name: "isValueConvertedToPercent", value: '$el.data:sc-isvalueconvertedtopercent' },
      { name: "isValueHidden", value: '$el.data:sc-isvaluehidden' },
      { name: "seriesDefinitions", value: '$el.data:sc-seriesdefinitions' },
      { name: "xNumberScale", value: '$el.data:sc-xnumberscale' },
      { name: "xNumberScaleValues", value: '$el.data:sc-xnumberscalevalues' },
      { name: "xNumberScaleUnits", value: '$el.data:sc-xnumberscaleunits' },
      { name: "yNumberScale", value: '$el.data:sc-ynumberscale' },
      { name: "yNumberScaleValues", value: '$el.data:sc-ynumberscalevalues' },
      { name: "yNumberScaleUnits", value: '$el.data:sc-ynumberscaleunits' },
      { name: "isSegmentSelectionDisabled", value: '$el.data:sc-issegmentselectiondisabled' },
      { name: "selectedDataIndex", value: '$el.data:sc-selecteddataindex' }
    ],

    handleItemClick: function (d) {
      this.model.set("selectedItem", d);
      this.model.trigger("ItemSelected", d);
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
        legendMode: this.model.get("legendMode"),
        isTitleVisible: this.model.get("isTitleVisible"),
        isLegendHidden: this.model.get("isLegendHidden"),
        sortByValue: this.model.get("sortByValue"),
        maxNumberOfSegments: this.model.get("maxNumberOfSegments"),
        otherText: this.model.get("otherText"),
        itemClicked: this.handleItemClick.bind(this),
        isColorPaletteShaded: this.model.get("isColorPaletteShaded"),
        isValueConvertedToPercent: this.model.get("isValueConvertedToPercent"),
        seriesDefinitions: this.model.get("seriesDefinitions") ? JSON.stringify(this.model.get("seriesDefinitions")) : "",
        isValueHidden: this.model.get("isValueHidden"),
        xNumberScale: this.model.get("xNumberScale"),
        xNumberScaleValues: this.model.get("xNumberScaleValues"),
        xNumberScaleUnits: this.model.get("xNumberScaleUnits"),
        yNumberScale: this.model.get("yNumberScale"),
        yNumberScaleValues: this.model.get("yNumberScaleValues"),
        yNumberScaleUnits: this.model.get("yNumberScaleUnits"),
        isSegmentSelectionDisabled: this.model.get("isSegmentSelectionDisabled")
      };

      this.ChartComponent = new Sitecore.D3.components.Pie(options);
      this.model.on("change:dynamicData", function () {
        this.ChartComponent.bindData(this.model.get("dynamicData"), true);
      }, this);

      this.model.on("change:selectedDataIndex", function () {
        this.ChartComponent.selectDataItem(this.model.get("selectedDataIndex"));
      }, this);
    }
  });
});
