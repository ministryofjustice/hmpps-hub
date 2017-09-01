(function (models) {
  Sitecore.Speak.D3.components.Column = (
      function () {
        /*  The initialize function receives the options object argument.
        *  options {           
        *      el: the component element;
        *      xAxisLabel: the x axis label;
        *      yAxisLabel: the y axis label;
        *      legendMode: the legend mode (ExclusiveCheck|MultipleCheck);
        *      categoryLabelTrimming: the category labels trimming mode (TrimaFromStart|TrimAtEnd);
        *      isTitleVisible: defines whether the title is visible;        
        *      isLegendHidden: defines whether the legend is hidden;
        *      leftLabelsWidth: left axis labels width;            
        *      itemClicked: the item clicked havent handler function;
        *      seriesDefinitions: the list of SeriesDefinition items;        
        *      isSeriesStacked: defines whether series are stacked;
        *      isColorPaletteShaded: defines whether the palette should be a shade of blue;
        *      isAverageLineVisible: defines whether the average line is visible;
        *      isSegmentSelectionDisabled: defines whether the segments are selectable; 
        *   }
        */

        var Column = function (options) {
          this.initialize(options);
        };

        var itemClicked = function (d) {
          var item = new models.data.selectedDataItem(d.data.key, d.data.x, d.data.y, d);
          this.ItemClicked(item);
        };

        /**
        * Adds average line.
        */
        var addAverageLine = function () {
          if (this.IsAverageLineVisible) {
            var options = {
              data: this.ChartProperties.chartData,
              chart: this.ChartProperties.chartElement,
              margin: this.ChartProperties.margin,
              svgId: this.ChartProperties.canvasId,
              width: models.utils.getCanvasWidth(this.ChartProperties.componentElement, this.ChartProperties.margin),
              isSeriesStacked: this.ChartProperties.isSeriesStacked,
              parentNodeSelector: ".nv-barsWrap.nvd3-svg"
            }
            this.AverageLineTooltip = models.functionLines.addAverageLine(options, this.AverageLineTooltip, this.ChartProperties.valueFormatter);
          }
        }

        /**
        * Handles resize with debounce.
        */
        Column.prototype.resizeDebounceHandler = function () {
          addAverageLine.call(this);
          models.nvd3Legend.createLegend(this.ChartProperties);
          models.nvd3Legend.reloadLegendState(this.ChartProperties, models.nvd3Legend.getLegendContainerElement(this.ChartProperties.componentElement));
          models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, false, false, this.CategoryLabelTrimming, null, this.ChartProperties.chartData[0].values.length, this.ChartProperties.chartType);
          models.nvd3Tooltip.removeTooltipOnResize();
          models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
        }

        /**
       * Initializes the chart.
       */
        Column.prototype.initChart = function () {
          var dataScId = this.ChartProperties.componentElement.attr(models.constants.idSelector);
          var chartId = "column-" + dataScId;
          if (!this.ChartProperties.chartElement) {
            this.ChartProperties.chartElement = nv.models.multiBarChart()
            .options({
              id: chartId,
              transitionDuration: models.constants.animations.slow,
              noData: this.NoDataToDisplay,
              margin: this.ChartProperties.margin,
              padData: true,
              showLegend: false,
              reduceXTicks: false,
              groupSpacing: 0.33,
              stacked: this.ChartProperties.isSeriesStacked,
              showControls: false
            });

            this.ChartProperties.chartElement.xAxis.axisLabel(this.XAxisLabel);
            models.nvd3Axis.setYAxisLabel(this.ChartProperties.componentElement[0], this.YAxisLabel);
            this.ChartProperties.chartElement.yAxis.showMaxMin(true);
            this.ChartProperties.chartElement.xAxis.showMaxMin(false);
            this.ChartProperties.chartElement.multibar.dispatch.on("elementClick", function (d) {
              itemClicked.call(this, d);
            }.bind(this));

            this.ChartProperties.chartElement.legend.dispatch.legendClick = function (d) {
              models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, false, false, this.CategoryLabelTrimming, null, this.ChartProperties.chartData[0].values.length, this.ChartProperties.chartType);
            }.bind(this);

            this.ChartProperties.chartElement.multibar.dispatch.on("elementMouseover", function (e) {
              var seriesIndex;
              if (this.ChartProperties.isSeriesStacked) {
                for (seriesIndex = 0; seriesIndex < this.ChartProperties.chartData.length; seriesIndex++) {
                  models.nvd3VisualizationManager.setColumnElementVisualization(this.ChartProperties.svgElement, seriesIndex, e.index, models.constants.visualizationMode.emphasized, this.IsSegmentSelectionDisabled);
                }
              } else {
                models.nvd3VisualizationManager.setColumnElementVisualization(this.ChartProperties.svgElement, e.data.series, e.index, models.constants.visualizationMode.emphasized, this.IsSegmentSelectionDisabled);
              }
            }.bind(this));

            this.ChartProperties.chartElement.multibar.dispatch.on("elementMouseout", function (e) {
              var visualizationMode;
              var seriesIndex;
              if (this.ChartProperties.isSeriesStacked) {
                for (seriesIndex = 0; seriesIndex < this.ChartProperties.chartData.length; seriesIndex++) {
                  visualizationMode = models.constants.visualizationMode.standard;
                  if (this.ChartProperties.chartData[seriesIndex].legendState === models.constants.legendState.disengaged) {
                    visualizationMode = models.constants.visualizationMode.deemphasized;
                  }
                  models.nvd3VisualizationManager.setColumnElementVisualization(this.ChartProperties.svgElement, seriesIndex, e.index, visualizationMode, this.IsSegmentSelectionDisabled);
                }
              }
              else {
                visualizationMode = models.constants.visualizationMode.standard;

                if (this.ChartProperties.chartData[e.data.series].legendState === models.constants.legendState.disengaged) {
                  visualizationMode = models.constants.visualizationMode.deemphasized;
                }
                models.nvd3VisualizationManager.setColumnElementVisualization(this.ChartProperties.svgElement, e.data.series, e.index, visualizationMode, this.IsSegmentSelectionDisabled);
              }

            }.bind(this));
          }
        };

        /**
        * Handles the resize event.
        */
        Column.prototype.resize = function () {
          if (this.ChartProperties.chartData.length === 0) {            
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          models.utils.setChartAnimation(this.ChartProperties.chartElement, false);
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.utils.setCanvasHeight(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, this.ChartProperties.isLegendVisible, true);
          models.nvd3Axis.hideXaxisLabels(this.ChartProperties.svgElement);
          this.ChartProperties.chartElement.update();
                
          models.utils.setSingleSeriesNegativeColor(this.ChartProperties.svgElement, "g.nv-groups rect.nv-bar.negative", this.ChartProperties.isSingleSeries);
          models.nvd3Axis.ellipseXLabels(this.ChartProperties.svgElement, this.CategoryLabelTrimming, this.CategoryLabelTrimming, this.ChartProperties.chartElement.xAxis.rangeBand(), false);
          this.resizeDebounceHandler();          
        }

        /**
        * Binds data into the chart.                 
        */
        Column.prototype.bindData = function (data, isAnimationEnabled) {          

          if (!models.nvd3Axis.validateNoData(data, this.ChartProperties, this.NoDataToDisplay, this.IsTitleVisible, true)) {
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          this.ChartProperties.seriesDefinitions = models.data.initializeSeriesDefinitions(this.SeriesDefinitions);
          var initializedData = models.data.initData(data, this.ChartProperties.seriesDefinitions, true, this.ChartProperties.componentElement.attr(models.constants.idSelector), this.ChartProperties.chartType, this.ChartProperties.metricsFormat);
          if (initializedData === null) {
            models.nvd3Axis.validateNoData([], this.ChartProperties, this.NoDataToDisplay, this.IsTitleVisible, true);
            return;
          }
          this.ChartProperties.chartData = initializedData.data;
          this.ChartProperties.seriesDefinitions = initializedData.seriesDefinitions;
          this.ChartProperties.isSingleSeries = this.ChartProperties.chartData.length === 1;
          this.ChartProperties.isLegendVisible = models.nvd3Legend.isLegendVisible(this.ChartProperties.isSingleSeries, this.IsLegendHidden);
          this.ChartProperties.numberOfItems = this.ChartProperties.isSingleSeries ? this.ChartProperties.chartData[0].values.length : this.ChartProperties.chartData.length;
          this.ChartProperties.palette = models.colors.getPalette(this.IsColorPaletteShaded, this.ChartProperties.numberOfItems, 0);
          models.colors.setChartColors(this.ChartProperties.chartElement, this.ChartProperties.isSingleSeries, this.IsColorPaletteShaded, this.ChartProperties.palette);

          if (this.ChartProperties.svgElement) {
            this.ChartProperties.svgElement.selectAll("g.nv-groups rect.nv-bar").remove();
          }

          models.nvd3Axis.formatAxisLabels(this.ChartProperties);
          var chartHeight = models.utils.getChartHeight(this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, this.ChartProperties.isLegendVisible, true);          
          models.utils.setChartAnimation(this.ChartProperties.chartElement, isAnimationEnabled);
          nv.addGraph(function () {
            d3.select(this.ChartProperties.canvasId)
              .attr("width", "100%")
              .style({ "height": chartHeight + "px" })
              .datum(this.ChartProperties.chartData)
              .call(this.ChartProperties.chartElement);

            this.ChartProperties.svgElement = d3.select(this.ChartProperties.canvasId);
            nv.utils.windowResize(this.resize.bind(this));
            return this.ChartProperties.chartElement;
          }.bind(this), function () {
            models.nvd3Axis.showCustomAxisLabel(this.ChartProperties.componentElement);
            addAverageLine.call(this);
            models.nvd3Tooltip.setTooltip(this.ChartProperties, this.ChartProperties.isSeriesStacked, false);
            models.nvd3Axis.ellipseXLabels(this.ChartProperties.svgElement, this.CategoryLabelTrimming, this.ChartProperties.chartElement.xAxis.rangeBand(),false);
            models.utils.setSingleSeriesPositiveColor(this.ChartProperties.svgElement, "g.nv-groups rect.nv-bar.positive", this.ChartProperties.isSingleSeries, this.ChartProperties.palette[0]);
            models.utils.setSingleSeriesNegativeColor(this.ChartProperties.svgElement, "g.nv-groups rect.nv-bar.negative", this.ChartProperties.isSingleSeries);
            models.nvd3Legend.createLegend(this.ChartProperties);
            models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, false, false, this.CategoryLabelTrimming, null, this.ChartProperties.chartData[0].values.length, this.ChartProperties.chartType);
            models.nvd3Axis.showHighestYValue(this.ChartProperties.svgElement);
            models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
          }.bind(this));
        }

        Column.prototype.initialize = function (options) {
          this.el = options.el;
          this.XAxisLabel = options.xAxisLabel;
          this.YAxisLabel = options.yAxisLabel;
          this.LegendMode = options.legendMode;
          this.CategoryLabelTrimming = options.categoryLabelTrimming;
          this.IsValueShownOnBar = options.isValueShownOnBar;
          this.IsTitleVisible = options.isTitleVisible;
          this.IsSeriesStacked = options.isSeriesStacked,
          this.IsColorPaletteShaded = options.isColorPaletteShaded;
          this.IsLegendHidden = options.isLegendHidden;
          this.LeftLabelsWidth = options.leftLabelsWidth;
          this.IsAverageLineVisible = options.isAverageLineVisible;
          this.ItemClicked = options.itemClicked;
          this.SeriesDefinitions = options.seriesDefinitions;
          this.MetricsFormat = models.data.initializeMetricsFormat(options);
          this.IsSegmentSelectionDisabled = options.isSegmentSelectionDisabled;

          this.AverageLineTooltip = null;

          this.resizeDebounceHandler = _.debounce(this.resizeDebounceHandler.bind(this), 50);
          this.ChartProperties = new models.chartProperties();          
          this.ChartProperties.metricsFormat = this.MetricsFormat;          
          this.ChartProperties.componentElement = $(this.el);
          this.ChartProperties.canvasId = "#svg-" + this.ChartProperties.componentElement.attr(models.constants.idSelector);
          this.ChartProperties.margin = { left: parseInt(this.LeftLabelsWidth), right: 0, top: 15, bottom: 50 };
          this.ChartProperties.chartType = models.constants.chartType.column;
          this.ChartProperties.legendMode = models.nvd3Legend.setLegendMode(this.ChartProperties, this.LegendMode);
          this.ChartProperties.isSeriesStacked = this.IsSeriesStacked;
          this.ChartProperties.hasPositiveSize = models.utils.hasPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin);

          this.initChart();
        }

        return Column;
      }
  )();
}(Sitecore.Speak.D3.models));