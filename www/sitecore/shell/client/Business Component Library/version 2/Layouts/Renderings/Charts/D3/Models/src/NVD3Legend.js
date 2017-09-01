(function (models) {
    models.nvd3Legend = {
        /**
         * Style the legend icon    
         * @param {string} canvas - The canvas element to add the tooltip to.      
         */
        styleLegendIcon: function (canvas) {
            canvas.selectAll(".nv-series")[0].forEach(function (d) {
                var group = d3.select(d);
                var circle = group.select("circle");
                if (circle.node()) {
                    var fill = circle.style("fill");
                    var stroke = circle.style("stroke");
                    var strokeWidth = circle.style("stroke-width");
                    var fillOpacity = circle.style("fill-opacity");
                    circle.remove();
                    group.append("rect")
                        .attr("x", -5)
                        .attr("y", -5)
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", fill)
                        .style("stroke", stroke)
                        .style("stroke-width", strokeWidth)
                        .style("fill-opacity", fillOpacity);
                }
            });
        },

        /**
        * Handles legend state changes.
        * 
        * @param {string} canvas - The svg canvas to add the tooltip to.      
        * @param {object} data - The data.      
        * @param {bool} isSelected - Defines whether thelegend item is selected.
        * @param {int} eventType - The event type.
        */
        handleLegendState: function (canvas, chartProperties, selectionIndex, eventType) {
            var index;

            if (chartProperties.chartData.length === 0) {
              return;
            }

            if (selectionIndex >= 0) {
                var currentState = chartProperties.chartData[selectionIndex].legendState;

                switch (eventType) {
                    // mouseClick
                    case models.constants.eventType.mouseClick:
                        this.removeLegendItemEmphasis(canvas, selectionIndex);
                        models.nvd3VisualizationManager.removeAllInsideLines(chartProperties.svgElement);
                        // multipleCheck
                        if (chartProperties.legendMode === models.constants.legendMode.multipleCheck) {
                            switch (currentState) {
                                case models.constants.legendState.checked:
                                    if (this.isLastCheckedLegendItem(chartProperties.chartData, selectionIndex)) {
                                        chartProperties.chartData.forEach(function (item) {
                                            item.legendState = models.constants.legendState.checked;
                                        });
                                    } else {
                                        chartProperties.chartData[selectionIndex].legendState = models.constants.legendState.unchecked;
                                    }
                                    break;
                                case models.constants.legendState.unchecked:
                                    chartProperties.chartData[selectionIndex].legendState = models.constants.legendState.checked;
                                    break;
                            }
                        } else {
                            //exclusivecheck
                            switch (currentState) {
                                case models.constants.legendState.checked:
                                    if (this.areAllLegendItemsChecked(chartProperties.chartData)) {
                                        for (index = 0; index < chartProperties.chartData.length; index++) {
                                            if (index !== selectionIndex) {
                                                chartProperties.chartData[index].legendState = models.constants.legendState.disengaged;
                                            }                                                                                                                                    
                                        }
                                        chartProperties.selectedIndex = selectionIndex;
                                    } else {
                                        if (this.isLastCheckedLegendItem(chartProperties.chartData, selectionIndex)) {
                                            for (index = 0; index < chartProperties.chartData.length; index++) {
                                                chartProperties.chartData[index].legendState = models.constants.legendState.checked;
                                            }
                                        }
                                        chartProperties.selectedIndex = -1;
                                    }
                                    break;
                                case models.constants.legendState.disengaged:
                                    chartProperties.chartData[selectionIndex].legendState = models.constants.legendState.checked;
                                    for (index = 0; index < chartProperties.chartData.length; index++) {
                                        if (index !== selectionIndex) {
                                            chartProperties.chartData[index].legendState = models.constants.legendState.disengaged;
                                        }
                                    }
                                    chartProperties.selectedIndex = selectionIndex;
                                    break;
                            }
                        }
                        break;

                        // mouseOver
                    case models.constants.eventType.mouseOver:
                        if (currentState === models.constants.legendState.disengaged) {
                            this.engageLegendIcon(canvas, selectionIndex);
                        }
                        if (currentState !== models.constants.legendState.unchecked) {
                            this.setLegendItemMouseOver(canvas, selectionIndex);
                        }
                        return;

                        // mouseOut
                    case models.constants.eventType.mouseOut:
                        if (currentState !== models.constants.legendState.unchecked) {
                            this.setLegendItemMouseOut(canvas, selectionIndex);
                        }
                        if (currentState === models.constants.legendState.disengaged) {
                            this.disengageLegendIcon(canvas, selectionIndex);
                        }
                        return;
                }
            }

            index = 0;
            chartProperties.chartData.forEach(function (item) {
                if (item.previusLegendState !== item.legendState) {
                    item.previusLegendState = item.legendState;
                    this.setChartVisualization(item, index, chartProperties, canvas);
                }
                index++;
            }.bind(this));
        },

        /**
        * Handles chart visualization changes.
        *     
        * @param {object} item - The current legend data item.      
        * @param {int} index - The legend item index.
        * @param {object} chartProperties - The chart properties.
        * @param {string} canvas - The legend canvas.      
        */
        setChartVisualization: function (item, index, chartProperties, canvas) {
            switch (item.legendState) {
                case (models.constants.legendState.checked):
                    this.selectLegendIcon(canvas, index, true);
                    item.disabled = false; // nvd3 status
                    models.nvd3VisualizationManager.setSeriesVisualization(
                        chartProperties.svgElement,
                        chartProperties.chartData,
                        index,
                        models.constants.visualizationMode.standard,
                        chartProperties.chartType,
                        false);
                    if (chartProperties.chartType === models.constants.chartType.pie) {
                        models.nvd3Axis.setValueLabelsColor(chartProperties.svgElement, index, chartProperties.chartType, models.constants.visualizationMode.standard);
                    }
                                
                    break;

                case (models.constants.legendState.unchecked):
                    this.selectLegendIcon(canvas, index, false);
                    item.disabled = true; // nvd3 status
                    models.nvd3VisualizationManager.setSeriesVisualization(
                        chartProperties.svgElement,
                        chartProperties.chartData,
                        index,
                        models.constants.visualizationMode.notVisible,
                        chartProperties.chartType,
                        false);
                    break;

                case (models.constants.legendState.disengaged):
                    this.disengageLegendIcon(canvas, index);
                    item.disabled = false; // nvd3 status

                    switch (chartProperties.chartType) {
                        case models.constants.chartType.combination:
                            if (chartProperties.chartData[index].bar) {
                                models.nvd3VisualizationManager.setRectSeriesVisualization(
                                    chartProperties.svgElement,
                                    chartProperties.chartData,
                                    index,
                                    models.constants.visualizationMode.deemphasized,
                                    chartProperties.chartType,
                                    false);                               
                            } else {
                                models.nvd3VisualizationManager.setPathSeriesVisualization(
                                    chartProperties.svgElement,
                                    chartProperties.chartData,
                                    index,
                                    models.constants.visualizationMode.deemphasized,
                                    chartProperties.chartType,
                                    false);
                            }
                            break;
                        case models.constants.chartType.column:
                        case models.constants.chartType.bar:
                            models.nvd3VisualizationManager.setRectSeriesVisualization(
                                chartProperties.svgElement,
                                chartProperties.chartData,
                                index,
                                models.constants.visualizationMode.deemphasized,
                                chartProperties.chartType,
                                false);
                            break;
                        case models.constants.chartType.area:
                        case models.constants.chartType.line:
                        case models.constants.chartType.pie:
                        case models.constants.chartType.doughnut:
                            models.nvd3VisualizationManager.setPathSeriesVisualization(
                                chartProperties.svgElement,
                                chartProperties.chartData,
                                index,
                                models.constants.visualizationMode.deemphasized,
                                chartProperties.chartType,
                                false);                            
                            if (chartProperties.chartType === models.constants.chartType.pie) {
                                models.nvd3Axis.setValueLabelsColor(chartProperties.svgElement, index, chartProperties.chartType, models.constants.visualizationMode.deemphasized);
                            }
                            break;
                    }
                    break;
            }
        },

        /**
        * Reload legend state.
        *     
        * @param {object} chartProperties - The chart properties.      
        * @param {object} canvas - The canvas.
        */
        reloadLegendState: function (chartProperties, canvas) {
            var index = 0;
            chartProperties.chartData.forEach(function (item) {
                this.setChartVisualization(item, index, chartProperties, canvas);
                index++;
            }.bind(this));
        },

        /**
        * Handles the legend item mouse over.
        * 
        * @param {string} canvas - The svg canvas to add the tooltip to.      
        * @param {number} legendIndex - Legend item index.          
        */
        setLegendItemMouseOver: function (canvas, index) {
            var legendItem = canvas.select(".nv-series:nth-child(" + (index + 1) + ")");
            var rect = legendItem.select("rect.icon");
            this.emphasizeLegendIcons(legendItem, rect, index, models.constants.visualizationMode.emphasized);
            legendItem.select("text").style("text-decoration", "underline");
        },

        /**
        * Handles the legend item mouse out.
        * 
        * @param {string} canvas - The legend canvas.      
        * @param {number} legendIndex - Legend item index.          
        */
        setLegendItemMouseOut: function (canvas, legendIndex) {
            var legendItem = canvas.select(".nv-series:nth-child(" + (legendIndex + 1) + ")");
            var rect = legendItem.select("rect.icon");
            this.emphasizeLegendIcons(legendItem, rect, legendIndex, models.constants.visualizationMode.standard);
            legendItem.select("text").style("text-decoration", "none");
        },

        /**
        * Selects the legend icon
        * 
        * @param {string} canvas - The legend canvas.      
        * @param {number} legendIndex - Legend item index.      
        * @param {bool} isSelected - Defines whether thelegend item is selected.
        */
        selectLegendIcon: function (canvas, legendIndex, isSelected) {
            var legendItem = canvas.select(".nv-series:nth-child(" + (legendIndex + 1) + ")");
            var rect = legendItem.select("rect.icon");
            this.engageLegendIcon(canvas, legendIndex);
            rect.style("fill-opacity", isSelected ? 1 : 0);
        },

        /**
        * Engage the legend icon
        * 
        * @param {string} canvas - The legend canvas.      
        * @param {number} legendIndex - Legend item index.      
        */
        engageLegendIcon: function (canvas, legendIndex) {
            var legendItem = canvas.select(".nv-series:nth-child(" + (legendIndex + 1) + ") ");
            legendItem.style("opacity", 1);
        },

        /**
        * Disengage the legend icon
        * 
        * @param {string} canvas - The legend canvas.
        * @param {number} legendIndex - Legend item index.      
        */
        disengageLegendIcon: function (canvas, legendIndex) {
            var legendItem = canvas.select(".nv-series:nth-child(" + (legendIndex + 1) + ") ");
            legendItem.style("opacity", models.constants.legendItemBrighterLayerOpacity);
        },

        /**
        * Highlights Rect elements.
        * @param {object} canvas - The canvas element.      
        * @param {object} elements - The elements to highlight.   
        * @param {int} visualizationMode - The visualizationMode.      
        * */
        emphasizeLegendIcons: function (canvas, elements, seriesIndex, visualizationMode) {
            models.nvd3VisualizationManager.setRectElementsVisualization(
                canvas,
                elements,
                seriesIndex,
                null,
                visualizationMode,
                2
                -1);
            return;
        },

        /**
        * Disengage the legend icon
        * 
        * @param {string} canvas - The svg canvas to add the tooltip to.      
        * @param {number} legendIndex - Legend item index.      
        */
        removeLegendItemEmphasis: function (canvas, legendIndex) {
            models.nvd3VisualizationManager.removeAllEmphasizeLayers(canvas);
            var legendItem = canvas.select(".nv-series:nth-child(" + (legendIndex + 1) + ")");
            legendItem.select("text").style("text-decoration", "none");
        },

        /* Checks if the selected legend item is the last selected
        * @param {object} data - The data.
        * @param {int} selectionIndex - The data selected index.
        */
        isLastCheckedLegendItem: function (data, selectionIndex) {
            for (var index = 0; index < data.length; index++) {
                if (index !== selectionIndex && data[index].legendState === models.constants.legendState.checked) {
                    return false;
                }
            }

            return true;
        },

        /* Checks if all legend item are checked
        * @param {object} data - The data.    
        */
        areAllLegendItemsChecked: function (data) {
            for (var index = 0; index < data.length; index++) {
                if (data[index].legendState !== models.constants.legendState.checked) {
                    return false;
                }
            }

            return true;
        },

        /* Center the leged
        * @param {object} componentelement - The jquery component object. 
        * @param {number} legendWidth - The legend width.
        */
        centerLegend: function (componentElement, legendWidth) {
            var customLegend = this.getLegendContainerElement(componentElement);          
            var posX = (componentElement.width() - legendWidth) / 2;
            if (posX < 0) {
                posX = 0;
            }
           
            customLegend.attr("transform", "translate(" + posX + ", 0)");
        },

        /* Center the vertical leged
        * @param {object} componentelement - The jquery component object.           
        */
        centerVerticalLegend: function (componentElement, chartHeight) {
            var customLegend = d3.select("#svg-legend-" + componentElement.attr(models.constants.idSelector));
            var legendHeight = models.utils.getBBoxHeight(customLegend);
            var legedWrapper = customLegend.select(".nv-legendWrap.nvd3-svg");
            var posY = (chartHeight - legendHeight) / 2;
            legedWrapper.attr("transform", "translate(0, " + posY + ")");
        },

        /**
         * Creates the legend
         * @param {object} chartProperties - The chartProperties object.  
         */
        createLegend: function (chartProperties) {
            // remove 
            //chartProperties.svgElement.selectAll(".sc-emphasize-mask, .sc-deemphasize-mask").remove();

            if (!chartProperties.isLegendVisible) {
                // height = 0 is here used instead of display=none because of an NVD3 issue with the tooltip being misplaced
                d3.select("#svg-legend-" + chartProperties.componentElement.attr(models.constants.idSelector)).style("height", "0");
                return;
            }

            d3.select("#svg-legend-" + chartProperties.componentElement.attr(models.constants.idSelector)).style("height", models.constants.legend.legendItemHeight + "px");
            var customLegend = this.getLegendContainerElement(chartProperties.componentElement);
            var iconSize = models.constants.legend.iconSize;
            var textPosition = models.constants.legend.textPosition;            
            var numberOfSeries = chartProperties.chartData.length;
            var maxLegendItemWidth = (chartProperties.componentElement.width() / numberOfSeries) - textPosition - models.constants.legend.legendItemsMargin;
            var legendItemPosition = 1;
            var index = 0;
            customLegend.selectAll(".nv-series").remove();
            var self = this;
            chartProperties.chartData.forEach(function (serie) {
                var group = customLegend.append("g")
                    .attr("class", "nv-series")
                    .attr("sc-series-index", index)
                    .attr("transform", "translate(" + legendItemPosition + ", 2)");

                var background = group.append("rect")
                    .style("fill", models.constants.darkLayerColor)
                    .style("fill-opacity", 0)
                    .attr("x", 0)
                    .attr("y", 1)
                    .attr("height", iconSize + 2)
                    .attr("sc-series-index", index);

                background.append("title")
                    .text(serie.displayName);

              background.on('click', function () {
                    if (chartProperties.chartData.length === 0) {
                      return;
                    }
                    var seriesIndex = parseInt(d3.select(this).attr("sc-series-index"));
                    models.nvd3VisualizationManager.removeAllEmphasizeLayers(chartProperties.svgElement);
                    models.nvd3VisualizationManager.setSeriesVisualization(
                        chartProperties.svgElement,
                        chartProperties.chartData,
                        seriesIndex,
                        models.constants.visualizationMode.standard,
                        chartProperties.chartType,
                        true);

                    self.handleLegendState(customLegend, chartProperties, seriesIndex, models.constants.eventType.mouseClick);

                    var d = chartProperties.chartData[seriesIndex];
                    
                    if (chartProperties.legendMode === models.constants.legendMode.multipleCheck) {

                        if (chartProperties.hasBarSeries) {
                            if (chartProperties.chartData[chartProperties.barSeriesIndex].legendState === models.constants.legendState.unchecked) {
                                chartProperties.chartElement.lines.forceX(chartProperties.originalXDomain);
                            } else {
                                chartProperties.chartElement.lines.forceX(chartProperties.extendedXDomain);
                            }
                        }

                        chartProperties.chartElement.legend.dispatch.stateChange({
                            disabled: chartProperties.chartData.map(function (d) {
                                return !!d.disabled;
                            }),
                            disengaged: chartProperties.chartData.map(function (d) {
                                return !!d.disengaged;
                            })
                        });
                    }
                    chartProperties.chartElement.legend.dispatch.legendClick(d, seriesIndex);
                })
                    .on('mouseover', function () {
                        if (chartProperties.chartData.length === 0) {
                          return;
                        }
                        var seriesIndex = parseInt(d3.select(this).attr("sc-series-index"));

                        self.handleLegendState(customLegend, chartProperties, seriesIndex, models.constants.eventType.mouseOver, chartProperties);

                        if (chartProperties.chartData[seriesIndex].legendState === models.constants.legendState.unchecked) {
                            return;
                        }

                        models.nvd3VisualizationManager.setSeriesVisualization(
                            chartProperties.svgElement,
                            chartProperties.chartData,
                            seriesIndex,
                            models.constants.visualizationMode.emphasized,
                            chartProperties.chartType,
                            false);
                        chartProperties.chartElement.legend.dispatch.legendMouseover(chartProperties.chartData[seriesIndex], seriesIndex);
                    })
                    .on('mouseout', function () {
                        if (chartProperties.chartData.length === 0) {
                          return;
                        }

                        var seriesIndex = parseInt(d3.select(this).attr("sc-series-index"));
                        var visualizationMode;

                        self.handleLegendState(customLegend, chartProperties, seriesIndex, models.constants.eventType.mouseOut);

                        if (chartProperties.chartData[seriesIndex].legendState === models.constants.legendState.unchecked) {
                            return;
                        }

                        visualizationMode = models.constants.visualizationMode.standard;

                        if (chartProperties.chartData[seriesIndex].legendState === models.constants.legendState.disengaged) {
                            visualizationMode = models.constants.visualizationMode.deemphasized;
                        }
                        models.nvd3VisualizationManager.setSeriesVisualization(
                            chartProperties.svgElement,
                            chartProperties.chartData,
                            seriesIndex,
                            visualizationMode,
                            chartProperties.chartType,
                            false);
                        chartProperties.chartElement.legend.dispatch.legendMouseout(chartProperties.chartData[seriesIndex], seriesIndex);
                    });

                var text = group.append("text")
                    .attr("text-anchor", "start")
                    .attr("class", "nv-legend-text")
                    .attr("dx", textPosition + "px")
                    .attr("x", 0)
                    .attr("y", 12)
                    .text(serie.displayName)
                    .attr("pointer-events", "none");

                var rect = group.append("rect")
                    .style("x", 1)
                    .style("y", 1)
                    .attr("width", iconSize)
                    .attr("height", iconSize)
                    .style("fill", models.colors.getPaletteColor(chartProperties.palette, index))
                    .style("stroke", models.colors.getPaletteColor(chartProperties.palette, index))
                    .style("stroke-width", 2)
                    .style("fill-opacity", 1)
                    .attr("pointer-events", "none")
                    .classed("icon", true);

                if (chartProperties.chartType === models.constants.chartType.line ||
                    chartProperties.chartType === models.constants.chartType.area ||
                    (chartProperties.chartType === models.constants.chartType.combination && !serie.bar)) {
                    rect.attr("rx", iconSize / 2);
                    rect.attr("ry", iconSize / 2);
                }
                
                background.attr("width", textPosition + models.utils.getBBoxWidth(text));

                models.utils.ellipse(text, maxLegendItemWidth, 0, 0, false, false);

                legendItemPosition += textPosition + text.node().getComputedTextLength() + models.constants.legend.legendItemsMargin;
                self.selectLegendIcon(customLegend, index, true);
                index++;
            });

            chartProperties.legendWidth = legendItemPosition - models.constants.legend.legendItemsMargin;

            this.centerLegend(chartProperties.componentElement, chartProperties.legendWidth);
        },

        /**
        * Creates the vertical legend
        * @param {object} chartProperties - The chartProperties object.  
        * @param {string} chartHeight - The chart height.    
        */
        createVerticalLegend: function (chartProperties, chartHeight) {
            if (!chartProperties.isLegendVisible) {
                return 0;
            }

            var legendContainer = d3.select("#svg-legend-" + chartProperties.componentElement.attr(models.constants.idSelector));
            legendContainer.style("height", chartHeight + "px");
            var customLegend = this.getLegendContainerElement(chartProperties.componentElement);
            var iconSize = models.constants.legend.iconSize;
            var textPosition = models.constants.legend.textPosition;            
            var legendItemPosition = 0;
            var index = 0;
            customLegend.selectAll(".nv-series").remove();
            var self = this;
            chartProperties.chartData.forEach(function (item) {
                var group = customLegend.append("g")
                    .attr("class", "nv-series")
                    .attr("sc-series-index", index)
                    .attr("transform", "translate(2, " + legendItemPosition + ")");

                var background = group.append("rect")
                    .style("fill", models.constants.darkLayerColor)
                    .style("fill-opacity", 0)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", models.constants.legend.legendItemHeight)
                    .attr("sc-series-index", index);

                background.append("title")
                    .text(item.x);

              background.on('click', function () {
                    if (chartProperties.chartData.length === 0) {
                      return;
                    }

                    models.nvd3VisualizationManager.removeAllEmphasizeLayers(chartProperties.svgElement);
                    var seriesIndex = parseInt(d3.select(this).attr("sc-series-index"));
                    models.nvd3VisualizationManager.setSeriesVisualization(
                        chartProperties.svgElement,
                        chartProperties.chartData,
                        seriesIndex,
                        models.constants.visualizationMode.standard,
                        chartProperties.chartType,
                        true);

                    self.handleLegendState(customLegend, chartProperties, seriesIndex, models.constants.eventType.mouseClick);                    

                    var d = chartProperties.chartData[seriesIndex];

                    chartProperties.chartElement.duration(models.constants.animations.fast);

                    if (chartProperties.legendMode === models.constants.legendMode.multipleCheck) {
                        chartProperties.chartElement.legend.dispatch.stateChange({
                            disabled: chartProperties.chartData.map(function(d) {
                                return !!d.disabled;
                            }),
                            disengaged: chartProperties.chartData.map(function(d) {
                                return !!d.disengaged;
                            })
                        });
                    }     

                    chartProperties.chartElement.legend.dispatch.legendClick(d, seriesIndex);
                })
                    .on('mouseover', function () {
                        if (chartProperties.chartData.length === 0) {
                          return;
                        }

                        var seriesIndex = parseInt(d3.select(this).attr("sc-series-index"));
                        self.handleLegendState(customLegend, chartProperties, seriesIndex, models.constants.eventType.mouseOver);

                        if (chartProperties.chartData[seriesIndex].legendState === models.constants.legendState.unchecked) {
                            return;
                        }

                        models.nvd3VisualizationManager.setSeriesVisualization(
                            chartProperties.svgElement,
                            chartProperties.chartData,
                            seriesIndex,
                            models.constants.visualizationMode.emphasized,
                            chartProperties.chartType,
                            false);
                        models.nvd3Axis.setValueLabelsColor(chartProperties.svgElement, seriesIndex, chartProperties.chartType, models.constants.visualizationMode.emphasized);
                        chartProperties.chartElement.legend.dispatch.legendMouseover(chartProperties.chartData[seriesIndex], seriesIndex);
                    })
                    .on('mouseout', function () {
                        if (chartProperties.chartData.length === 0) {
                          return;
                        }

                        var seriesIndex = parseInt(d3.select(this).attr("sc-series-index"));
                        var visualizationMode;
                        self.handleLegendState(customLegend, chartProperties, seriesIndex, models.constants.eventType.mouseOut);

                        if (chartProperties.chartData[seriesIndex].legendState !== models.constants.legendState.unchecked) {
                            visualizationMode = models.constants.visualizationMode.notVisible;
                            if (chartProperties.chartData[seriesIndex].legendState === models.constants.legendState.disengaged) {
                                visualizationMode = models.constants.visualizationMode.deemphasized;
                            }

                            models.nvd3VisualizationManager.setSeriesVisualization(
                                chartProperties.svgElement,
                                chartProperties.chartData,
                                seriesIndex,
                                visualizationMode,
                                chartProperties.chartType,
                                false);

                            if (chartProperties.chartType === models.constants.chartType.pie) {
                                models.nvd3Axis.setValueLabelsColor(chartProperties.svgElement, seriesIndex, chartProperties.chartType, visualizationMode);
                            }
                        }
                        chartProperties.chartElement.legend.dispatch.legendMouseout(chartProperties.chartData[seriesIndex], seriesIndex);
                    });

                var text = group.append("text")
                    .attr("text-anchor", "start")
                    .attr("class", "nv-legend-text")
                    .attr("dx", textPosition + "px")
                    .attr("x", 0)
                    .attr("y", 12)
                    .text(item.x)
                    .attr("pointer-events", "none");

                var rect = group.append("rect")
                    .attr("x", 0)
                    .attr("y", 1)
                    .attr("width", iconSize)
                    .attr("height", iconSize)
                    .style("fill", models.colors.getPaletteColor(chartProperties.palette, index))
                    .style("stroke", models.colors.getPaletteColor(chartProperties.palette, index))
                    .style("stroke-width", 2)
                    .style("fill-opacity", 1)
                    .attr("pointer-events", "none")
                    .classed("icon", true);

                if (chartProperties.chartType === models.constants.chartType.pie ||
                    chartProperties.chartType === models.constants.chartType.doughnut) {
                    rect.attr("rx", iconSize / 2);
                    rect.attr("ry", iconSize / 2);
                }

                background.attr("width", textPosition + models.utils.getBBoxWidth(text));

                legendItemPosition += models.constants.legend.legendItemHeight;
                self.selectLegendIcon(customLegend, index, true);
                index++;
            });

            this.centerVerticalLegend(chartProperties.componentElement, chartHeight);
            return models.utils.getBBoxWidth(customLegend);
        },

        /**
        * Ellipse the vertical legend labels.
        **/
        ellipseVerticalLegend: function (componentElement, legendWidth) {
            if (legendWidth === 0) {
                return;
            }

            var maxLegendItemWidth = legendWidth - models.constants.legend.textPosition;
            var customLegend = d3.select("#svg-legend-" + componentElement.attr(models.constants.idSelector) + " g.nvd3.nv-legend");
            var labels = customLegend.selectAll(".nv-series text");
            labels.each(function () {
                models.utils.ellipse(d3.select(this), maxLegendItemWidth, 0, 0, false, false);
            });
        },

        /**
        * Defines wheter the legend should be visible
        **/
        isLegendVisible: function (isSingleSeries, isLegendHidden) {
            return (!isSingleSeries && !isLegendHidden);
        },

        /**
         * Sets the legend mode
         * @param {object} chartProperties - The chartProperties object.  
         * @param {string} legendMode - The legend mode.
         **/
        setLegendMode: function (chartProperties, legendMode) {
            return chartProperties.legendMode = (legendMode === "ExclusiveCheck") ? models.constants.legendMode.exclusiveCheck : models.constants.legendMode.multipleCheck;
        },

        /**
         * Gets legendContainer elemente
         * @param {object} componentElement - The component element.  
         **/
        getLegendContainerElement: function (componentElement) {
            return d3.select("#svg-legend-" + componentElement.attr(models.constants.idSelector) + " g.nv-legendWrap.nvd3-svg g.nvd3.nv-legend");
        }
    }
}(Sitecore.Speak.D3.models));


