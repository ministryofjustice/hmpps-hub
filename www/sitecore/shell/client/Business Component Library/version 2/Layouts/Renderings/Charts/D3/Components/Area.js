(function (models) {
  Sitecore.Speak.D3.components.Area = (
      function () {
        /*  The initialize function receives the options object argument.
         *  options {           
         *      el: the component element;
         *      xAxisLabel: the x axis label;
         *      yAxisLabel: the y axis label;
         *      legendMode: the legend mode (ExclusiveCheck|MultipleCheck);
         *      categoryLabelTrimming: the category labels trimming mode (TrimaFromStart|TrimAtEnd);
         *      isTitleVisible: defines whether the title is visible;
         *      isSeriesStacked: defines whether series are stacked,
         *      isLegendHidden: defines whether the legend is hidden;
         *      leftLabelsWidth: left axis labels width;
         *      seriesStyle: series style (Percentage|Stacked);                
         *      itemClicked: the item clicked havent handler function;
         *      seriesDefinitions: the list of SeriesDefinition items;  
         *      isSegmentSelectionDisabled: defines whether the segments are selectable;
         *   }
         */
        var Area = function (options) {
          this.initialize(options);
        };

        var itemClicked = function (d) {
          var key = d.point ? (d.point.length > 0 ? d.point[0].key : d.point.key) : models.constants.allSeries;
          var item = new models.data.selectedDataItem(key, 0, 0, d);
          this.ItemClicked(item);
        };

        var mouseMoveHandler = _.throttle(function () {
          var elements = models.nvd3VisualizationManager.getScatterDots(this.ChartProperties.svgElement, this.ChartProperties.chartData);
          if (!elements) {
            return;
          }

          if (elements.length > 0) {
            models.nvd3VisualizationManager.visualizeDotsElements(this.ChartProperties.svgElement, this.ChartProperties.chartData, elements, models.constants.visualizationMode.emphasized, this.ChartProperties.palette);
          } else {
            models.nvd3VisualizationManager.visualizeDotsElements(this.ChartProperties.svgElement, this.ChartProperties.chartData, null, models.constants.visualizationMode.standard, this.ChartProperties.palette);
          }
        }, 100);

        var getSeriesStyle = function () {
          var style = "simple";
          switch (this.SeriesStyle) {
            case ("Stacked"):
              style = "stack";
              break;
            case ("StackedPercentage"):
              style = "expand";
              break;
          }

          return style;
        };

        /**
        * Handles resize with debounce.
        */
        Area.prototype.resizeDebounceHandler = function () {
          models.nvd3Legend.createLegend(this.ChartProperties);
          models.nvd3Legend.reloadLegendState(
              this.ChartProperties,
              models.nvd3Legend.getLegendContainerElement(this.ChartProperties.componentElement));
          this.ChartProperties.chartElement.stacked.dispatch.on('areaClick.toggle', null);
          models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, true, false, this.CategoryLabelTrimming, null, this.ChartProperties.chartData[0].values.length, this.ChartProperties.chartType);          
          models.nvd3Tooltip.removeTooltipOnResize();
          models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
        }

        /**
        * Initializes the chart.
        */
        Area.prototype.initChart = function () {
          var dataScId = this.ChartProperties.componentElement.attr(models.constants.idSelector);
          var chartId = "area-" + dataScId;

          if (!this.ChartProperties.chartElement) {
            this.ChartProperties.chartElement = nv.models.stackedAreaChart()
            .options({
              id: chartId,
              transitionDuration: models.constants.animations.medium,
              useInteractiveGuideline: true,
              noData: this.NoDataToDisplay,
              margin: this.ChartProperties.margin,
              padData: true,
              showLegend: false,
              showXAxis: true,
              showYAxis: true,
              showControls: false,
              style: getSeriesStyle.call(this)
            });

            this.ChartProperties.chartElement.yAxis.showMaxMin(true);
            this.ChartProperties.chartElement.xAxis.showMaxMin(false);
            this.ChartProperties.chartElement.xAxis.axisLabel(this.XAxisLabel);
            models.nvd3Axis.setYAxisLabel(this.el, this.YAxisLabel);
            this.ChartProperties.chartElement.stacked.dispatch.on("areaClick", function (d,i) {
              itemClicked.call(this, d);
            }.bind(this));
            this.ChartProperties.chartElement.legend.dispatch.legendClick = function (d) {
              this.ChartProperties.chartElement.stacked.dispatch.on('areaClick.toggle', null);
              if (this.ChartProperties.legendMode === models.constants.legendMode.multipleCheck) {
                // TODO: this should be executed only if the XAxis values are calculated over all the displayed values
                // TODO: currently it only dispalys values of the first series                
                models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, true, false, this.CategoryLabelTrimming, null, this.ChartProperties.chartData[0].values.length, this.ChartProperties.chartType);
              }
            }.bind(this);
          }
        };

        /**
        * Handles the resize event.
        */
        Area.prototype.resize = function () {
          if (this.ChartProperties.chartData.length === 0) {          
            return;
          }

          if (!models.utils.isVisibleWithPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin)) {
            return;
          }

          models.utils.setChartAnimation(this.ChartProperties.chartElement, false);
          models.nvd3Axis.hideXaxisLabels(this.ChartProperties.svgElement);
          models.nvd3VisualizationManager.removeOverlapLayers(this.ChartProperties.svgElement);
          models.utils.setCanvasHeight(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, this.ChartProperties.isLegendVisible, true);
          this.ChartProperties.chartElement.update();
          this.resizeDebounceHandler();          
        };

        /**
        * Binds data into the chart.                 
        */
        Area.prototype.bindData = function (data, isAnimationEnabled) {
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
          this.ChartProperties.numberOfItems = this.ChartProperties.chartData.length;
          this.ChartProperties.palette = models.colors.getPalette(this.IsColorPaletteShaded, this.ChartProperties.chartData.length, 0);
          this.ChartProperties.chartElement.color(this.ChartProperties.palette);

          models.nvd3Axis.formatAxisLabels(this.ChartProperties);

          this.ChartProperties.chartElement.xAxis.tickValues(this.ChartProperties.chartData[0].values.map(function (d) { return d.x }));
          
          models.utils.setChartAnimation(this.ChartProperties.chartElement, isAnimationEnabled);

          var chartHeight = models.utils.getChartHeight(this.ChartProperties.componentElement, this.ChartProperties.margin.top, this.IsTitleVisible, this.ChartProperties.isLegendVisible, true);          
          nv.addGraph(function () {
            d3.select(this.ChartProperties.canvasId)
                .attr("width", "100%")
                .style({ "height": chartHeight + "px" })
                .datum(this.ChartProperties.chartData)
                .call(this.ChartProperties.chartElement);

            nv.utils.windowResize(this.resize.bind(this));
            this.ChartProperties.svgElement = d3.select(this.ChartProperties.canvasId);

            this.ChartProperties.svgElement.selectAll("g.nvd3.nv-wrap.nv-stackedAreaChart").on("mousemove", mouseMoveHandler.bind(this));

            if (!this.IsSegmentSelectionDisabled) {
              this.ChartProperties.svgElement.select("g.nvd3.nv-wrap.nv-stackedAreaChart").on("mouseover", function () {
                d3.select(this).select(".nv-areaWrap").style("cursor", "pointer");                       
              });
            }

            this.ChartProperties.svgElement.selectAll("g.nvd3.nv-wrap.nv-stackedAreaChart").on("mouseout", function () {
              var elements = this.ChartProperties.svgElement.selectAll("g.nv-scatterWrap .nv-groups .nv-group path.nv-point.nv-noninteractive.hover");
              if (elements[0].length === 0) {
                models.nvd3VisualizationManager.visualizeDotsElements(this.ChartProperties.svgElement, this.ChartProperties.chartData, null, models.constants.visualizationMode.standard, null, null, true);
              }
            }.bind(this));
            
            return this.ChartProperties.chartElement;
          }.bind(this), function () {
            models.nvd3Axis.showCustomAxisLabel(this.ChartProperties.componentElement);
            models.nvd3Tooltip.setTooltip(this.ChartProperties, true, this.SeriesStyle === "StackedPercentage");
            models.nvd3Legend.createLegend(this.ChartProperties);
            models.nvd3Axis.createXaxis(this.ChartProperties.svgElement, this.ChartProperties.componentElement, this.ChartProperties.margin, true, false, this.CategoryLabelTrimming, null, this.ChartProperties.chartData[0].values.length, this.ChartProperties.chartType);
            this.ChartProperties.chartElement.stacked.dispatch.on('areaClick.toggle', null);
            models.nvd3Axis.showHighestYValue(this.ChartProperties.svgElement);
            models.nvd3Axis.showAreaChartMaxYLabel(this.ChartProperties.svgElement);
            models.utils.setChartAnimation(this.ChartProperties.chartElement, true);
          }.bind(this));
        };

        Area.prototype.initialize = function (options) {
          this.el = options.el;
          this.XAxisLabel = options.xAxisLabel;
          this.YAxisLabel = options.yAxisLabel;
          this.LegendMode = options.legendMode;
          this.CategoryLabelTrimming = options.categoryLabelTrimming;
          this.IsTitleVisible = options.isTitleVisible;
          this.IsSeriesStacked = options.isSeriesStacked,
          this.IsLegendHidden = options.isLegendHidden;
          this.LeftLabelsWidth = options.leftLabelsWidth;
          this.SeriesStyle = options.seriesStyle;
          this.ItemClicked = options.itemClicked;
          this.SeriesDefinitions = options.seriesDefinitions;
          this.MetricsFormat = models.data.initializeMetricsFormat(options);
          this.IsSegmentSelectionDisabled = options.isSegmentSelectionDisabled;

          this.resizeDebounceHandler = _.debounce(this.resizeDebounceHandler.bind(this), 50);
          this.ChartProperties = new models.chartProperties();          
          this.ChartProperties.metricsFormat = this.MetricsFormat;          
          this.ChartProperties.componentElement = $(this.el);
          this.ChartProperties.canvasId = "#svg-" + this.ChartProperties.componentElement.attr(models.constants.idSelector);
          this.ChartProperties.margin = { left: parseInt(this.LeftLabelsWidth), right: 10, top: 15, bottom: 50 };
          this.ChartProperties.chartType = models.constants.chartType.area;
          this.ChartProperties.legendMode = models.nvd3Legend.setLegendMode(this.ChartProperties, this.LegendMode);
          this.ChartProperties.hasPositiveSize = models.utils.hasPositiveSize(this.ChartProperties.componentElement, this.ChartProperties.margin);

          this.initChart();
        };

        return Area;
      }
  )();
}(Sitecore.Speak.D3.models));
