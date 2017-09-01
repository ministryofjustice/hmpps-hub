(function (models) {
  Sitecore.Speak.D3.components.Doughnut = (
      function () {
        /*  The initialize function receives the options object argument.
        *  options {           
        *      el: the component element;
        *      xAxisLabel: the x axis label;
        *      yAxisLabel: the y axis label;
        *      legendMode: the legend mode (ExclusiveCheck|MultipleCheck);            
        *      isTitleVisible: defines whether the title is visible;         
        *      isLegendHidden: defines whether the legend is hidden;            
        *      itemClicked: the item clicked havent handler function;
        *      seriesDefinitions: the list of SeriesDefinition items;        
        *      isSortedByValue: defines whether the values are sorted;
        *      maxNumberOfSegments: the maximum number of pie segments visible, the rest is grouped into 'Other';
        *      otherText: the translated 'Other' text;            
        *      isValueConvertedToPercent: defines whether the valuea are converted to percent;            
        *      allCategoriesLabel: 'All categories' label shown inside the doughnut;
        *      valueDescriptionLabel: 'values description' label shown inside the doughnut;
        *      isSegmentTooltipVisible: defines whether the tooltip over segments is visible;
        *      categoryInformation: the category information type (Legend|Callout Labels|None);            
        *      isCalloutLabelWithValue: defines whether the callout labels show values;
        *      isCalloutValueConvertedToPercent: defines whether the callout values are converted to percent;
        *      isSegmentSelectionDisabled: defines whether the segments are selectable;
        *   }
        */       

        var Doughnut = function (options) {
          this.initialize(options);
        };

        $.fn.d3Click = function () {
          this.each(function (i, e) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

            e.dispatchEvent(evt);
          });
        };

        /**
        * Handles the item click.
        */
        var itemClicked = function (d) {
          var item = new models.data.selectedDataItem(d.data.x, d.data.x, d.data.y, d);
          this.ItemClicked(item);
        };

        /**
        * Reload legend state
        */
        var reloadLegendState = function () {
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.nvd3Legend.reloadLegendState(
              this.ChartProperties,
              models.nvd3Legend.getLegendContainerElement(this.ChartProperties.componentElement));
        };

        /**
        * Calculates the value.
        * @param {bool} isValueConvertedToPercent - Defines whether ther value should be converted to percent.  
        * @param {number} number - The number to calculate.  
        * @param {number} percentage - The percentage value.  
        * @param {function} formatter - The fornatter function.                                      
        */
        var calculateValue = function (isValueConvertedToPercent, number, percentage, formatter) {
          return isValueConvertedToPercent ? (models.nvd3Axis.calculatedPercentageFormatter(percentage)) : formatter(number);
        }

        /**
        * Sets the selected data item.
        */
        Doughnut.prototype.selectDataItem = function (index) {
          if (this.ChartProperties.legendMode === models.constants.legendMode.exclusiveCheck) {
            setTimeout(function () {
              var legendElement = $("#svg-legend-" + this.ChartProperties.componentElement.attr("data-sc-id") + ".sc-d3-chart-legend g.nv-series rect[sc-series-index='" + index + "']");
              if (legendElement) {
                legendElement.d3Click();
              }
            }.bind(this), models.constants.animations.verySlow);
          }
        };

        /**
        * Handles resize with debounce.
        */
        Doughnut.prototype.resizeDebounceHandler = function () {
          if (!this.ChartProperties.chartData) {
            return;
          }

          models.nvd3Legend.ellipseVerticalLegend(
              this.ChartProperties.componentElement,
              this.ChartProperties.sizes.legendWidth);

          if (!this.IsLegendHidden) {
            reloadLegendState.call(this);
          }
          if (this.IsCalloutVisible) {
            models.nvd3Axis.removeDoughnutLabels(this.ChartProperties.svgElement);
            models.nvd3Axis.createDoughnutCalloutLabels(this.ChartProperties, this.IsCalloutLabelWithValue, this.IsCalloutValueConvertedToPercent);
          }

          if (this.ChartProperties.selectedIndex >= 0) {          
            if (this.ChartProperties.chartData[this.ChartProperties.selectedIndex].legendState === models.constants.legendState.checked) {
              models.nvd3VisualizationManager.visualizeInsideLineElements(
                this.ChartProperties.svgElement,
                models.constants.visualizationMode.standard,
                this.ChartProperties.selectedIndex,
                this.ChartProperties.palette,
                this.ChartProperties.sizes);
            }                    
            models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].x, calculateValue(this.IsValueConvertedToPercent, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].y, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].percentage, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
          } else {
            models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.AllCategoriesLabel, calculateValue(this.IsValueConvertedToPercent, this.Total, this.Total, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
          }
          models.nvd3Tooltip.removeTooltipOnResize();
          models.utils.setChartAnimation(this.ChartProperties.chartElement, true);          
        }

        /**
        * Initializes the chart.
        */
        Doughnut.prototype.initChart = function () {
          var dataScId = this.ChartProperties.componentElement.attr(models.constants.idSelector);
          var chartId = "doughnut-" + dataScId;
          if (!this.ChartProperties.chartElement) {
            this.ChartProperties.chartElement = nv.models.pieChart()
                 .options({
                   id: chartId,
                   transitionDuration: models.constants.animations.slow,
                   margin: this.ChartProperties.margin,
                   showLegend: false,
                   labelsOutside: false,
                   labelType: "value",
                   growOnHover: false,
                   donut: true,
                   donutRatio: models.constants.doughnutRadio,
                   padAngle: 0.0,
                   title: "",
                   showLabels: false
                 });

            // TODO: replace this with formatting when impleneted
            this.ChartProperties.chartElement.valueFormat(d3.format("d"));
            this.ChartProperties.chartElement.tooltip.enabled(this.IsSegmentTooltipVisible);
            this.ChartProperties.chartElement.pie.dispatch.on("elementMouseover.recolor", function (e) {
              var elements = this.ChartProperties.svgElement.select("g.nv-pieWrap .nv-pie .nv-slice:nth-child(" + (e.index + 1) + ") path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
              if (!this.IsSegmentSelectionDisabled) {
                elements.style("cursor", "pointer");
              }
              models.nvd3VisualizationManager.setPathElementsVisualization(this.ChartProperties.svgElement, elements, e.index, models.constants.visualizationMode.emphasized, models.constants.chartType.doughnut);
              models.nvd3VisualizationManager.visualizeLabelLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.emphasized, e.index, this.ChartProperties.palette);
              models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, e.data.x, calculateValue(this.IsValueConvertedToPercent, e.data.y, e.data.percentage, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
              models.nvd3VisualizationManager.visualizeInsideLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.emphasized, e.index, this.ChartProperties.palette, this.ChartProperties.sizes);
            }.bind(this));           

            this.ChartProperties.chartElement.pie.dispatch.on("elementMouseout.recolor", function (e) {
              var visualizationMode = models.constants.visualizationMode.standard;
              if (this.ChartProperties.chartData[e.index].legendState === models.constants.legendState.disengaged) {
                visualizationMode = models.constants.visualizationMode.deemphasized;
              }
              var elements = this.ChartProperties.svgElement.select("g.nv-pieWrap .nv-pie .nv-slice:nth-child(" + (e.index + 1) + ") path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");

              models.nvd3VisualizationManager.setPathElementsVisualization(this.ChartProperties.svgElement, elements, e.index, visualizationMode, models.constants.chartType.doughnut);
              models.nvd3VisualizationManager.visualizeLabelLineElements(this.ChartProperties.svgElement, visualizationMode, e.index, this.ChartProperties.palette);

              if (this.ChartProperties.selectedIndex >= 0) {
                if (e.index !== this.ChartProperties.selectedIndex) {
                  models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].x, calculateValue(this.IsValueConvertedToPercent, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].y, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].percentage, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
                }
              } else {
                models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.AllCategoriesLabel, calculateValue(this.IsValueConvertedToPercent, this.Total, this.Total, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
              }

              models.nvd3VisualizationManager.visualizeInsideLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.notVisible, e.index, this.ChartProperties.palette, this.ChartProperties.sizes);

              if (this.ChartProperties.selectedIndex >= 0) {
                models.nvd3VisualizationManager.visualizeInsideLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.standard, this.ChartProperties.selectedIndex, this.ChartProperties.palette, this.ChartProperties.sizes);
              }
            }.bind(this));
            this.ChartProperties.chartElement.pie.dispatch.on("elementClick", function (d) {
              itemClicked.call(this, d);
            }.bind(this));
            this.ChartProperties.chartElement.legend.dispatch.legendClick = function (d, i) {
              this.Total = models.data.getVisibleSeriesSum(this.ChartProperties.chartData, this.IsValueConvertedToPercent);

              if (this.ChartProperties.selectedIndex >= 0) {
                models.nvd3VisualizationManager.visualizeInsideLineElements(
                    this.ChartProperties.svgElement,
                    models.constants.visualizationMode.standard,
                    this.ChartProperties.selectedIndex,
                    this.ChartProperties.palette,
                    this.ChartProperties.sizes);
                                 
                  models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].x, calculateValue(this.IsValueConvertedToPercent, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].y, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].percentage, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
                
              } else {
                 models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.AllCategoriesLabel, calculateValue(this.IsValueConvertedToPercent, this.Total, this.Total, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
              }
            }.bind(this);
            this.ChartProperties.chartElement.legend.dispatch.legendMouseover = function (d, i) {
              models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, d.x, calculateValue(this.IsValueConvertedToPercent, d.y, d.percentage, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
              models.nvd3VisualizationManager.visualizeInsideLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.emphasized, i, this.ChartProperties.palette, this.ChartProperties.sizes);
            }.bind(this);
            this.ChartProperties.chartElement.legend.dispatch.legendMouseout = function (d, i) {

              if (this.ChartProperties.selectedIndex >= 0) {
                if (i !== this.ChartProperties.selectedIndex) {
                  models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].x, calculateValue(this.IsValueConvertedToPercent, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].y, this.ChartProperties.chartData[this.ChartProperties.selectedIndex].percentage, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
                }
              } else {
                models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.AllCategoriesLabel, calculateValue(this.IsValueConvertedToPercent, this.Total, this.Total, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);
              }

              models.nvd3VisualizationManager.visualizeInsideLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.notVisible, i, this.ChartProperties.palette, this.ChartProperties.sizes);
              if (this.ChartProperties.selectedIndex >= 0) {
                models.nvd3VisualizationManager.visualizeInsideLineElements(this.ChartProperties.svgElement, models.constants.visualizationMode.standard, this.ChartProperties.selectedIndex, this.ChartProperties.palette, this.ChartProperties.sizes);
              }
            }.bind(this);
          }
        };

        /**
        * Handles the resize event.
        */
        Doughnut.prototype.resize = function () {
          if (this.ChartProperties.chartData.length === 0) {            
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          models.utils.setChartAnimation(this.ChartProperties.chartElement, false);
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          if (this.IsCalloutVisible) {
            models.nvd3Axis.removeDoughnutLabels(this.ChartProperties.svgElement);
          }
          models.nvd3VisualizationManager.removeAllInsideLines(this.ChartProperties.svgElement);
          models.utils.setCanvasHeight(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, false, false);
          var chartHeight = models.utils.getChartHeight(this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, false, false);
          var legendWidth = models.nvd3Legend.createVerticalLegend(this.ChartProperties, chartHeight);
          this.ChartProperties.sizes = models.utils.setPieSizes(this.ChartProperties.componentElement, chartHeight, legendWidth, this.IsCalloutVisible);
          this.ChartProperties.chartElement.update();          
          this.resizeDebounceHandler();
        }

        /**
        * Binds data into the chart.                 
        */
        Doughnut.prototype.bindData = function (data, isAnimationEnabled) {
          if (!models.nvd3Axis.validateNoData(data, this.ChartProperties, this.NoDataToDisplay, this.IsTitleVisible, this.IsSegmentTooltipVisible)) {
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          this.ChartProperties.seriesDefinitions = models.data.initializeSeriesDefinitions(this.SeriesDefinitions);
          var initializedData = models.data.initData(data, this.ChartProperties.seriesDefinitions, false, this.ChartProperties.componentElement.attr(models.constants.idSelector), this.ChartProperties.chartType, this.ChartProperties.metricsFormat);
          if (initializedData === null) {
            models.nvd3Axis.validateNoData([], this.ChartProperties, this.NoDataToDisplay, this.IsTitleVisible, true);
            return;
          }
          this.ChartProperties.chartData = initializedData.data;
          this.ChartProperties.seriesDefinitions = initializedData.seriesDefinitions;
          if (this.IsSortedByValue) {
            this.ChartProperties.chartData = models.data.sortByValue(this.ChartProperties.chartData);
          }

          if (this.MaxNumberOfSegments > 0 && this.MaxNumberOfSegments < this.ChartProperties.chartData.length) {
            this.ChartProperties.chartData = models.data.groupOtherSegment(this.ChartProperties.chartData, this.MaxNumberOfSegments, this.OtherText);
          }

          models.data.setSeriesPercentages(this.ChartProperties.chartData);
          models.nvd3Axis.formatPieValueLabels(this.ChartProperties);
          this.ChartProperties.numberOfItems = this.ChartProperties.chartData.length;
          this.ChartProperties.palette = models.colors.getPalette(this.IsColorPaletteShaded, this.ChartProperties.numberOfItems, this.MaxNumberOfSegments);
          this.ChartProperties.chartElement.color(this.ChartProperties.palette);
          var chartHeight = models.utils.getChartHeight(this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, false, false);          
          models.utils.setChartAnimation(this.ChartProperties.chartElement, isAnimationEnabled);
          nv.addGraph(function () {
            d3.select(this.ChartProperties.canvasId)
              .style({ "height": chartHeight + "px" })
              .datum(this.ChartProperties.chartData)
              .call(this.ChartProperties.chartElement);
            this.ChartProperties.svgElement = d3.select(this.ChartProperties.canvasId);
            nv.utils.windowResize(this.resize.bind(this));
          }.bind(this), function () {
            models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
            models.nvd3Axis.removeDoughnutLabels(this.ChartProperties.svgElement);
            var legendWidth = models.nvd3Legend.createVerticalLegend(this.ChartProperties, chartHeight);
            this.ChartProperties.sizes = models.utils.setPieSizes(this.ChartProperties.componentElement, chartHeight, legendWidth, this.IsCalloutVisible);
            models.nvd3Legend.ellipseVerticalLegend(this.ChartProperties.componentElement, this.ChartProperties.sizes.legendWidth);
            if (this.IsSegmentTooltipVisible) {
              models.nvd3Tooltip.setTooltip(this.ChartProperties, false, false);
            }
            this.ChartProperties.chartElement.update();
            this.Total = models.data.getVisibleSeriesSum(this.ChartProperties.chartData, this.IsValueConvertedToPercent);
            models.nvd3Axis.setDoughnutInternalLabels(this.ChartProperties.svgElement, this.AllCategoriesLabel, calculateValue(this.IsValueConvertedToPercent, this.Total, this.Total, this.ChartProperties.valueFormatter), this.ValueDescriptionLabel, this.ChartProperties.sizes);

            if (this.IsCalloutVisible) {
              setTimeout(function () {
                models.nvd3Axis.createDoughnutCalloutLabels(this.ChartProperties, this.IsCalloutLabelWithValue, this.IsCalloutValueConvertedToPercent);
              }.bind(this), models.constants.animations.medium);
            }

            models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
          }.bind(this));
        }

        Doughnut.prototype.initialize = function (options) {
          this.el = options.el;
          this.LegendMode = options.legendMode;
          this.IsTitleVisible = options.isTitleVisible;
          this.IsLegendHidden = options.isLegendHidden;
          this.IsColorPaletteShaded = options.isColorPaletteShaded;
          this.IsSortedByValue = options.isSortedByValue;
          this.MaxNumberOfSegments = options.maxNumberOfSegments;
          this.OtherText = options.otherText;
          this.ItemClicked = options.itemClicked;
          this.AllCategoriesLabel = options.allCategoriesLabel;
          this.ValueDescriptionLabel = options.valueDescriptionLabel;
          this.IsSegmentTooltipVisible = options.isSegmentTooltipVisible;
          this.CategoryInformation = options.categoryInformation;
          this.IsValueConvertedToPercent = options.isValueConvertedToPercent;
          this.IsCalloutLabelWithValue = options.isCalloutLabelWithValue;
          this.IsCalloutValueConvertedToPercent = options.isCalloutValueConvertedToPercent;
          this.SeriesDefinitions = options.seriesDefinitions;
          this.IsCalloutVisible = (this.CategoryInformation === models.constants.categoryInformation.calloutLabels);
          this.MetricsFormat = models.data.initializeMetricsFormat(options);
          this.IsSegmentSelectionDisabled = options.isSegmentSelectionDisabled;

          this.resizeDebounceHandler = _.debounce(this.resizeDebounceHandler.bind(this), 200);

          this.ChartProperties = new models.chartProperties();
          this.ChartProperties.metricsFormat = this.MetricsFormat;
          this.ChartProperties.componentElement = $(this.el);
          this.ChartProperties.canvasId = "#svg-" + this.ChartProperties.componentElement.attr(models.constants.idSelector);
          this.ChartProperties.margin = { left: 0, right: 0, top: 0, bottom: 0 };
          this.ChartProperties.isSingleSeries = true;
          this.ChartProperties.isSeriesStacked = false;
          this.ChartProperties.chartType = models.constants.chartType.doughnut;
          this.ChartProperties.isLegendVisible = (this.CategoryInformation === models.constants.categoryInformation.legend);
          this.ChartProperties.legendMode = models.nvd3Legend.setLegendMode(this.ChartProperties, this.LegendMode);
          this.ChartProperties.sizes = {};
          this.ChartProperties.selectedIndex = -1;
          this.ChartProperties.hasPositiveSize = models.utils.hasPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin);

          this.initChart();
        }

        return Doughnut;
      }
  )();
}(Sitecore.Speak.D3.models));