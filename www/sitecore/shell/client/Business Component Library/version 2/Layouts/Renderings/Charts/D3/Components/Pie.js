(function (models) {
  Sitecore.Speak.D3.components.Pie = (
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
        *      isValueHidden: defines whether the values are hidden;
        *      isSegmentSelectionDisabled: defines whether the segments are selectable;
        *   }
        */       

        var Pie = function (options) {
          this.initialize(options);
        };

        $.fn.d3Click = function () {
          this.each(function (i, e) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

            e.dispatchEvent(evt);
          });
        };

        var itemClicked = function (d) {
          var item = new models.data.selectedDataItem(d.data.x, d.data.x, d.data.y, d);
          this.ItemClicked(item);
        };               

        var reloadLegendState = function () {
          if (!this.ChartProperties.chartData) {
            return;
          }
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.nvd3Legend.reloadLegendState(this.ChartProperties, models.nvd3Legend.getLegendContainerElement(this.ChartProperties.componentElement));
        };

        /**
        * Sets the selected data item.
        */
        Pie.prototype.selectDataItem = function (index) {
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
        Pie.prototype.resizeDebounceHandler = function () {
          if (!this.IsLegendHidden) {
            reloadLegendState.call(this);
          }

          models.nvd3Legend.ellipseVerticalLegend(this.ChartProperties.componentElement, this.ChartProperties.sizes.legendWidth);
          if (!this.IsValueHidden) {
            models.nvd3Axis.centerPieLabels(
                this.ChartProperties.svgElement,
                this.ChartProperties.sizes,
                models.constants.pieLabelAngleThreshold,
                this.ChartProperties.valueFormatter,
                this.IsValueConvertedToPercent);
          }
          models.nvd3Tooltip.removeTooltipOnResize();
          models.utils.setChartAnimation(this.ChartProperties.chartElement, true);          
        }

        /**
        * Initializes the chart.
        */
        Pie.prototype.initChart = function () {
          var dataScId = this.ChartProperties.componentElement.attr(models.constants.idSelector);
          var chartId = "pie-" + dataScId;
          if (!this.ChartProperties.chartElement) {
            this.ChartProperties.chartElement = nv.models.pieChart()
                 .options({
                   id: chartId,
                   transitionDuration: models.constants.animations.slow,
                   margin: this.ChartProperties.margin,
                   showLegend: false,
                   showLabels: false,
                   labelsOutside: false,
                   labelType: "value",
                   growOnHover: false
                 });

            // TODO: replace this with formatting when impleneted
            this.ChartProperties.chartElement.valueFormat(d3.format("d"));

            this.ChartProperties.chartElement.pie.dispatch.on("elementMouseover.recolor", function (e) {
              var elements = this.ChartProperties.svgElement.select("g.nv-pieWrap .nv-pie .nv-slice:nth-child(" + (e.index + 1) + ") path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
              if (!this.IsSegmentSelectionDisabled) {
                elements.style("cursor", "pointer");
              }
              models.nvd3VisualizationManager.setPathElementsVisualization(this.ChartProperties.svgElement, elements, e.index, models.constants.visualizationMode.emphasized, models.constants.chartType.pie);
              models.nvd3Axis.setValueLabelsColor(this.ChartProperties.svgElement, e.index, models.constants.chartType.pie, models.constants.visualizationMode.emphasized);
            }.bind(this));

            this.ChartProperties.chartElement.pie.dispatch.on("elementMouseout.recolor", function (e) {
              var visualizationMode = models.constants.visualizationMode.standard;
              if (this.ChartProperties.chartData[e.index].legendState === models.constants.legendState.disengaged) {
                visualizationMode = models.constants.visualizationMode.deemphasized;
              }
              var elements = this.ChartProperties.svgElement.select("g.nv-pieWrap .nv-pie .nv-slice:nth-child(" + (e.index + 1) + ") path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
              models.nvd3VisualizationManager.setPathElementsVisualization(this.ChartProperties.svgElement, elements, e.index, visualizationMode, models.constants.chartType.pie);
              models.nvd3Axis.setValueLabelsColor(this.ChartProperties.svgElement, e.index, models.constants.chartType.pie, visualizationMode);
            }.bind(this));

            this.ChartProperties.chartElement.pie.dispatch.on("elementClick", function (d) {
              itemClicked.call(this, d);
            }.bind(this));
            this.ChartProperties.chartElement.legend.dispatch.legendClick = function (d) {
              if (this.ChartProperties.legendMode === models.constants.legendMode.multipleCheck) {
                models.nvd3Axis.removePieLabels(this.ChartProperties.svgElement);
                if (!this.IsValueHidden) {
                  setTimeout(function () {
                    models.nvd3Axis.centerPieLabels(this.ChartProperties.svgElement, this.ChartProperties.sizes, models.constants.pieLabelAngleThreshold, this.ChartProperties.valueFormatter, this.IsValueConvertedToPercent);
                  }.bind(this), models.constants.animations.slow);
                }
              }
            }.bind(this);
          }
        };

        /**
        * Handles the resize event.
        */
        Pie.prototype.resize = function () {
          if (this.ChartProperties.chartData.length === 0) {            
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          models.utils.setChartAnimation(this.ChartProperties.chartElement, false);
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.nvd3Axis.removePieLabels(this.ChartProperties.svgElement);
          models.utils.setCanvasHeight(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, false, false);
          var chartHeight = models.utils.getChartHeight(this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, false, false);
          var legendWidth = models.nvd3Legend.createVerticalLegend(this.ChartProperties, chartHeight);
          this.ChartProperties.sizes = models.utils.setPieSizes(this.ChartProperties.componentElement, chartHeight, legendWidth);

          this.ChartProperties.chartElement.update();
          this.resizeDebounceHandler();
        }

        /**
        * Binds data into the chart.                 
        */
        Pie.prototype.bindData = function (data, isAnimationEnabled) {
          if (!models.nvd3Axis.validateNoData(data, this.ChartProperties, this.NoDataToDisplay, this.IsTitleVisible, true)) {
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

          models.nvd3Axis.formatPieValueLabels(this.ChartProperties);
          models.data.setSeriesPercentages(this.ChartProperties.chartData);
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
            models.nvd3Axis.removePieLabels(this.ChartProperties.svgElement);
            var legendWidth = models.nvd3Legend.createVerticalLegend(this.ChartProperties, chartHeight);
            this.ChartProperties.sizes = models.utils.setPieSizes(this.ChartProperties.componentElement, chartHeight, legendWidth);
            models.nvd3Legend.ellipseVerticalLegend(this.ChartProperties.componentElement, this.ChartProperties.sizes.legendWidth);
            models.nvd3Tooltip.setTooltip(this.ChartProperties, false, false);
            this.ChartProperties.chartElement.update();
            if (!this.IsValueHidden) {
              setTimeout(function () {
                models.nvd3Axis.centerPieLabels(this.ChartProperties.svgElement, this.ChartProperties.sizes, models.constants.pieLabelAngleThreshold, this.ChartProperties.valueFormatter, this.IsValueConvertedToPercent);
              }.bind(this), models.constants.animations.slow);
            }

            models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
          }.bind(this));
        }

        Pie.prototype.initialize = function (options) {
          this.el = options.el;
          this.LegendMode = options.legendMode;
          this.IsTitleVisible = options.isTitleVisible;
          this.IsLegendHidden = options.isLegendHidden;
          this.IsColorPaletteShaded = options.isColorPaletteShaded;
          this.IsSortedByValue = options.isSortedByValue;
          this.MaxNumberOfSegments = options.maxNumberOfSegments;
          this.OtherText = options.otherText;
          this.ItemClicked = options.itemClicked;
          this.IsValueConvertedToPercent = options.isValueConvertedToPercent;
          this.IsValueHidden = options.isValueHidden;
          this.SeriesDefinitions = options.seriesDefinitions;
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
          this.ChartProperties.chartType = models.constants.chartType.pie;
          this.ChartProperties.isLegendVisible = !this.IsLegendHidden;
          this.ChartProperties.legendMode = models.nvd3Legend.setLegendMode(this.ChartProperties, this.LegendMode);
          this.ChartProperties.sizes = {};

          this.initChart();
        }

        return Pie;
      }
  )();
}(Sitecore.Speak.D3.models));