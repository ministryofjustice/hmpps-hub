define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ChartTemplateProperties",
    base: "BlockBase",
    selector: ".sc-ChartTemplate",
    lastSelectedId: null,
    lastSelectedSeriesIndex: null,
    allowsDeselection: false,
    chartDictionary: {
      NoDataToDisplay: "",     
      CategoryChartField: "",
      ValueChartFields: "",
      SeriesChartField: "",
      Categories: "",
      ValueChartField: "",
      DataField: ""
    },
    initialize: function () {
      var scope = this;

      this.setDictionary();

      this.chartProperties = {
        appearance: {
          showPointMarker: this.$el.data("sc-showpointmarker"),
          showValues: this.$el.data("sc-showvalues"),
          showLegend: this.$el.data("sc-showlegend"),
          showAxis: this.$el.data("sc-showaxis"),
          singleChartHeight: this.$el.data("sc-singlechartheight"),
          singleChartWidth: this.$el.data("sc-singlechartwidth"),
          visibleCategoriesRange: this.$el.data("sc-visiblecategoriesrange"),
          stackSeries: this.$el.data("sc-stackseries"),
          enableAnimation: this.$el.data("sc-enableanimation"),
          disableSelection: this.$el.data("sc-disableselection")
        },
        dataMapping: {
          categoryChartField: this.$el.data("sc-categorychartfield"),
          categoryFilter: this.$el.data("sc-categoryfilter"),
          valueChartFields: this.$el.data("sc-valuechartfields"),
          seriesChartField: this.$el.data("sc-serieschartfield") || {},
          seriesFilter: this.$el.data("sc-seriesfilter"),
          regionAlias: this.$el.data("sc-regionalias")
        },
        dataType: null,
        componentName: null
      };

      _.extend(_sc, { Charting: this.Charting });      
    },

    // <summary>
    // Segment clicked event handler.    
    // </summary> 
    segmentClicked: function () {
      if (this.chartProperties.appearance.disableSelection) {
        return;
      }

      var selectedSegment = this.Charting.SelectedSegment;
      if (this.allowsDeselection) {
        if (this.lastSelectedId === selectedSegment.id && this.lastSelectedSeriesIndex === selectedSegment.seriesIndex) {
          this.deselectSegment();
        } else {
          this.selectSegment();
        }
      }  else {
        this.selectSegment();
      }
    },

    selectSegment: function () {
      var selectedSegment = this.Charting.SelectedSegment;      
      this.lastSelectedId = selectedSegment.id;
      this.lastSelectedSeriesIndex = selectedSegment.seriesIndex;
      this.setSelectedChartColumn(selectedSegment, false);            
    },

    triggerSegmentSelectedEvent: function (selectedSegment) {
      if (this.lastSelectedId == null) {
        this.model.trigger("segmentClicked", selectedSegment);
        this.model.trigger("segmentDeselected", selectedSegment);
        return;
      }

      this.model.trigger("segmentClicked", selectedSegment);
      this.model.trigger("segmentSelected", selectedSegment);
    },

    // <summary>
    // DeselectSegment handler.    
    // </summary>    
    deselectSegment: function () {
      this.lastSelectedId = null;
      this.lastSelectedSeriesIndex = null;
      var selectedSegment = this.Charting.SelectedSegment;
      this.setSelectedChartColumn(selectedSegment, true);
      //this.model.trigger("segmentDeselected", selectedSegment);      
    },

    // Returns the FusionCharts component name
    // This function is overridden in each single Chart component
    // this exception message is never displayed to application developer or end user since it is internal to the Charting components 
    getChartComponentName: function () {
      throw { name: "Error", message: "GetChartComponentName is not overridden" };
    },

    getDataType: function (dataMapping) {
      if (!dataMapping.categoryChartField.dataField) {
        throw { name: "Error", message: this.chartDictionary.CategoryChartField };
      }

      if (!dataMapping.valueChartFields.length) {
        throw { name: "Error", message: this.chartDictionary.ValueChartFields };
      }

      if (dataMapping.regionAlias) {
        return "Mapping";
      }

      var valueColumsCount = dataMapping.valueChartFields.length;

      if (valueColumsCount > 1) {
        return "MultiAxis";
      }

      if (!dataMapping.seriesChartField.dataField) {
        return "SingleSeries";
      }

      return "MultiSeries";
    },

    setDictionary: function() {
      this.chartDictionary.NoDataToDisplay = this.$el.data("sc-nodatatodisplay");
      var propertyNotDefined = this.$el.data("sc-propertynotdefined");
      this.chartDictionary.CategoryChartField = propertyNotDefined.replace("{0}", "CategoryChartField");
      this.chartDictionary.ValueChartFields = propertyNotDefined.replace("{0}", "ValueChartFields");
      this.chartDictionary.SeriesChartField = propertyNotDefined.replace("{0}", "SeriesChartField");
      this.chartDictionary.Categories = propertyNotDefined.replace("{0}", "Categories");
      this.chartDictionary.ValueChartField = propertyNotDefined.replace("{0}", "ValueChartField");
      this.chartDictionary.DataField = propertyNotDefined.replace("{0}", "DataField");
    }
  });
});