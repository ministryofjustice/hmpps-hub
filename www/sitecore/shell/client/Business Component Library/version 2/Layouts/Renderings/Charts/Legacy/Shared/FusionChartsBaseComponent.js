(function (speak) {

  define(["sitecore", "bclFusionChartsAdapter", "bclChartAttributes", "bclChartPalette", "bclChartTemplateProperties", "fusionCharts"], function (_sc, chartAdapter, chartAttributes, chartPalette, chartTemplateProperties) {
    return speak.extend(chartTemplateProperties, {
      name: "FusionChartsBaseComponent",
      chartsCreated: false,
      segmentWasClicked: false,
      initializeFusionChartsBaseComponent: function () {
        this.initializeChartTemplateProperties();
        this.$el = $(this.el);
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

        this.chartId = _.uniqueId("chart_id");
        this.$el.attr("id", this.chartId).css("overflow", "hidden");
        this.ChartControls = [];
        this.on("change:DynamicData", function () {
          try {
            this.chartProperties.dataType = this.getDataType(this.chartProperties.dataMapping);
            this.chartProperties.componentName = this.getChartComponentName(this.chartProperties);
            this.setChartData(useStandardColors);
          } catch (e) {
            this.handleError(e);
          }
        }, this);

        FusionCharts.setCurrentRenderer('JavaScript');

      },

      handleError: function (errorObject) {
        this.trigger("error", errorObject);
        console.log(errorObject);
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

      resetCharts: function() {
        this.chartsCreated = false;
        for (var index = 0; index < this.ChartControls.length; index++) {
          var chartId = this.ChartControls[index].id;
          var chartContainer = $(FusionCharts.getObjectReference(chartId)).parent();                   
          FusionCharts(chartId).dispose();
          chartContainer.remove();
        }
        this.ChartControls = [];
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
          data = this.DynamicData;

        if (data) {          
          var datasetLength = data.dataset.length,
            i = 0;

          this.chartId = _.uniqueId("chart_id");
          this.$el.attr("id", this.chartId);

          if (datasetLength > 1) {
            this.$el.width("auto").height("auto");
          }

          if (this.chartsCreated) {
            if (this.ChartControls.length != datasetLength) {         
              this.resetCharts();              
            }
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
        var chartControls = this.ChartControls;

        if (!this.chartsCreated) {
          chartControl = new FusionCharts("/sitecore/shell/client/Business Component Library/version 2/Assets/lib/deps/FusionCharts/" + this.chartProperties.componentName, this.chartProperties.componentName + chartId, "100%", "100%", "0");

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
          this.ConvertedData = data;
        }
      },

      setChartControls: function (chartControls) {
        this.ChartControls = chartControls;
        this.trigger("change:chartControls");
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
          "showvalues": this.chartProperties.appearance.showValues ? 1 : 0,
          "drawanchors": this.chartProperties.appearance.showPointMarker ? 1 : 0,
          "showlegend": this.chartProperties.appearance.showLegend ? 1 : 0,
          //showAxis hide labes, Yvalues, border
          "showyaxisvalues": this.chartProperties.appearance.showAxis ? 1 : 0,
          "showlabels": this.chartProperties.appearance.showAxis ? 1 : 0,
          "divlinealpha": this.chartProperties.appearance.showAxis ? 30 : 0,
          "animation": this.chartProperties.appearance.enableAnimation ? 1 : 0
        });

        // Radar chart should have plot border
        if (this.chartProperties.componentName === "Radar") {
          chartControl.setChartAttribute({
            "showplotborder": 1
          });
        }

        if (scrollingCharts.indexOf(this.chartProperties.componentName) !== -1) {
          chartControl.setChartAttribute({
            "numvisibleplot": this.chartProperties.appearance.visibleCategoriesRange
          });
        }

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
            chartControl.setChartAttribute("numberscalevalue", scaleValue.replace(/"/g, ""));
          }

          if (scaleUnit) {
            chartControl.setChartAttribute("numberscaleunit", scaleUnit.replace(/"/g, ""));
          }

          if (scaleValue || scaleUnit) {
            chartControl.setChartAttribute("scalerecursively", valueChartField.scaleRecursively ? 1 : 0);
          }
        }
      },

      // Sets the chart separators for the chart
      setChartSeparators: function (valueChartField, chartControl) {
        chartControl.setChartAttribute("decimalseparator", valueChartField.decimalSeparator);
        chartControl.setChartAttribute("thousandseparator", valueChartField.thousandSeparator);
      },

      toggleProgressIndicator: function (status) {

        if (this.IsVisible === false) {
          status = false;
        }

        this.$el.closest(".sc-progressindicatorpanel").toggleClass("sc-isbusy", status);
      },

      getSelectedColor: function () {
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

        var chartControl = this.ChartControls[0],
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

})(Sitecore.Speak);