Sitecore.Speak.D3.models.chartProperties = (
    function() {
        function chartProperties() {
            this.componentElement = null;
            this.canvasId = null,
            this.chartElement = null,
            this.svgElement = null,
            this.chartData = null,
            this.palette = [],
            this.isSingleSeries = false,
            this.isLegendVisible = false,
            this.margin = { left: 0, right: 0, top: 5, bottom: 0 },
            this.chartType = null,
            this.legendMode = null,
            this.numberOfItems = 0
        }

        return chartProperties;
    }
)();
    