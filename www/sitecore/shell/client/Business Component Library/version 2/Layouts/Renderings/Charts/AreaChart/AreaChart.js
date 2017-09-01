(function (speak) {

  speak.component(["sitecore", "css!bclNvd3Style", "d3", "nvd3", "bclNvd3Models", "bclArea"], function (Speak) {

    function handleItemClick(d) {
      this.SelectedItem = d;
      this.trigger("ItemSelected", this.SelectedItem);
    }

    /**
    * Component initialization.
    */
    return {
      refresh: function (isAnimationEnabled) {
        this.ChartComponent.bindData(this.DynamicData, isAnimationEnabled);
      },

      initialized: function () {
        this.DynamicData = [];
        var options = {
          el: this.el,
          xAxisLabel: this.XAxisLabel,
          yAxisLabel: this.YAxisLabel,
          legendMode: this.LegendMode,
          categoryLabelTrimming: this.CategoryLabelTrimming,
          isTitleVisible: this.IsTitleVisible,
          isLegendHidden: this.IsLegendHidden,
          leftLabelsWidth: this.LeftLabelsWidth,
          seriesStyle: this.SeriesStyle,
          seriesDefinitions: this.SeriesDefinitions,
          itemClicked: handleItemClick.bind(this),
          isSegmentSelectionDisabled: this.IsSegmentSelectionDisabled
        };

        this.ChartComponent = new Sitecore.Speak.D3.components.Area(options);
        this.on("change:DynamicData", function () {
          this.ChartComponent.bindData(this.DynamicData, true);
        }, this);

        this.on("change:IsVisible", function () {
          if (this.IsVisible) {
            setTimeout(function () {
              this.ChartComponent.bindData(this.DynamicData, true);
            }.bind(this), 0);
          };
        }, this);
      }
    };
  }, "AreaChart");
})(Sitecore.Speak);
