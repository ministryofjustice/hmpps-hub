require.config({
  paths: {
    chartAttributes: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/ChartAttributes",
    chartPalette: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/ChartPalette",   
    chartTemplateProperties: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/ChartTemplateProperties",
    fusionCharts: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/FusionCharts/fusioncharts",
    fusionChartsAdapter: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsAdapter",
    chartsCss: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/Charts"
  }
});

define(["sitecore", "fusionChartsAdapter", "chartAttributes", "chartPalette", "chartTemplateProperties", "fusionCharts", "css!chartsCss"], function (_sc, chartAdapter, chartAttributes, chartPalette) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsBaseComponent",
    base: "ChartTemplateProperties",
    selector: ".sc-FusionChartsBaseComponent",
    chartsCreated: false,
    segmentWasClicked: false,
    initialize: function () {
      this._super();
    },
    
    Charting: {
      SelectedSegment: {
        id: null,
        action: null,
        dataIndex: null,
        seriesIndex: null,
        dataObject: null
      }
    },

    // Creates the chart with data, and adds it to the webpage
    initializeChart: function (useStandardColors) {
      "use strict";

      var self = this;

      $(window).resize(function () {
        self.setProgressIndicatorPosition();
      });

      this.chartId = _.uniqueId("chart_id");
      this.$el.attr("id", this.chartId).css("overflow", "hidden");
      this.model.set("chartControls", []);
      this.model.on("change:data", function () {      
        try {          
          this.chartProperties.dataType = this.getDataType(this.chartProperties.dataMapping);
          this.chartProperties.componentName = this.getChartComponentName(this.chartProperties);
          this.setChartData(useStandardColors);
        } catch (e) {
          this.handleError(e);
        }
      }, this);

      this.model.set("chartProperties", this.chartProperties);

      FusionCharts.setCurrentRenderer('JavaScript');

      this.setProgressIndicatorPosition();
    },

    handleError: function (errorObject) {
      this.model.trigger("error", errorObject);
    },

    // Returns the entire palette depending on dataType
    getChartPalette: function (dataType, data, useStandardColors) {
      "use strict";

      var paletteCreator = {
        multiaxis: function (context, data) {
          return context.getChartPaletteColors(context.chartProperties.dataMapping.valueChartFields, "dataField");
        },
        multiseries: function (context, data) {
          return context.getChartPaletteColors(data.dataset, "seriesname");
        },
        singleseries: function (context) {
          if (useStandardColors) {
            return chartPalette.standardColors.join(",");
          }

          return context.getChartPaletteColor(context.chartProperties.dataMapping.valueChartFields[0].dataField, 0);
        },
        mapping: function (context) {
          return null;
        }
      };

      return paletteCreator[dataType.toLowerCase()](this, data);
    },

    // Returns the palette string
    getChartPaletteColors: function (arr, objectName) {
      "use strict";

      var arrLength = arr.length,
        colorsArray = [];

      for (var i = 0; i < arrLength; i++) {
        var color = this.getChartPaletteColor(arr[i][objectName], i);
        colorsArray.push(color);
      }

      return colorsArray.join(",");
    },

    // Returns a color
    getChartPaletteColor: function (name, index) {
      "use strict";

      index = index || 0;

      var facetColor = chartPalette.facetColors[name.toLowerCase()];
      if (!facetColor) {
        return chartPalette.standardColors[index % chartPalette.standardColors.length];
      } else {
        return facetColor;
      }
    },

    // Sets dage and renders the chart
    setChartData: function (useStandardColors) {
      "use strict";

      var self = this,
        data = this.model.get("data");

      if (data) {
        //self.start = new Date().getTime();
        var datasetLength = data.dataset.length,
          i = 0;

        this.chartId = _.uniqueId("chart_id");
        this.$el.attr("id", this.chartId);

        if (datasetLength > 1) {
          this.$el.width("auto").height("auto");
        }

        for (i; i < datasetLength; i += 1) {
          var jsonData = datasetLength > 1 ? this.cloneJsonData(data) : data;

          this.createChartControl(i, jsonData, this.chartProperties.appearance.singleChartWidth, this.chartProperties.appearance.singleChartHeight, useStandardColors);          
        }

        this.chartsCreated = true;
      }
    },

    chartClicked: function (id) {
      self.model.trigger("chartClicked", id);
    },

    setChartEvents: function (chartControl) {
      var self = this;
      
      chartControl.addEventListener("linkClicked", function () {         
          self.Charting.SelectedSegment = JSON.parse(JSON.stringify(_sc.Charting.SelectedSegment));
          self.segmentWasClicked = true;
          self.segmentClicked(self.Charting.SelectedSegment);
      });

      chartControl.addEventListener("DrawComplete", function (eventObject, argumentsObject) {
        
        self.toggleProgressIndicator(false);
        if (self.segmentWasClicked) {
          self.triggerSegmentSelectedEvent(self.Charting.SelectedSegment);
        }
        self.segmentWasClicked = false;
      });
    },

    // clone the Json data in order to be able to use it for multiple
    cloneJsonData: function (jsonData) {
      return JSON.parse(JSON.stringify(jsonData));
    },

    // Creates the chart control, sets the data, and render it to the page
    createChartControl: function (datasetIndex, jsonData, chartWidth, chartHeight, useStandardColors) {
      var self = this,
        chartId = _.uniqueId("chart_id"),
        chartContainer = $("<div />").attr("id", chartId).addClass("sc-charts-pull-left"),
        data = null;

      if (!this.chartsCreated) {
        chartContainer.width(chartWidth).height(chartHeight);
        chartContainer.appendTo(this.$el);
      }

      var chartControl = null;
      var chartControls = this.model.get("chartControls");

      if (!this.chartsCreated) {
        chartControl = new FusionCharts("/sitecore/shell/client/SpeakCharting/Assets/lib/deps/FusionCharts/" + this.chartProperties.componentName, this.chartProperties.componentName + chartId, "100%", "100%", "0");
     
        chartControls.push(chartControl);
      } else {
        chartControl = chartControls[datasetIndex];
      }

      if (!this.chartsCreated) {
        this.setChartEvents(chartControl);
      }

      this.setChartControls(chartControls);

      try {
        data = chartAdapter.convert(datasetIndex, this.chartProperties.dataType, jsonData, this.chartProperties.dataMapping, 10, self.chartDictionary, this.chartProperties.appearance.disableSelection);
        if (data) {          
          
          chartControl.setJSONData(data);
          this.setChartAttributes(data, useStandardColors, chartControl);
          chartControl.adaptedData = this.cloneJsonData(chartControl.getJSONData());
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        chartControl.configure({
          "ChartNoDataText": self.chartDictionary["NoDataToDisplay"],
          "LoadDataErrorText": "",
          "ParsingDataText": "",
          "RenderingChartText": "",
          "RetrievingDataText": "",
        });

        if (!this.chartsCreated) {
          chartControl.render(chartId);
        }
        this.model.set("convertedData", data);
      }
    },

    setChartControls: function (chartControls) {
      this.model.set("chartControls", chartControls);
      this.model.trigger("change:chartControls");
    },

    // Sets the attributes for the Fusion Chart rendering
    setChartAttributes: function (data, useStandardColors, chartControl) {
      "use strict";
      this.setDefaultChartAttributes(data, useStandardColors, chartControl);
    },


    // Sets the attributes for the Fusion Chart rendering
    setDefaultChartAttributes: function (data, useStandardColors, chartControl) {
      "use strict";

      var scrollingCharts = ["ScrollColumn2D", "ScrollLine2D", "ScrollArea2D", "ScrollStackedColumn2D", "ScrollCombi2D", "ScrollCombiDY2D"];

      chartControl.setChartAttribute(chartAttributes);
      chartControl.setChartAttribute({
        "xaxisname": this.chartProperties.dataMapping.categoryChartField.headerText,
        "yaxisname": this.chartProperties.dataMapping.valueChartFields.length > 1 ? null : this.chartProperties.dataMapping.valueChartFields[0].headerText,

        "palettecolors": this.getChartPalette(this.chartProperties.dataType, data, useStandardColors),

        // Sitecore properties
        "showValues": this.chartProperties.appearance.showValues,
        "drawanchors": this.chartProperties.appearance.showPointMarker,        
        "showLegend": this.chartProperties.appearance.showLegend,
        //showAxis hide labes, Yvalues, border
        "showyaxisvalues": this.chartProperties.appearance.showAxis,
        "showLabels": this.chartProperties.appearance.showAxis,
        "divLineAlpha": this.chartProperties.appearance.showAxis ? 30 : 0,
        "animation": this.chartProperties.appearance.enableAnimation ?  1 : 0
    });

      // Radar chart should have plot border
      if (this.chartProperties.componentName === "Radar") {
        chartControl.setChartAttribute({
          "showplotborder": 1
        });       
      }

      if (scrollingCharts.indexOf(this.chartProperties.componentName) !== -1) {
        chartControl.setChartAttribute({
          "numVisiblePlot": this.chartProperties.appearance.visibleCategoriesRange
        });
      }

      // These 3 methods seems not to work when the chart scrolling is not enabled.
      // TODO: Get working solution from Nerva project.

      if (this.chartProperties.dataType === "SingleSeries" || this.chartProperties.dataType === "MultiSeries" || this.chartProperties.dataType === "Mapping") {
        var valueChartField = this.chartProperties.dataMapping.valueChartFields[0];

        this.setChartAffixes(valueChartField, chartControl);
        this.setChartNumberScale(valueChartField, chartControl);
        this.setChartSeparators(valueChartField, chartControl);
      }
    },

    // Set prefix and suffix for the chart
    setChartAffixes: function (valueChartField, chartControl) {
      var prefix = valueChartField.prefix,
        suffix = valueChartField.suffix;

      if (suffix) {
        chartControl.setChartAttribute("numbersuffix", suffix);
      }

      if (prefix) {
        chartControl.setChartAttribute("numberprefix", prefix);
      }
    },

    // Sets the number scale values and units for the chart
    setChartNumberScale: function (valueChartField, chartControl) {
      if (valueChartField.numberScale) {
        var scaleValue = valueChartField.numberScale.scaleValue,
          scaleUnit = valueChartField.numberScale.scaleUnit;          

        if (scaleValue) {
          chartControl.setChartAttribute("numberScaleValue", scaleValue.replace(/"/g, ""));
        }

        if (scaleUnit) {
          chartControl.setChartAttribute("numberScaleUnit", scaleUnit.replace(/"/g, ""));
        }

        if (scaleValue || scaleUnit) {
          chartControl.setChartAttribute("scaleRecursively", valueChartField.scaleRecursively ? 1:0);
        }
      }
    },

    // Sets the chart separators for the chart
    setChartSeparators: function (valueChartField, chartControl) {
      chartControl.setChartAttribute("decimalSeparator", valueChartField.decimalSeparator);
      chartControl.setChartAttribute("thousandSeparator", valueChartField.thousandSeparator);
    },

    setProgressIndicatorPosition: function (pi) {
      var piComponent = this.app[this.$el.attr("data-sc-id") + "ProgressIndicator"];
      if (piComponent) {
        piComponent.viewModel._updateModel();
      }
    },

    toggleProgressIndicator: function (status) {
      var pi = $('[data-sc-id="' + this.$el.attr("data-sc-id") + 'ProgressIndicator"]');
      if (this.model.get("isVisible") === false) {
        status = false;
      }

      if (status) {
        this.setProgressIndicatorPosition(pi);
      }

      if (pi) {
        pi.toggle(status);
      }
    },

    getSelectedColor: function() {
      return chartPalette.selectedSegmentColor;
    },

    // <summary>
    // Change color lumiosity.
    // <param name="hex">The current color hex value.</param>
    // <param name="lum">The new luminosity value.</param>
    // <returns>The new color.</returns>
    // </summary>    
    colorLuminosity: function (hexStrings, lum, index) {
      
      index = index || 0;

      var hex = hexStrings.split(",")[index];

      // validate hex string
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      lum = lum || 0;

      // convert to decimal and change luminosity
      var rgb = "#", c, i;
      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
      }

      return rgb;
    },

    // <summary>
    // Set selected chart column.
    // <param name="selectedSegment">The current chart selected segment.</param>
    // <param name="isPaging">The isPaging flag. If true sets the selectedSegment button.</param>
    // <param name="deselect">The deselect option. If true the button cahrt segment should be deselected.</param>
    // </summary>    
    setSelectedChartColumn: function (selectedSegment, deselect) {
      if (!selectedSegment.id) {
        return;
      }

      var chartControl = this.model.get("chartControls")[0],
        chartControlJsonData = this.cloneJsonData(chartControl.adaptedData),
        chartControlData = chartControlJsonData.data;
      
      if (!chartControlData) {                  
        this.changeMultiSeriesDatasetColors(selectedSegment, chartControlJsonData, deselect); 
      } else {
        this.changeDatasetColors(selectedSegment, chartControlJsonData, chartControlData, deselect);
      }
      chartControl.setChartAttribute({ "animation": 0 });
      chartControl.setJSONData(chartControlJsonData);      
    },

    changeMultiSeriesDatasetColors: function (selectedSegment, chartControlJsonData, deselect) {
      var selectedCategoryIndex = -1,
          i;
            
      for (i = 0; i < chartControlJsonData.categories[0].category.length; i++) {
        if (chartControlJsonData.categories[0].category[i].label === selectedSegment.id) {
          selectedCategoryIndex = i;
          break;
        }
      }
      
      if (!deselect && selectedCategoryIndex > -1) {        
        chartControlJsonData.dataset[selectedSegment.seriesIndex].data[selectedCategoryIndex].color = this.getSelectedColor();
      }
                            
    },

    changeDatasetColors: function (selectedSegment, chartControlJsonData, chartControlData, deselect) {

      if (!deselect) {
        var selectedDataItems = chartControlData.filter(function (item) { return (item.label == selectedSegment.id); });
        var self = this;
        if (selectedDataItems.length > 0) {
          selectedDataItems.forEach(function (dataItem) {
            dataItem.color = self.getSelectedColor(); //self.colorLuminosity(chartControlJsonData.chart.palettecolors, -0.6, selectedSegment.seriesIndex);
          });
        }
      }
    },
    // <summary>
    // Resets the SelectedSegment object.    
    // </summary>    
    resetSelectedSegment: function () {
      this.Charting.SelectedSegment = {
        id: null,
        dataIndex: null,
        seriesIndex: null,
        action: null,
        dataObject: null
      };
    }
  });
});