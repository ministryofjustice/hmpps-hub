(function (speak) {

  define([], function () {
    return {
      name: "ChartTemplateProperties",
      data: null,
      chartProperties: {},
      lastSelectedId: null,
      lastSelectedSeriesIndex: null,
      propertySeperator: "|",
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
      initializeChartTemplateProperties: function () {
        this.setDictionary();

        this.chartProperties = {
          appearance: {
            showPointMarker: this.ShowPointMarker,
            showValues: this.ShowValues,
            showLegend: this.ShowLegend,
            showAxis: this.ShowAxis,
            singleChartHeight: this.SingleChartHeight,
            singleChartWidth: this.SingleChartWidth,
            visibleCategoriesRange: this.VisibleCategoriesRange,
            stackSeries: this.StackSeries,
            enableAnimation: this.EnableAnimation,
            disableSelection: this.DisableSelection
          },
          dataMapping: {
            categoryChartField: this.parseJsonData(this.CategoryChartField),
            categoryFilter: this.splitPipeSeparatedList(this.CategoryFilter),
            valueChartFields: this.parseJsonData(this.ValueChartFields),
            seriesChartField: this.parseJsonData(this.SeriesChartField),
            seriesFilter: this.splitPipeSeparatedList(this.SeriesFilter)
          },
          dataType: null,
          componentName: null
        };

        _.extend(speak, { Charting: this.Charting });
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
        } else {
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
          this.trigger("segmentClicked", selectedSegment);
          this.trigger("segmentDeselected", selectedSegment);
          return;
        }

        this.trigger("segmentClicked", selectedSegment);
        this.trigger("segmentSelected", selectedSegment);
      },

      // <summary>
      // DeselectSegment handler.    
      // </summary>    
      deselectSegment: function () {
        this.lastSelectedId = null;
        this.lastSelectedSeriesIndex = null;
        var selectedSegment = this.Charting.SelectedSegment;
        this.setSelectedChartColumn(selectedSegment, true);
      },

      // Returns the FusionCharts component name
      // This function is overridden in each single Chart component
      // this exception message is never displayed to application developer or end user since it is internal to the Charting components 
      getChartComponentName: function () {
        throw { name: "Error", message: "GetChartComponentName is not overridden" };
      },

      getDataType: function (dataMapping) {
        if (!dataMapping.categoryChartField.dataField) {
          throw { name: "Error", message: this.chartDictionary["CategoryChartField"] };
        }

        if (!dataMapping.valueChartFields.length) {
          throw { name: "Error", message: this.chartDictionary["ValueChartFields"] };
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

      setDictionary: function () {
        this.chartDictionary.NoDataToDisplay = this.NoDataToDisplay;
        var propertyNotDefined = this.PropertyNotDefined;
        this.chartDictionary.CategoryChartField = propertyNotDefined.replace("{0}", "CategoryChartField");
        this.chartDictionary.ValueChartFields = propertyNotDefined.replace("{0}", "ValueChartFields");
        this.chartDictionary.SeriesChartField = propertyNotDefined.replace("{0}", "SeriesChartField");
        this.chartDictionary.Categories = propertyNotDefined.replace("{0}", "Categories");
        this.chartDictionary.ValueChartField = propertyNotDefined.replace("{0}", "ValueChartField");
        this.chartDictionary.DataField = propertyNotDefined.replace("{0}", "DataField");
      },

      parseJsonData: function (data) {
        if (data) {
          return JSON.parse(data);
        }

        return {};
      },

      splitPipeSeparatedList: function (data) {
        "use strict";
        return data ? this.removeCurlyBrackets(data).split(this.propertySeperator) : null;
      },
      
      removeCurlyBrackets: function (str) {
      "use strict";
      return str.replace("{", "").replace("}", "");
    },
    };
  });
})(Sitecore.Speak);