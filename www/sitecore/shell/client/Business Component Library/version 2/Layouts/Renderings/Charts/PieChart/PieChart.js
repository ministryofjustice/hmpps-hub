(function (speak) {

  speak.component(["sitecore", "css!bclNvd3Style", "d3", "nvd3", "bclNvd3Models", "bclPie"], function (Speak) {

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
          legendMode: this.LegendMode,
          isTitleVisible: this.IsTitleVisible,
          isColorPaletteShaded: this.IsColorPaletteShaded,
          isLegendHidden: this.IsLegendHidden,
          isSortedByValue: this.IsSortedByValue,
          maxNumberOfSegments: this.MaxNumberOfSegments,
          otherText: this.OtherText,
          itemClicked: handleItemClick.bind(this),
          isValueConvertedToPercent: this.IsValueConvertedToPercent,
          isValueHidden: this.IsValueHidden,
          seriesDefinitions: this.SeriesDefinitions,
          isSegmentSelectionDisabled: this.IsSegmentSelectionDisabled
        };

        this.ChartComponent = new Sitecore.Speak.D3.components.Pie(options);
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

        this.on("change:SelectedDataIndex", function (e) {        
          this.ChartComponent.selectDataItem(this.SelectedDataIndex);
        });
      }
    };
  }, "PieChart");
})(Sitecore.Speak);
