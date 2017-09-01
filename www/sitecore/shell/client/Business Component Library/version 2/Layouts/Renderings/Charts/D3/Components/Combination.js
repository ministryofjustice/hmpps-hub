(function (models) {
  Sitecore.Speak.D3.components.Combination = (
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
        *      isColorPaletteShaded: defines whether the palette should be a shade of blue;            
        *      isSegmentSelectionDisabled: defines whether the segments are selectable;
        *   }
        */

        var Combination = function (options) {
          this.initialize(options);
        };

        var itemClicked = function (d) {
          if (d.index === 0) {
            return;
          }

          var item = new models.data.selectedDataItem(
            models.constants.allSeries,
            this.OriginalData[0].values[d.index-1][this.ChartProperties.seriesDefinitions[0].categoryFieldName]
            , 0,
            d);
          this.ItemClicked(item);
        };

        var getBarSeriesIndex = function (data) {
          for (var index = 0; index < data.length; index++) {
            if (data[index].bar) {
              return index;
            }
          }
          return -1;
        };

        var getDataLenght = function (chartProperties) {
          if (chartProperties.hasBarSeries) {
            return chartProperties.chartData[chartProperties.barSeriesIndex].values.length;
          }
          return chartProperties.chartData[0].values.length;
          
        }

        /**
        * Handles resize with debounce.
        */
        Combination.prototype.resizeDebounceHandler = function () {
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.nvd3Axis.setYAxisLabels(this.ChartProperties.componentElement, this.ChartProperties.chartData, this.ChartProperties.palette);
          models.nvd3Legend.createLegend(this.ChartProperties);
          models.nvd3Legend.reloadLegendState(this.ChartProperties, models.nvd3Legend.getLegendContainerElement(this.ChartProperties.componentElement));
          if (this.ChartProperties.hasBarSeries) {
            models.nvd3VisualizationManager.removeCombinationDummyBars(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].values.length);
          }
          models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, false, this.ChartProperties.hasBarSeries, this.CategoryLabelTrimming, this.ChartProperties.extendedXDomain, getDataLenght(this.ChartProperties), this.ChartProperties.chartType);
       
          models.nvd3Tooltip.removeTooltipOnResize();
          models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
        }

        /**
        * Initializes the chart.
        */
        Combination.prototype.initChart = function () {
          var dataScId = this.ChartProperties.componentElement.attr(models.constants.idSelector);
          var chartId = "combination-" + dataScId;
          if (!this.ChartProperties.chartElement) {
            this.ChartProperties.chartElement = nv.models.linePlusBarChart()
            .options({
              id: chartId,
              transitionDuration: models.constants.animations.slow,
              noData: this.NoDataToDisplay,
              margin: this.ChartProperties.margin,
              padData: false,
              showLegend: false,
              reduceXTicks: false,
              groupSpacing: 0.33,
              showControls: false
            });

            this.ChartProperties.chartElement.focusEnable(false);
            this.ChartProperties.chartElement.xAxis.axisLabel(this.XAxisLabel);
            this.ChartProperties.chartElement.y1Axis.showMaxMin(false);
            this.ChartProperties.chartElement.y2Axis.showMaxMin(false);
            this.ChartProperties.chartElement.xAxis.showMaxMin(false);
            this.ChartProperties.chartElement.bars.dispatch.on("elementClick", function (d) {
              itemClicked.call(this, d);
            }.bind(this));

            this.ChartProperties.chartElement.legend.dispatch.legendClick = function (d) {              
              if (this.ChartProperties.legendMode === models.constants.legendMode.multipleCheck) {
                if (this.ChartProperties.hasBarSeries) {
                  models.nvd3VisualizationManager.removeCombinationDummyBars(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].values.length);
                }
                models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, false, this.ChartProperties.hasBarSeries, this.CategoryLabelTrimming, this.ChartProperties.extendedXDomain, getDataLenght(this.ChartProperties), this.ChartProperties.chartType);
                            
                models.nvd3Axis.setYAxisLabels(this.ChartProperties.componentElement, this.ChartProperties.chartData, this.ChartProperties.palette);
                if (this.ChartProperties.hasBarSeries) {
                  models.nvd3Axis.setCombinationChartRightYAxisLabels(this.ChartProperties.svgElement, this.ChartProperties.chartElement, this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].legendState === models.constants.legendState.unchecked, this.ChartProperties.valueFormatter2);
                }
              }
            }.bind(this);

            this.ChartProperties.chartElement.bars.dispatch.on("elementMouseover", function (e) {
              models.nvd3VisualizationManager.setCombinationElementVisualization(this.ChartProperties.svgElement, this.ChartProperties.barSeriesIndex, e.index, models.constants.visualizationMode.emphasized, this.IsSegmentSelectionDisabled);
            }.bind(this));

            this.ChartProperties.chartElement.bars.dispatch.on("elementMouseout", function (e) {
              var visualizationMode;
              visualizationMode = models.constants.visualizationMode.standard;

              if (this.ChartProperties.hasBarSeries && this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].legendState === models.constants.legendState.disengaged) {
                visualizationMode = models.constants.visualizationMode.deemphasized;
              }
              if (this.ChartProperties.hasBarSeries) {
                models.nvd3VisualizationManager.setCombinationElementVisualization(this.ChartProperties.svgElement, this.ChartProperties.barSeriesIndex, e.index, visualizationMode, this.IsSegmentSelectionDisabled);
              }
            }.bind(this));
          }
        };

        /**
        * Handles the resize event.
        */
        Combination.prototype.resize = function () {
          if (this.ChartProperties.chartData.length === 0) {            
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          models.utils.setChartAnimation(this.ChartProperties.chartElement, false);
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.utils.setCanvasHeight(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, this.ChartProperties.isLegendVisible, true);
          this.ChartProperties.chartElement.update();
          models.nvd3Axis.hideXaxisLabels(this.ChartProperties.svgElement);
          if (this.ChartProperties.hasBarSeries) {
            models.nvd3VisualizationManager.removeCombinationDummyBars(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].values.length);
          }
          models.utils.setSingleSeriesNegativeColor(this.ChartProperties.svgElement, "g.nvd3.nv-wrap.nv-linePlusBar g.nv-focus g.nv-barsWrap.nvd3-svg g.nv-bars rect.negative", true);
          models.nvd3Axis.ellipseXLabels(this.ChartProperties.svgElement, this.CategoryLabelTrimming, this.CategoryLabelTrimming, this.ChartProperties.rangeBand);
          this.resizeDebounceHandler();
        }

        /**
        * Binds data into the chart.                 
        */
        Combination.prototype.bindData = function (data, isAnimationEnabled) {
          this.OriginalData = data;
          if (!models.nvd3Axis.validateNoData(data, this.ChartProperties, this.NoDataToDisplay, this.IsTitleVisible, this.IsSegmentTooltipVisible)) {
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
          models.data.setCombinationChartLineSeriesIndex(this.ChartProperties.chartData);
          this.ChartProperties.chartData = models.data.clone(this.ChartProperties.chartData);
          this.ChartProperties.palette = models.colors.getPalette(this.IsColorPaletteShaded, this.ChartProperties.numberOfItems, 0);
          models.nvd3Axis.setYAxisLabels(this.ChartProperties.componentElement, this.ChartProperties.chartData, this.ChartProperties.palette);
          this.ChartProperties.barSeriesIndex = getBarSeriesIndex(this.ChartProperties.chartData);
          this.ChartProperties.hasBarSeries = this.ChartProperties.barSeriesIndex > -1;
          this.ChartProperties.isLegendVisible = models.nvd3Legend.isLegendVisible(this.ChartProperties.isSingleSeries, this.IsLegendHidden);
          this.ChartProperties.numberOfItems = this.ChartProperties.chartData.length;
          models.colors.setChartColors(this.ChartProperties.chartElement, this.ChartProperties.isSingleSeries, this.IsColorPaletteShaded, this.ChartProperties.palette);

          if (this.ChartProperties.svgElement) {
            this.ChartProperties.svgElement.selectAll("g.nv-groups rect.nv-bar").remove();
          }
          
          this.ChartProperties.hasDateCategory = models.utils.hasDateCategory(this.ChartProperties.chartData, this.ChartProperties.seriesDefinitions[this.ChartProperties.hasBarSeries ? this.ChartProperties.barSeriesIndex : 0].categoryDataFormatting);
          models.nvd3Axis.formatCombinationAxisLabels(this.ChartProperties);          

          var y2AxisDomain = models.utils.extendYDomainExcludeSeriesAt(this.ChartProperties.chartData, this.ChartProperties.barSeriesIndex);
          this.ChartProperties.chartElement.lines.forceY(y2AxisDomain);
          if (this.ChartProperties.hasBarSeries) {
            var yAxisDomain = models.utils.extendYDomain([this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex]]);
            this.ChartProperties.chartElement.bars.forceY(yAxisDomain);
            models.utils.extendXDomain(this.ChartProperties);
          }

          this.ChartProperties.chartElement.xAxis.tickValues(this.ChartProperties.chartData[this.ChartProperties.hasBarSeries ? this.ChartProperties.barSeriesIndex : 0].values.map(function (d) { return d.x }));

          var chartHeight = models.utils.getChartHeight(this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, this.ChartProperties.isLegendVisible, true);          
          models.utils.setChartAnimation(this.ChartProperties.chartElement, isAnimationEnabled);
          nv.addGraph(function () {
            d3.select(this.ChartProperties.canvasId)
              .attr("width", "100%")
              .style({"height": chartHeight + "px" })
              .datum(this.ChartProperties.chartData)
              .call(this.ChartProperties.chartElement);

            this.ChartProperties.svgElement = d3.select(this.ChartProperties.canvasId);

            nv.utils.windowResize(this.resize.bind(this));
            return this.ChartProperties.chartElement;
          }.bind(this), function () {
            if (this.ChartProperties.hasBarSeries) {
              models.nvd3VisualizationManager.removeCombinationDummyBars(this.ChartProperties.svgElement, this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].values.length);
              this.ChartProperties.barToLineAxisScale = models.data.getBarToLineAxisScale(this.ChartProperties.chartElement.y1Axis.domain(), this.ChartProperties.chartElement.y2Axis.domain());
            }
            models.nvd3Tooltip.setTooltip(this.ChartProperties, false, false);
            this.ChartProperties.rangeBand = models.utils.getCanvasWidth(this.ChartProperties.componentElement, this.ChartProperties.margin) / this.ChartProperties.chartData[this.ChartProperties.hasBarSeries ? this.ChartProperties.barSeriesIndex : 0].values.length;
            models.utils.setSingleSeriesPositiveColor(this.ChartProperties.svgElement, "g.nvd3.nv-wrap.nv-linePlusBar g.nv-focus g.nv-barsWrap.nvd3-svg g.nv-bars rect.positive", true, this.ChartProperties.palette[0]);
            models.utils.setSingleSeriesNegativeColor(this.ChartProperties.svgElement, "g.nvd3.nv-wrap.nv-linePlusBar g.nv-focus g.nv-barsWrap.nvd3-svg g.nv-bars rect.negative", true);
            models.nvd3Axis.ellipseXLabels(this.ChartProperties.svgElement, this.CategoryLabelTrimming, this.CategoryLabelTrimming, this.ChartProperties.rangeBand);
            models.nvd3Legend.createLegend(this.ChartProperties);
            models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, false, this.ChartProperties.hasBarSeries, this.CategoryLabelTrimming, this.ChartProperties.extendedXDomain, getDataLenght(this.ChartProperties), this.ChartProperties.chartType);
            models.nvd3Axis.showHighestYValue(this.ChartProperties.svgElement);
            models.nvd3Axis.setCombinationChartRightYAxisLabels(this.ChartProperties.svgElement, this.ChartProperties.chartElement, this.ChartProperties.hasBarSeries ? (this.ChartProperties.chartData[this.ChartProperties.barSeriesIndex].legendState === models.constants.legendState.unchecked) : false, this.ChartProperties.valueFormatter2);
            models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
          }.bind(this));
        }

        Combination.prototype.initialize = function (options) {
          this.el = options.el;
          this.XAxisLabel = options.xAxisLabel;
          this.LegendMode = options.legendMode;
          this.CategoryLabelTrimming = options.categoryLabelTrimming;
          this.IsTitleVisible = options.isTitleVisible;
          this.IsColorPaletteShaded = false;
          this.IsLegendHidden = options.isLegendHidden;
          this.LeftLabelsWidth = options.leftLabelsWidth;
          this.ItemClicked = options.itemClicked;
          this.SeriesDefinitions = options.seriesDefinitions;
          this.MetricsFormat = models.data.initializeMetricsFormat(options);
          this.IsSegmentSelectionDisabled = options.isSegmentSelectionDisabled;

          this.resizeDebounceHandler = _.debounce(this.resizeDebounceHandler.bind(this), 500);
          this.ChartProperties = new models.chartProperties();          
          this.ChartProperties.metricsFormat = this.MetricsFormat;          
          this.ChartProperties.componentElement = $(this.el);
          this.ChartProperties.canvasId = "#svg-" + this.ChartProperties.componentElement.attr(models.constants.idSelector);
          this.ChartProperties.margin = { left: parseInt(this.LeftLabelsWidth), right: parseInt(this.LeftLabelsWidth), top: 15, bottom: 50 };
          this.ChartProperties.chartType = models.constants.chartType.combination;
          this.ChartProperties.legendMode = models.nvd3Legend.setLegendMode(this.ChartProperties, this.LegendMode);
          this.ChartProperties.isSingleSeries = false;
          this.ChartProperties.barSeriesIndex = 0;
          this.ChartProperties.rangeBand = 50;
          this.ChartProperties.barToLineAxisScale = 1;
          this.OriginalData = [];
          this.ChartProperties.dispatcher = models.dispatcher().add("tooltipShown");
          this.ChartProperties.dispatcher.on("tooltipShown", function (tooltipArgs) {
            models.nvd3VisualizationManager.setComnbinationChartHighlightedPoint(this.ChartProperties, tooltipArgs);
          }.bind(this));
          this.initChart();
        }

        return Combination;
      }
  )();
}(Sitecore.Speak.D3.models));