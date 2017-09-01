(function (models) {
    models.functionLines = {

        /**
        * Gets the average line data out of a dataset.
        * 
        *  @param {object} data - The dataset. 
        *  @param {number} x1 - The line start point X coordinate. 
        *  @param {number} x2 - The line end point X coordinate. 
        *  @param {bool} isSeriesStacked - Defines whether series are stacked.       
        */
        getAverageLineData: function (data, x1, x2, isSeriesStacked) {
            var lineData = [];
            var seriesTotal = [];
            var total = 0;
            var average = 0;
            if (!isSeriesStacked) {
                var counter = 0;
                data.forEach(function (serie) {
                    if (serie.legendState === models.constants.legendState.checked) {
                        total = total + serie.values.reduce(function (a, b) {
                            counter++;
                            return a + b.y;
                        }, 0);
                    }
                });
                average = total / counter;
            } else {
                for (var index = 0; index < data[0].values.length; index++) {
                    seriesTotal.push(0);
                    data.forEach(function (serie) {
                        if (serie.legendState === models.constants.legendState.checked) {
                            seriesTotal[index] += serie.values[index].y;
                        }
                    });
                }
                if (seriesTotal.length > 0) {
                    average = seriesTotal.reduce(function (a, b) {
                        return a + b;
                    }) / seriesTotal.length;
                }
            }

            average = parseFloat(average).toFixed(2);

            var ld = {};
            ld.x = x1;
            ld.y = average;
            lineData.push(ld);

            var ld1 = {};
            ld1.x = x2;
            ld1.y = average;
            lineData.push(ld1);

            return lineData;
        },

        /**
        * Adds an Average line to a canvas.
        * 
        * @param {object} options -  
        *   data: the dataset,
        *   chart: the chart D3 element,
        *   margin: the margin, 
        *   svgId: the id of the svg element,    
        *   width: the line width, 
        *   isSeriesStacked: defines wheter the data series are stacked  
        *   parentNodeSelector: the parent node to appent the function line to 
        */
        addAverageLine: function (options, tooltip, valueFormatter) {
            var averageData = this.getAverageLineData(options.data, 0, options.width + options.margin.left, options.isSeriesStacked);

            var line = d3.svg.line().interpolate("basis").x(function (d) {
                return d.x;
            }).y(function (d) {
                return options.chart.yAxis.scale()(d.y);
            });

            var functionLineGroup = d3.select(options.svgId + " .function-line");
            if (functionLineGroup.node()) {
                functionLineGroup.remove();
            }

            if (!tooltip) {
              tooltip = this.setFunctionLineTooltip(d3.select(options.svgId), valueFormatter);
            }

            functionLineGroup = d3.select(options.svgId + " " + options.parentNodeSelector)
                .append("g")
                .attr("class", "function-line")
                .style("opacity", 0);

            functionLineGroup.append("path")
                .datum(averageData)
                .attr("class", "average-line")
                .attr("d", line)
                .on("mouseover", function (d, i) {
                    tooltip.show(d, i);
                })
                .on("mouseout", function (d, i) {
                    tooltip.hide(d, i);
                });

            functionLineGroup.append("text")
                .attr("x", averageData[0].x)
                .attr("y", options.chart.yAxis.scale()(averageData[0].y) - 5)
                .attr("text-anchor", "start")
                .attr("class", "average-line-text")
                .text("Average");

            functionLineGroup.transition()
                .duration(models.constants.animations.slow)
                .style("opacity", 1);

            return tooltip;
        },

        /**
        * Sets the function line tooltip     
        * @param {string} canvas - The canvas element.      
        */
        setFunctionLineTooltip: function (canvas, valueFormatter) {
            var tooltip = models.tooltip()
                .html(function (d) {
                  var value = parseFloat(d[0].y);
                  var valueClass = value < 0 ? " negativeValue" : "";
                  return "<strong>Average</strong> <br/><br/><div class=" + valueClass + ">" + valueFormatter(value) + "</div>";
                });
            canvas.call(tooltip);
            return tooltip;
        }
    }
}(Sitecore.Speak.D3.models));

