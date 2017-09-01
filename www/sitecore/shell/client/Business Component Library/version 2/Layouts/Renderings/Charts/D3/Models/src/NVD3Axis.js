(function (models) {
    models.nvd3Axis = {
        /**
        * Ellippes a word.
        * 
        * @param {object} canvas - The canvas element.          
        * @param {string} labelTrimmingLocation - Label trimming position.     
        * @param {number} width - Available width for the text.          
        * @param {number} padding - The left and right padding.    
        */
        ellipseXLabels: function (canvas, labelTrimmingLocation, width, padding) {
            padding = padding || 2;
            var texts = canvas.selectAll(".nv-x.nv-axis.nvd3-svg text:not(.nv-axislabel)");
            texts.each(function () {
                if (d3.select(this)) {
                    models.utils.ellipse(d3.select(this), width, padding, padding, labelTrimmingLocation === models.constants.trimFromStart, true);
                }
            });
        },

        /**
        * Ellippes the X axis label.
        * 
        * @param {object} canvas - The canvas element.                   
        * @param {width} width - Available width for the text.
        * @param {bool} trimFromStart - Trim from start.           
        */
        ellipseXAxisLabel: function (canvas, width, trimFromStart) {
            var text = canvas.select("g.nv-x.nv-axis.nvd3-svg  text.nv-axislabel");
            models.utils.ellipse(text, width, 0, 0, trimFromStart, false);
        },

        /**
        * Ellippes the Y axis label.
        * 
        * @param {object} canvas - The canvas element.                   
        * @param {width} width - Available width for teh text..          
        */
        ellipseYAxisLabel: function (canvas, width) {
            var text = canvas.select("g.nv-y.nv-axis.nvd3-svg  text.nv-axislabel");
            models.utils.ellipse(text, width, 0, 0, false, true);
        },

        /**
        * Draws the x axis    
        * @param {object} canvas - The canvas element.  
        * @param {number} width - The axis width.  
        */
        drawXaxis: function (canvas, width) {
            var axisContainer = canvas.select(".nv-x.nv-axis.nvd3-svg .nvd3.nv-wrap.nv-axis g");

            axisContainer.selectAll(".sc-xAxis").remove();
            axisContainer.append("line")
              .attr("x1", 0)
              .attr("y1", 0)
              .attr("x2", width)
              .attr("y2", 0)
              .classed("sc-xAxis", true);

            setTimeout(function () {
                var dateTicks = canvas.selectAll('.nv-x.nv-axis.nvd3-svg .tick');
                for (var j = 0; j < dateTicks[0].length; j++) {
                    var c = dateTicks[0][j];

                    var t = d3.transform(d3.select(c).attr("transform"));
                    var offsetX = parseFloat(t.translate[0]);

                    axisContainer.append("line")
                      .attr("x1", offsetX)
                      .attr("y1", 0)
                      .attr("x2", offsetX)
                      .attr("y2", 5)
                      .classed("sc-xAxis", true);
                }
                return dateTicks.length;
            }, Sitecore.Speak.D3.models.constants.animations.fast);
        },

        /**
        * Centers the x axis label
        * @param {object} canvas - The canvas element.  
        * @param {number} axisWidth - The axis width.
        */
        centerXAxisLabel: function (canvas, axisWidth) {
            canvas.select("g.nv-x.nv-axis.nvd3-svg  text.nv-axislabel").attr("x", axisWidth / 2);
        },

        /**
        * Centers the y axis label
        * @param {object} canvas - The canvas element.  
        * @param {number} axisWidth - The axis width.
        */
        centerYAxisLabel: function (canvas, axisWidth) {
            canvas.select("g.nv-y.nv-axis.nvd3-svg  text.nv-axislabel").attr("x", axisWidth / 2);
        },

        /**
        * Sets the Vertical Axis Label
        * @param {object} canvas - The svg canvas to add the label to.       
        * @param {string} text - The label\s text.      
        */
        setVerticalAxisLabel: function (canvas, text) {
            var offset = models.utils.getTopOffset(canvas.select(".nv-legendWrap.nvd3-svg"));
            var y = offset - 12;

            var label = canvas.select(".nv-axislabel.custom");
            if (label.node()) {
                label.text(text);
            } else {
                canvas.append("text")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("text-anchor", "start")
                  .attr("class", "nv-axislabel custom")
                  .text(text);
            }
        },

        /**
        * Shows or hides the x axis labels.
        * @param {object} canvas - The canvas element.  
        * @param {bool} status - Defines wheter to show or hide the axis
        */
        showXaxisLabels: function (canvas, status) {
            var xAxisLabels = canvas.select("g.nvd3.nv-wrap.nv-axis");
            var ticks = canvas.select("nv-x.nv-axis.nvd3-svg .tick");
            if (!status) {
                xAxisLabels.style("opacity", 0);
                ticks.style("opacity", 0);
                return;
            }

            ticks.style("opacity", 1);
            xAxisLabels
              .transition()
              .duration(models.constants.animations.medium)
              .style("opacity", 1);
        },

        /**
        * Hides the x axis labels.
        * @param {object} canvas - The canvas element.          
        */
        hideXaxisLabels: function (canvas) {
            this.showXaxisLabels(canvas, false);
        },

        /**
        * Remove overlapping ticks
        * 
        * @param {object} canvas - The svg element.  
        */
        removeOverlappingLabels: function (canvas, hasBarInCombinationChart, dataLength, chartType) {
            var margin = 10;
            var pxAdjustment = 5;
            var tickSelectorwrapper = "";
            var drawingCanvasRight = 0;
            if (chartType === models.constants.chartType.combination) {
                tickSelectorwrapper = ".nv-focus ";
                drawingCanvasRight = canvas.select(".nv-x.nv-axis.nvd3-svg").node().getBoundingClientRect().right + pxAdjustment;
            } else {
                var node = canvas.select(".nv-y.nv-axis.nvd3-svg .nvd3.nv-wrap.nv-axis g.tick:first-of-type line");
                if (!node.node()) {
                    node = canvas.select(".nv-x.nv-axis.nvd3-svg");
                }                
                drawingCanvasRight = node.node().getBoundingClientRect().right;
            }

            var ticks = canvas.selectAll(tickSelectorwrapper + ".nv-x.nv-axis.nvd3-svg .tick");
            var startIndex = hasBarInCombinationChart ? 1 : 0;
            var endIndex = hasBarInCombinationChart ? ticks[0].length - 1 : ticks[0].length;

            if (endIndex === 0) {
                return 0;
            }
            if (dataLength && dataLength < endIndex) {
                return -1;
            }

            for (var j = startIndex; j < endIndex; j++) {
                var c = ticks[0][j],
                  n = ticks[0][j + 1];
                if (c && c.getBoundingClientRect && c.getBoundingClientRect().right > (drawingCanvasRight - pxAdjustment)) {
                    d3.select(c).remove();
                    continue;
                }

                if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect) {
                    continue;
                }

                while (c.getBoundingClientRect().right + margin > n.getBoundingClientRect().left) {
                    d3.select(n).remove();
                    j++;
                    n = ticks[0][j + 1];
                    if (!n)
                        break;
                }
            }
            return ticks.length;
        },

        /**
        * Creates the xAxis .
        * @param {object} canvas - The canvas element.  
        * @param {object} element - the component element.
        * @param {object} margin - The margin object.
        * @param {bool} showXAxis - Show XAxis.
        * @param {bool} hasBarInCombinationChart - Has bar in combination.
        * @param {bool} labelTrimmingLocation - Label trimming location.
        * @param {object} extendedXDomain - The extended x domains.   
        */
        createXaxis: function (canvas, element, margin, showXAxis, hasBarInCombinationChart, labelTrimmingLocation, extendedXDomain, dataLength, chartType) {
            var canvasWidth = models.utils.getCanvasWidth(element, margin);
            this.centerXAxisLabel(canvas, canvasWidth);
            this.showXaxisLabels(canvas, false);

            setTimeout(function () {
                var value = this.removeOverlappingLabels(canvas, hasBarInCombinationChart, dataLength, chartType);
                if (value === -1) {
                    setTimeout(function () {
                        this.removeOverlappingLabels(canvas, hasBarInCombinationChart, dataLength, chartType);
                        this.completeRemovingOverlappingLabels(canvas, extendedXDomain, hasBarInCombinationChart, showXAxis, canvasWidth);
                    }.bind(this), Sitecore.Speak.D3.models.constants.animations.slow);
                } else {
                    this.completeRemovingOverlappingLabels(canvas, extendedXDomain, hasBarInCombinationChart, showXAxis, canvasWidth);
                }
                models.nvd3Axis.ellipseXAxisLabel(canvas, canvasWidth, labelTrimmingLocation === models.constants.trimFromStart);
            }.bind(this), Sitecore.Speak.D3.models.constants.animations.slow);
        },

        /**
        * Complete removing overlapping labels.
        * @param {object} canvas - The canvas element.  
        * @param {object} extendedXDomain - The extended x domains.   
        * @param {bool} hasBarInCombinationChart - Has bar in combination.  
        * @param {bool} showXAxis - Show XAxis. 
        */
        completeRemovingOverlappingLabels: function (canvas, extendedXDomain, hasBarInCombinationChart, showXAxis, canvasWidth) {
            if (hasBarInCombinationChart) {
                this.removeXaxisMinMax(canvas, extendedXDomain);
            }

            if (showXAxis) {
                this.drawXaxis(canvas, canvasWidth);
            }
            this.showXaxisLabels(canvas, true);
        },

        /**
        * Creates the xAxis .
        * @param {object} canvas - The canvas element.
        * @param {object} extendedXDomain - The extended x domains.          
        */
        removeXaxisMinMax: function (canvas, extendedXDomain) {
            var allLabelsText = canvas.selectAll("g.nv-focus > g.nv-x" + ".nv-axis.nvd3-svg g.tick text");

            var firstTextNode = allLabelsText.filter(function () {
                return this.__data__ === extendedXDomain[0];
            });
            var lastTextNode = allLabelsText.filter(function () {
                return this.__data__ === extendedXDomain[1];
            });

            if (firstTextNode) {
                firstTextNode.classed("hide", true);
            }
            if (lastTextNode) {
                lastTextNode.classed("hide", true);
            }

        },

        /**
        * Show highest Y value .
        * @param {object} canvas - The canvas element.  
        */
        showHighestYValue: function (canvas) {
            canvas.selectAll("g.nv-y.nv-axis.nvd3-svg g.nvd3.nv-wrap.nv-axis .tick:last-of-type text").style("opacity", 1);
        },

        /**
        * Removes Pie labels.
        * @param {object} canvas - The canvas element.  
        */
        removePieLabels: function (canvas) {
            canvas.selectAll("g.nv-pieWrap.nvd3-svg > g > g > g.nv-pieLabels text").remove();
        },

        /**
        * Centers the Pie labels.
        * @param {object} canvas - The canvas element.  
        * @param {object} sizes - The sizes object.  
        * @param {number} angleThreshold - The angle thershold.  
        * @param {function} valueFormatter - The value formatter function.  
        * @param {bool} isValueConvertedToPercent - Defines whether ther value should be converted to percent.  
        */
        centerPieLabels: function (canvas, sizes, angleThreshold, valueFormatter, isValueConvertedToPercent) {
            var self = this;
            var isVisible = this.setPieLabelsVisibility(canvas, sizes.chartCanvasWidth);
            if (!isVisible) {
                return;
            }

            var diameter = Math.min(sizes.chartCanvasHeight, sizes.chartCanvasWidth);

            var radius = diameter / 2;

            var arc = d3.svg.arc()
              .outerRadius(radius * 0.65)
              .innerRadius(radius * 0.65);

            this.removePieLabels(canvas);
            var container = canvas.selectAll("g.nv-pieWrap.nvd3-svg > g > g > g.nv-pieLabels");
            var paths = canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g.nv-pie path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
            var seriesIndex = 0;

            paths.each(function () {
                var x1 = arc.centroid(this._current)[0];
                var y1 = arc.centroid(this._current)[1];
                var angle = this._current.endAngle - this._current.startAngle;
                if (angle > angleThreshold) {
                    container
                      .append("text")
                      .attr({
                          x: x1,
                          y: y1 + 4
                      })
                      .style("text-anchor", "middle")
                      .attr("class", "sc-internal-label-text")
                      .attr("sc-series-index", seriesIndex)
                      .attr("pointer-events", "none")
                      .style("opacity", 0)
                      .text(isValueConvertedToPercent ? self.calculatedPercentageFormatter(this._current.data.percentage) : valueFormatter(this._current.data.y))
                      .transition()
                      .duration(models.constants.animations.medium)
                      .style("opacity", 1);
                }

                seriesIndex++;
            });
        },

        /**
        * Sets the Value labels color.     
        * @param {object} canvas - The canvas element.  
        * @param {int} chartType - The chart type.  
        * @param {int} visualizationMode - The visualizationMode.  
        */
        setValueLabelsColor: function (canvas, seriesIndex, chartType, visualizationMode) {
            var chartSelectorClass = "",
              color = models.constants.darkLayerColor,
              opacity = 1;

            switch (chartType) {
                case models.constants.chartType.pie:
                    chartSelectorClass = ".nv-pieLabels text[sc-series-index='" + seriesIndex + "']";
                    break;
            }
            if (chartSelectorClass !== "") {

                switch (visualizationMode) {
                    case models.constants.visualizationMode.emphasized:
                        color = models.constants.brightLabelColor;
                        opacity = 1;
                        break;
                    case models.constants.visualizationMode.deemphasized:
                        color = models.constants.darkLayerColor;
                        opacity = models.constants.legendItemBrighterLayerOpacity;
                        break;
                    case models.constants.visualizationMode.standard:
                        color = models.constants.darkLayerColor;
                        opacity = 1;
                        break;
                }

                canvas.selectAll(chartSelectorClass)
                  .transition()
                  .duration(models.constants.animations.fast)
                  .style("fill", color)
                  .style("opacity", opacity);
            }
        },

        /**
        * Reset value labels color.
        * @param {object} canvas - The canvas element.
        * @param {number} chartType - The chart type.  
        */
        resetValueLabelsColor: function (canvas, chartType) {
            var chartSelectorClass = "";

            switch (chartType) {
                case models.constants.chartType.pie:
                    chartSelectorClass = ".nv-pieLabels .sc-internal-label-text";
                    break;
            }
            if (chartSelectorClass !== "") {
                canvas.selectAll(chartSelectorClass + " text")
                  .style("fill", models.constants.darkLayerColor)
                  .style("opacity", 1);
            }
        },

        /**
        * Shows or hides the Pie labels .
        * @param {object} canvas - The canvas element.  
        */
        setPieLabelsVisibility: function (canvas, chartCanvasWidth) {
            var status = chartCanvasWidth < models.constants.pieLabelsVisibilityThreshold;
            canvas.selectAll(".nv-pieLabels").classed("hide", status);

            return !status;
        },

        /**
        * Sets the y-axis label.
        * @param {object} componentElement - The component element.  
        * @param {string} label - The label value.  
        */
        setYAxisLabel: function (componentElement, label) {
            componentElement.querySelector(".nv-axislabel.custom").innerHTML = label ? label : "";
        },

        /**
        * Sets the y-axis label.
            * @param {object} componentElement - The component element.
            * @param {object} data - The chart data.
        */
        setYAxisLabels: function (componentElement, data, palette) {
            var iconSize = models.constants.legend.iconSize / 2;
            var textPosition = iconSize + 5;
            var container = d3.select("#svg-yaxis-labels-" + componentElement.attr(models.constants.idSelector));
            var leftGroup = container.select(".left-axis-group");
            var rightGroup = container.select(".right-axis-group");
            var itemsGap = 10;
            leftGroup.selectAll("*").remove();
            rightGroup.selectAll("*").remove();
            var dataLength = data.length;
            var maxLegendItemWidth = ((componentElement.width() * 0.7) / (dataLength - 1)) - textPosition;
            var rigthLegendItemPosition = componentElement.width();

            for (var index = 0; index < dataLength; index++) {
                if (data[index].legendState !== models.constants.legendState.unchecked) {
                    var color = models.colors.getPaletteColor(palette, index);
                    if (data[index].bar) {
                        this.setCombinationYAxisSeriesNames(((componentElement.width() * 0.3) - itemsGap - textPosition), leftGroup, data[index].displayName, true, color, iconSize, 1, index, textPosition);
                    } else {
                        rigthLegendItemPosition = this.setCombinationYAxisSeriesNames(maxLegendItemWidth, rightGroup, data[index].displayName, false, color, iconSize, rigthLegendItemPosition, index, textPosition) - itemsGap;
                    }
                }
            }
        },

        /**
        * Sets the CombinationChart y-axis labels.
        **/
        setCombinationYAxisSeriesNames: function (maxLegendItemWidth, axisGroup, displayName, isLeftAxis, color, iconSize, legendItemPosition, index, textPosition) {
            var height = models.constants.yAxisLabelHeight;
            var group = axisGroup.append("g")
              .attr("sc-series-index", index);

            var background = group.append("rect")
              .style("fill", models.constants.darkLayerColor)
              .style("fill-opacity", 0)
              .attr("x", 0)
              .attr("y", 1)
              .attr("height", height)
              .attr("sc-series-index", index);

            background.append("title")
              .text(displayName);

            var text = group.append("text")
              .attr("text-anchor", "start")
              .attr("class", "nv-legend-text")
              .attr("x", textPosition)
              .attr("y", 12)
              .text(displayName)
              .attr("pointer-events", "none");

            models.utils.ellipse(text, maxLegendItemWidth, 0, 0, false, false);

            var textWidth = models.utils.getBBoxWidth(text);

            var rect = group.append("rect")
              .attr("x", 1)
              .attr("y", ((height - iconSize) / 2) - 1)
              .attr("width", iconSize)
              .attr("height", iconSize)
              .style("fill", color)
              .style("stroke", color)
              .style("stroke-width", 2)
              .style("fill-opacity", 1)
              .attr("pointer-events", "none")
              .classed("icon", true);

            if (!isLeftAxis) {
                rect.attr("rx", iconSize / 2);
                rect.attr("ry", iconSize / 2);
            }

            var width = textPosition + textWidth;
            background.attr("width", width);

            var groupPosition = isLeftAxis ? 0 : (legendItemPosition - width);
            group.attr("transform", "translate(" + groupPosition + ", 0)");
            return groupPosition;
        },

        /**
        * Sets the CombinationChart right y-axis labels.
        * @param {object} canvas - The canvas element.  
        * @param {object} chart - The chart element.
        * @param {function} valueFormatter2 - The valueFormatter function for the Y2 axis (right).  
        */
        setCombinationChartRightYAxisLabels: function (canvas, chart, isBarSeriesUnchecked, valueFormatter2) {
            var mainSelector = "g.nvd3.nv-wrap.nv-linePlusBar g.nv-focus";
            if (isBarSeriesUnchecked) {
                canvas.select(mainSelector + " g.nvd3.nv-wrap.nv-axis.custom").remove();
                canvas.selectAll(mainSelector + " g.nv-y2.nv-axis.nvd3-svg .tick text").style("display", "inline");
                return;
            }

            canvas.select(mainSelector + " g.nvd3.nv-wrap.nv-axis.custom").remove();
            canvas.selectAll(mainSelector + " g.nv-y2.nv-axis.nvd3-svg .tick text").style("display", "none");
            setTimeout(function () {
                var ticks = canvas.selectAll(mainSelector + " g.nv-y1.nv-axis.nvd3-svg > g > g > .tick");
                var container = canvas.select(mainSelector + " g.nv-y2.nv-axis.nvd3-svg");
                var index = 0;

                var container2 = container.append("g")
                  .style("opacity", 0)
                  .classed("nvd3 nv-wrap nv-axis custom", true);
                var container3 = container2.append("g");

                ticks.each(function () {
                    var tick = d3.select(this);
                    var transform = d3.transform(tick.attr("transform"));
                    var y = parseFloat(transform.translate[1]);

                    var value = chart.y2Axis.scale().invert(y);
                    if (valueFormatter2) {
                        value = valueFormatter2(chart.y2Axis.scale().invert(y));
                    }

                    var group = container3.append("g")
                      .classed(index === 0 ? "tick zero" : "tick", true)
                      .style("opacity", 1)
                      .attr("transform", "translate(0," + y + ")");
                    group.append("text")
                      .attr("dy", ".32em")
                      .attr("x", 3)
                      .attr("y", 0)
                      .style("text-anchor", "start")
                      .text(value);
                    index++;
                });
                canvas.select(mainSelector + " g.nvd3.nv-wrap.nv-axis.custom")
                  .transition()
                  .duration(models.constants.animations.medium)
                  .style("opacity", 1);
            }, models.constants.animations.slow);
        },

        /**
        * Sets the Doughnut internal labels.
        * @param {object} svgElement - The svgElement element.  
        * @param {string} allCategoriesLabel - The all categories label.  
        * @param {string} value - The slice value.
        * @param {string} valueDescriptionLabel - The value description label.
        * @param {object} sizes - The chart width.        
        */
        setDoughnutInternalLabels: function (svgElement, allCategoriesLabel, value, valueDescriptionLabel, sizes) {
            allCategoriesLabel = allCategoriesLabel ? allCategoriesLabel.toString() : "";
            valueDescriptionLabel = valueDescriptionLabel ? valueDescriptionLabel.toString() : "";

            var isStartTrimmingLocation = false;
            var canvas = svgElement.select("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g.nv-pie");
            var diameter = Math.min(sizes.chartCanvasHeight, sizes.chartCanvasWidth);
            if (diameter < models.constants.doughnutLabelsVisibilityThreshold) {
                canvas.select(".sc-doughnut-label").remove();
                return;
            }

            var holeOffset = 14;
            if (diameter < 200) {
                holeOffset += (200 - diameter) / 8;
            }

            var holeWidth = ((diameter * 0.8) / 2) - holeOffset;
            var fontSize = Math.floor((diameter) / 10);
            var allCategoryFontSize = (fontSize * 0.75);
            var valueDescriptionFontSize = (fontSize * 0.5);
            var group,
              allCategoriesTextElement,
              valueTextElement,
              valueDescriptionTextElement;

            canvas.select(".sc-doughnut-label").remove();
            group = canvas.append("g")
              .style("opacity", 0)
              .classed("sc-doughnut-label", true);

            if (allCategoriesLabel.length > 0) {
                allCategoriesTextElement = group.append("text")
                  .attr("text-anchor", "middle")
                  .classed("sc-doughnut-label-all-categories", true)
                  .text(allCategoriesLabel);
            }
            valueTextElement = group.append("text")
              .attr("text-anchor", "middle")
              .attr("transform", "translate(0,0)")
              .style("font-weight", "bold")
              .classed("sc-doughnut-label-value", true)
              .text(value);

            if (valueDescriptionLabel.length > 0) {
                valueDescriptionTextElement = group.append("text")
                  .attr("text-anchor", "middle")
                  .classed("sc-doughnut-label-value-description", true)
                  .text(valueDescriptionLabel);
            }

            var groupYPos = (fontSize / 3);
            if (allCategoriesLabel.length === 0 && valueDescriptionLabel.length > 0) {
                groupYPos = -(fontSize / 5);
            }

            if (allCategoriesLabel.length > 0 && valueDescriptionLabel.length === 0) {
                groupYPos = fontSize;
            };

            group.attr("transform", "translate(0," + groupYPos + ")");
            if (allCategoriesLabel.length > 0) {
                allCategoriesTextElement
                  .attr("transform", "translate(0, -" + (allCategoryFontSize * 1.6) + ")")
                  .style("font-size", allCategoryFontSize + "px");
                models.utils.ellipse(allCategoriesTextElement, holeWidth, 0, 0, isStartTrimmingLocation, false);
            }

            valueTextElement
              .style("font-size", fontSize + "px");
            models.utils.ellipse(valueTextElement, holeWidth, 0, 0, isStartTrimmingLocation, true);

            if (valueDescriptionLabel.length > 0) {
                valueDescriptionTextElement
                  .attr("transform", "translate(0," + (valueDescriptionFontSize * 1.6) + ")")
                  .style("font-size", valueDescriptionFontSize + "px");
                models.utils.ellipse(valueDescriptionTextElement, holeWidth, 0, 0, isStartTrimmingLocation, false);
            }

            //if (!isResizing) {
            group
              .transition()
              .duration(models.constants.animations.medium)
              .style("opacity", 1);
            //}
        },

        /**
        * Creates doughnut callout labels.
        * @param {object} chartProperties - The chartProperties object.                  
        * @param {object} isCalloutLabelWithValue - Defines whether the callout labels have value.
        * @param {bool} isCalloutValueConvertedToPercent - Defines whether the callout value should be converted to percent.         
        */
        createDoughnutCalloutLabels: function (chartProperties, isCalloutLabelWithValue, isCalloutValueConvertedToPercent) {
            var canvas = chartProperties.svgElement,
              data = chartProperties.chartData,
              palette = chartProperties.palette,
              sizes = chartProperties.sizes,
              valueFormatter = chartProperties.valueFormatter,
              self = this,
              diameter = Math.min(sizes.chartCanvasHeight, sizes.chartCanvasWidth);

            var container = canvas.select("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g");
            this.removeDoughnutLabels(canvas);

            if (diameter < models.constants.doughnutLabelsVisibilityThreshold) {
                return;
            }

            var nvPie = canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g.nv-pie");
            var transform = nvPie.attr("transform");
            var t = d3.transform(transform);
            var offset = parseFloat(t.translate[0]);

            var labelLines = container.insert("g", ":first-child")
              .attr("transform", transform)
              .attr("class", "sc-labels-lines");

            var radius = diameter / 2;

            var arc = d3.svg.arc()
              .outerRadius((radius * 0.8) - 1)
              .innerRadius((radius * 0.8) - 1);

            var paths = canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g.nv-pie path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
            var index = 0;
            paths.each(function () {
                var startAngle = this._current.startAngle;
                var endAngle = this._current.endAngle;
                var midAngle = (startAngle + endAngle) / 2;
                var lineLength = diameter / 10;
                var textAnchor = "start";
                var xPositionAdjustment = 2;
                var isLeftSide = (midAngle > Math.PI);
                if (isLeftSide) {
                    lineLength = -lineLength;
                    textAnchor = "end";
                    xPositionAdjustment = -2;
                }
                var x1 = arc.centroid(this._current)[0];
                var x2 = x1 + lineLength;
                var y1 = arc.centroid(this._current)[1];
                var y2 = y1;

                var textXPosition = x2 + xPositionAdjustment;
                var line = labelLines
                  .append("line")
                  .attr({
                      x1: x1,
                      y1: y1,
                      x2: x1,
                      y2: y2
                  })
                  .style("stroke", models.colors.getPaletteColor(palette, index))
                  .attr("class", "sc-label-line")
                  .attr("sc-series-index", index);


                var label = this._current.data.x;
                if (isCalloutLabelWithValue) {
                    if (isCalloutValueConvertedToPercent) {
                        label += "  " + self.calculatedPercentageFormatter(this._current.data.percentage);
                    } else {
                        label += "  " + valueFormatter(this._current.data.y);
                    }
                }

                var text = labelLines
                  .append("text")
                  .attr({
                      x: textXPosition,
                      y: y2 + 4
                  })
                  .style("text-anchor", textAnchor)
                  .attr("class", "sc-label-text")
                  .style("opacity", 0)
                  .text(label);

                var textLength = text.node().getComputedTextLength();
                var trimmedText = label;
                if (isLeftSide) {
                    if ((offset + textXPosition - textLength) < 0) {
                        trimmedText = models.utils.ellipse(text, offset + textXPosition, 2, 2, false, true);
                    }
                } else {
                    if ((textXPosition + textLength + offset) > sizes.chartCanvasWidth) {
                        trimmedText = models.utils.ellipse(text, (sizes.chartCanvasWidth - offset - textXPosition), 2, 2, false, true);
                    }
                }
                var trimmedTextNoEllipses = trimmedText.toString().replace("...", "").replace("..", "");

                if (trimmedTextNoEllipses.length <= 2) {
                    text.remove();
                    line.remove();
                } else {
                    line
                      .transition()
                      .duration(models.constants.animations.medium)
                      .attr("x2", x2);

                    text.transition()
                      .duration(models.constants.animations.medium)
                      .style("opacity", 1);

                    index++;
                }
            });
        },

        /**
        * Shows or hides the Pie labels .
        * @param {object} canvas - The canvas element.  
        */
        removeDoughnutLabels: function (canvas) {
            canvas.select("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g .sc-labels-lines").remove();
        },

        /**
        * Shows custom axis label.        
        * @param {object} componentElement - The component element.  
        */
        showCustomAxisLabel: function (componentElement) {
            componentElement.find(".nv-axislabel.custom").toggle(true);
        },

        /**
        * Hides custom axis label.  
        * @param {object} componentElement - The component element.        
        */
        hideCustomAxisLabel: function (componentElement) {
            componentElement.find(".nv-axislabel.custom").toggle(false);
        },

        /**
        * Format Category and Value axisl.        
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatAxisLabels: function (chartProperties) {
            this.formatCategoryAxisLabels(chartProperties);
            this.formatValueAxisLabels(chartProperties);
        },

        /**
        * Format Combination Category and Value axis.        
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatCombinationAxisLabels: function (chartProperties) {
            this.formatCombinationCategoryAxisLabels(chartProperties);
            this.formatCombinationValueAxisLabels(chartProperties);
        },

        /**
        * Format Category  axis.        
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatCategoryAxisLabels: function (chartProperties) {
            if (chartProperties.seriesDefinitions[0].categoryDataFormatting) {
                chartProperties.categoryFormatter = function (value) {
                    return models.formatter.format(value, chartProperties.seriesDefinitions[0].categoryDataFormatting);
                };
                chartProperties.chartElement.xAxis.tickFormat(function (d) {
                    return chartProperties.categoryFormatter(d);
                });
            }
        },

        /**
        * Format Value axis.
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatValueAxisLabels: function (chartProperties) {
            if (chartProperties.seriesDefinitions[0].valueDataFormatting) {
                chartProperties.valueFormatter = function (value) {
                    return models.formatter.format(value, chartProperties.seriesDefinitions[0].valueDataFormatting);
                };
                chartProperties.chartElement.yAxis.tickFormat(function (d) {
                    return chartProperties.valueFormatter(d);
                });
            }
        },

        /**
        * Format Category  axis.        
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatCombinationCategoryAxisLabels: function (chartProperties) {
            if (chartProperties.seriesDefinitions[0].categoryDataFormatting) {
                chartProperties.categoryFormatter = function (value) {
                    if (chartProperties.hasDateCategory) {
                        value = new Date(value);
                    }
                    return models.formatter.format(value, chartProperties.seriesDefinitions[0].categoryDataFormatting);
                };
                chartProperties.chartElement.xAxis.tickFormat(function (d) {
                    return chartProperties.categoryFormatter(d);
                });
            }
        },

        /**
        * Format Combination Value axis.
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatCombinationValueAxisLabels: function (chartProperties) {

            var firstSeriesIndex = chartProperties.hasBarSeries ? chartProperties.barSeriesIndex : 0;
            if (chartProperties.seriesDefinitions[firstSeriesIndex].valueDataFormatting) {
                chartProperties.valueFormatter = function (value) {
                    return models.formatter.format(value, chartProperties.seriesDefinitions[firstSeriesIndex].valueDataFormatting);
                };
                chartProperties.chartElement.y1Axis.tickFormat(function (d) {
                    return chartProperties.valueFormatter(d);
                });
            }

            for (var index = 0; index < chartProperties.chartData.length; index++) {
                if (!chartProperties.chartData[index].bar) {
                    if (chartProperties.seriesDefinitions[index].valueDataFormatting) {
                        chartProperties.valueFormatter2 = function (value) {
                            return models.formatter.format(value, chartProperties.seriesDefinitions[index].valueDataFormatting);
                        };
                        chartProperties.chartElement.y2Axis.tickFormat(function (d) {
                            return chartProperties.valueFormatter2(d);
                        });

                        return;
                    }
                }
            };
        },

        /**
        * Format Pie Value labels.
        * @param {object} chartProperties - The ChartProperties object.  
        */
        formatPieValueLabels: function (chartProperties) {
            if (chartProperties.seriesDefinitions[0].valueDataFormatting) {
                chartProperties.valueFormatter = function (value) {
                    return models.formatter.format(value, chartProperties.seriesDefinitions[0].valueDataFormatting);
                };
                chartProperties.chartElement.valueFormat(function (d) {
                    return chartProperties.valueFormatter(d);
                });
            }
        },

        /**
        * ValueFormatter function for calculated percentages
        * @param {number} value - The value.  
        */
        calculatedPercentageFormatter: function (value) {
            // Globalize formats percentage number as a value from 0 to 1
            return models.formatter.format(value / 100, models.constants.defaultNumberDataFormattingForPercentages);
        },

        /**
        * validateNoData function. Shows No data message if no data
        * @param {object} data - The data.  
        * @param {object} chartProperties - The chartProperties.  
        * @param {string} noDataToDisplay - The noDataToDisplay message.  
        * @param {bool} isTitleVisible - IsTitleVisible flag.          
        * @param {bool} isTooltipVisible - IsTooltipVisible flag.          
        */
        validateNoData: function (data, chartProperties, noDataToDisplay, isTitleVisible, isTooltipVisible) {
            var legendContainer = d3.select("#svg-legend-" + chartProperties.componentElement.attr(models.constants.idSelector));

            var container = d3.select(chartProperties.canvasId);

            var messagePanel = chartProperties.componentElement.find("div.sc-d3-nodata-panel");

            if (!data || data.length === 0) {

                chartProperties.chartData = [];
                models.nvd3Tooltip.disableTooltip(true, chartProperties.chartElement, chartProperties.chartType);
                if (chartProperties.chartType === models.constants.chartType.combination) {
                    d3.select("#svg-yaxis-labels-" + chartProperties.componentElement.attr(models.constants.idSelector)).attr("opacity", 0);
                }
                this.hideCustomAxisLabel(chartProperties.componentElement);
                legendContainer.classed("hide", true);

                container.selectAll("*").remove();
                container.html("");
                messagePanel.toggle(true);

                return false;
            }

            messagePanel.toggle(false);
            if (chartProperties.chartType === models.constants.chartType.combination) {
                d3.select("#svg-yaxis-labels-" + chartProperties.componentElement.attr(models.constants.idSelector)).attr("opacity", 1);
            }
            models.nvd3Tooltip.disableTooltip(!isTooltipVisible, chartProperties.chartElement, chartProperties.chartType);
            this.showCustomAxisLabel(chartProperties.componentElement);
            legendContainer.classed("hide", false);
            return true;
        },

        /**
        * Shows line chart max value if tehre is only 1 tick .
        * @param {object} canvas - The canvas element.  
        */
        showLineChartMaxYLabel: function (canvas) {
            this.showChartMaxYLabel(canvas, ".nvd3.nv-wrap.nv-lineChart");
        },

        /**
        * Shows Area chart max value if tehre is only 1 tick .
        * @param {object} canvas - The canvas element.  
        */
        showAreaChartMaxYLabel: function (canvas) {
            this.showChartMaxYLabel(canvas, ".nvd3.nv-wrap.nv-stackedAreaChart");
        },

        /**
        * Shows chart max value if tehre is only 1 tick .
        * @param {object} canvas - The canvas element.  
        * @param {string} selector - The chart specific selector.  
        */
        showChartMaxYLabel: function (canvas, selector) {
            setTimeout(function () {
                var numberOfTicks = canvas.selectAll(selector + " .nv-y.nv-axis.nvd3-svg .nvd3.nv-wrap.nv-axis g.tick")[0].length;
                var element = canvas.selectAll(selector + " .nv-y.nv-axis.nvd3-svg .nvd3.nv-wrap.nv-axis .nv-axisMaxMin.nv-axisMaxMin-y.nv-axisMax-y");
                if (numberOfTicks < 2) {
                    element.style("display", "block");
                } else {
                    element.style("display", "none");
                }
            }, Sitecore.Speak.D3.models.constants.animations.slow
            );
        }
    }
}(Sitecore.Speak.D3.models));


