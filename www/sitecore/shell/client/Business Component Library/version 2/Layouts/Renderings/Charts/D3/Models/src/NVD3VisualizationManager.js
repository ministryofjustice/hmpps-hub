(function (models) {
    models.nvd3VisualizationManager = {
        /**
        * Set Rect series visualization.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The datas element.  
        * @param {int} seriesIndex - The series index.      
        * @param {bool} visualizationMode - The visualization mode.
        * @param {int} chartType - The chart type.   
        * @param {bool} reset - Defines wheter the visulization should be reset.   
        */
        setSeriesVisualization: function (canvas, data, seriesIndex, visualizationMode, chartType, reset) {
            switch (chartType) {
                case models.constants.chartType.combination:
                    if (data[seriesIndex].bar) {
                       models.nvd3VisualizationManager.setRectSeriesVisualization(
                       canvas,
                       data,
                       seriesIndex,
                       visualizationMode,
                       chartType,
                       reset);
                    } else {
                        models.nvd3VisualizationManager.setPathSeriesVisualization(
                        canvas,
                        data,
                        seriesIndex,
                        visualizationMode,
                        chartType,
                        reset);
                    }
                    break;
                case models.constants.chartType.column:
                case models.constants.chartType.bar:
                    models.nvd3VisualizationManager.setRectSeriesVisualization(
                        canvas,
                        data,
                        seriesIndex,
                        visualizationMode,
                        chartType,
                        reset);
                    break;
                case models.constants.chartType.area:
                case models.constants.chartType.line:
                case models.constants.chartType.pie:
                case models.constants.chartType.doughnut:
                    models.nvd3VisualizationManager.setPathSeriesVisualization(
                        canvas,
                        data,
                        seriesIndex,
                        visualizationMode,
                        chartType,
                        reset);
                    break;
            }
        },
        
        /**
        * Remove dummies bars from combination chart
        * @param {object} canvas - The canvas element. 
        * @param {number} barSeriesIndex - The bar series index. 
        * @param {number} numberOfBarItems - The length of the data. 
        * */
        removeCombinationDummyBars: function (canvas, numberOfBarItems) {
            var firstBar = canvas.select("g.nv-barsWrap.nvd3-svg rect.nv-bar-0-0");
            var lastBar = canvas.select("g.nv-barsWrap.nvd3-svg rect.nv-bar-0-"+(numberOfBarItems-1));
            firstBar.style("opacity", 0);
            lastBar.style("opacity", 0);
        },

        /**
        * Set Rect series visualization.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The datas element.  
        * @param {int} seriesIndex - The series index.      
        * @param {bool} visualizationMode - The visualization mode.
        * @param {int} chartType - The chart type.   
        * @param {bool} reset - Defines wheter the visulization should be reset.   
        */
        setRectSeriesVisualization: function (canvas, data, seriesIndex, visualizationMode, chartType, reset) {
            var elements;
            if (chartType === models.constants.chartType.combination) {
              elements = canvas.selectAll("g.nv-focus g.nv-barsWrap.nvd3-svg g.nv-bars rect:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");

            } else {
                elements = canvas.selectAll("g.nv-group.nv-series-" + models.utils.getVisibleSerieIndex(data, seriesIndex) + " rect:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
            }
            
            this.setRectElementsVisualization(canvas, elements, seriesIndex, null, visualizationMode, 0, chartType);            
            if (reset) {
                this.resetRectElementsVisualization(canvas);
            }
        },

        /**
        * Set Path series visualization.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The datas element.  
        * @param {int} seriesIndex - The series index.  
        * @param {bool} visualizationMode - The visualization mode. 
        * @param {int} chartType - The chart type.   
        * @param {bool} reset - Defines wheter the visulization should be reset.
        * */
        setPathSeriesVisualization: function (canvas, data, seriesIndex, visualizationMode, chartType, reset) {
            var elements;
            var index;
            switch (chartType) {
                case models.constants.chartType.combination:
                    // TODO: add line series number
                    elements = canvas.select("g.nv-linesWrap.nvd3-svg g.nv-group.nv-series-" + data[seriesIndex].combinationChartLineSeriesIndex + " path.nv-line:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
                    break;
                case models.constants.chartType.line:
                    elements = canvas.select("g.nv-linesWrap.nvd3-svg > g > g > g.nv-groups >  g.nv-group.nv-series-" + models.utils.getVisibleSerieIndex(data, seriesIndex) + " path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
                    break;

                case models.constants.chartType.area:
                    index = models.utils.getVisibleSerieIndex(data, seriesIndex) + 1;
                    elements = canvas.select("g.nv-areaWrap path:nth-child(" + index + "):not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
                    break;

                case models.constants.chartType.pie:
                case models.constants.chartType.doughnut:
                    elements = canvas.select("g.nv-pieWrap .nv-pie g:nth-child(" + (seriesIndex + 1) + ") > path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
                    break;
            }

            this.setPathElementsVisualization(canvas, elements, seriesIndex, visualizationMode, chartType);

            if (reset) {
                this.resetPathElementsVisualization(canvas, elements, chartType);
            }
        },

        /**
        * Set Rect elements visualization.
        * @param {object} canvas - The canvas element.      
        * @param {object} elements - The elements to highlight.   
        * @param {bool} visualizationMode - The visualization mode.  
        * @param {int} strokeWidth - The stroke width.
        * @param {int} chartType - The chart type.  
        * */
        setRectElementsVisualization: function (canvas, elements, seriesIndex, categoryIndex, visualizationMode, strokeWidth, chartType) {
            if (!elements || elements[0].length === 0) {
                return;
            }

            var self = this;
            var itemIndex = 0;
            var currentCategoryIndex;
            switch (visualizationMode) {
                case models.constants.visualizationMode.emphasized:
                case models.constants.visualizationMode.deemphasized:
                    var opacity = models.constants.darkerLayerOpacity;
                    var fill = models.constants.darkLayerColor;
                    var elementClass = "sc-emphasize-mask";
                    if (visualizationMode === models.constants.visualizationMode.deemphasized) {
                        fill = models.constants.brightLayerColor;
                        elementClass = "sc-deemphasize-mask";
                        opacity = models.constants.brighterLayerOpacity;
                    }

                    elements.each(function () {
                        var rect = d3.select(this);
                        if (rect.style("opacity") > 0) {
                            var bBox = models.utils.getBBox(rect);
                            var parent = d3.select(this.parentNode);
                            var transform = d3.transform(rect.attr("transform"));
                            var x = parseFloat(transform.translate[0]);
                            var y = parseFloat(transform.translate[1]);
                            var boxX = bBox.x ? bBox.x : 0;
                            var boxY = bBox.y ? bBox.y : 0;

                            if (chartType === models.constants.chartType.combination) {
                                currentCategoryIndex = self.getCombinationBarIndex(rect, categoryIndex, itemIndex);
                            } else {
                                currentCategoryIndex = categoryIndex ? categoryIndex : itemIndex;;
                            }
                            if (!currentCategoryIndex) {
                                currentCategoryIndex = 0;
                            }

                            parent.append("rect")
                                .attr("x", boxX + x - (strokeWidth / 2))
                                .attr("y", boxY + y - (strokeWidth / 2))
                                .attr("width", bBox.width + strokeWidth)
                                .attr("height", bBox.height + strokeWidth)
                                .attr("rx", rect.attr("rx"))
                                .attr("ry", rect.attr("ry"))
                                .attr("class", elementClass)
                                .attr("sc-series-index", seriesIndex)
                                .attr("sc-category-index", currentCategoryIndex)
                                .style("fill", fill)
                                .style("fill-opacity", 0)
                                .transition()
                                .duration(models.constants.animations.medium)
                                .style("fill-opacity", opacity);

                            if (visualizationMode === models.constants.visualizationMode.emphasized) {
                                self.removeDeemphasizeLayer(parent, seriesIndex, currentCategoryIndex);
                            }
                            if (visualizationMode === models.constants.visualizationMode.deemphasized) {
                                self.removeEmphasizeLayer(parent, seriesIndex, currentCategoryIndex);
                            }
                        }
                        itemIndex++;
                    });
                    break;
                case models.constants.visualizationMode.standard:
                    elements.each(function () {                     
                        currentCategoryIndex = categoryIndex ? categoryIndex : itemIndex;                        
                        var parent = d3.select(this.parentNode);
                        self.removeDeemphasizeLayer(parent, seriesIndex, currentCategoryIndex);
                        self.removeEmphasizeLayer(parent, seriesIndex, currentCategoryIndex);
                        itemIndex++;
                    });
                    break;
                case models.constants.visualizationMode.notVisible:
                    elements.each(function () {                        
                        currentCategoryIndex = categoryIndex ? categoryIndex : itemIndex;                        
                        self.removeDeemphasizeLayer(canvas, seriesIndex, currentCategoryIndex);
                        self.removeEmphasizeLayer(canvas, seriesIndex, currentCategoryIndex);
                        itemIndex++;
                    });
                    break;
            }
        },

        /**
        * Get combination cahr bar index
        * @param {object} rect - The bar element.
        * @param {number} categoryIndex - The category index.
        * @param {number} itemIndex - The item index.
        * */
        getCombinationBarIndex:function(rect, categoryIndex, itemIndex) {
            var currentCategoryIndex = 0;
            var rectClass = rect.attr("class");
            var indexPosition = rectClass.indexOf("nv-bar-0-");
            if (indexPosition > -1) {                                                               
                var tmpString = rectClass.slice(indexPosition).replace("nv-bar-0-","");
                var indexPosition2 = tmpString.indexOf(" hover");
                if (indexPosition2 > -1) {
                    currentCategoryIndex = parseInt(tmpString.slice(0, indexPosition2));
                } else {
                    currentCategoryIndex = parseInt(tmpString);
                }
            } else {
                currentCategoryIndex = categoryIndex ? categoryIndex : itemIndex;
            }

            return currentCategoryIndex;
        },

        /**
        * Set Path elements visualization.
        * @param {object} canvas - The canvas element.  
        * @param {object} elements - The elements to highlight.
        * @param {int} seriesIndex - The series index.
        * @param {string} visualizationMode - The visualization mode.
        * @param {int} chartType - The chart type.      
        * */
        setPathElementsVisualization: function (canvas, elements, seriesIndex, visualizationMode, chartType) {
            var self = this;
            var itemIndex = 0;
            switch (visualizationMode) {
                case models.constants.visualizationMode.emphasized:
                case models.constants.visualizationMode.deemphasized:
                    var opacity = models.constants.darkerLayerOpacity;
                    var elementClass = "sc-emphasize-mask";

                    if (visualizationMode === models.constants.visualizationMode.deemphasized) {
                        elementClass = "sc-deemphasize-mask";
                        opacity = models.constants.brighterLayerOpacity;
                    }

                    elements.each(function () {
                        var path = d3.select(this);
                        var dAttribute = path.attr("d");
                        var transformTranslate = path.attr("transform");
                        var parent = d3.select(this.parentNode);
                        var fill = (chartType === models.constants.chartType.line || chartType === models.constants.chartType.combination) ? "none" : (visualizationMode === models.constants.visualizationMode.emphasized) ? models.constants.darkLayerColor : models.constants.brightLayerColor;
                        var cssClass = (chartType === models.constants.chartType.line || chartType === models.constants.chartType.combination) ? "nv-line" : "nv-area";
                        var strokeWidth = (chartType === models.constants.chartType.line || chartType === models.constants.chartType.combination) ? (visualizationMode === models.constants.visualizationMode.deemphasized) ? "4px" : "3px" : "0";

                        if (chartType === models.constants.chartType.area) {
                            path.style("stroke-width", 0);
                        }

                        parent.append("path")
                            .attr("d", dAttribute)
                            .attr("transform", transformTranslate)
                            .style("stroke-width", strokeWidth)
                            .style("fill", fill)
                            .style("stroke-opacity", "0")
                            .style("fill-opacity", "0")
                            .attr("class", cssClass + " " + elementClass)
                            .attr("sc-series-index", seriesIndex)
                            .attr("sc-category-index", seriesIndex)
                            .transition()
                            .duration(models.constants.animations.fast)
                            .ease("sine")
                            .style("stroke-opacity", opacity)
                            .style("fill-opacity", opacity);

                        if (visualizationMode === models.constants.visualizationMode.emphasized) {
                            self.removeDeemphasizeLayer(parent, seriesIndex, seriesIndex);
                        }
                        if (visualizationMode === models.constants.visualizationMode.deemphasized) {
                            self.removeEmphasizeLayer(parent, seriesIndex, seriesIndex);
                        }
                    });

                    break;

                case models.constants.visualizationMode.standard:
                    if (chartType === models.constants.chartType.area) {
                        elements.each(function () {
                            d3.select(this).style("stroke-width", 1);
                        });
                    }
                    elements.each(function () {
                        var parent = d3.select(this.parentNode);
                        self.removeDeemphasizeLayer(parent, seriesIndex, seriesIndex);
                        self.removeEmphasizeLayer(parent, seriesIndex, seriesIndex);
                        itemIndex++;
                    });
                    break;
                case models.constants.visualizationMode.notVisible:
                    elements.each(function () {
                        self.removeDeemphasizeLayer(canvas, seriesIndex, seriesIndex);
                        self.removeEmphasizeLayer(canvas, seriesIndex, seriesIndex);
                        itemIndex++;
                    });
                    break;
            }
        },

        /**
        * Remove emphasize layer.
        * @param {object} elements - The elements.
        * @param {int} seriesIndex - The series index.
        * @param {int} categoryIndex - The category index.
        **/
        removeEmphasizeLayer: function (element, seriesIndex, categoryIndex) {
            var elements = element.selectAll(".sc-emphasize-mask[sc-series-index='" + seriesIndex + "'][sc-category-index='" + categoryIndex + "']");
            elements
                .transition()
                .duration(models.constants.animations.fast)
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0)
                .remove();
        },

        /**
        * Remove deemphasize layer.
        * @param {object} elements - The elements.
        * @param {int} seriesIndex - The series index.
        * @param {int} categoryIndex - The category index.
        **/
        removeDeemphasizeLayer: function (element, seriesIndex, categoryIndex) {
            var elements = element.selectAll(".sc-deemphasize-mask[sc-series-index='" + seriesIndex + "'][sc-category-index='" + categoryIndex + "']");
            elements.transition()
                .duration(models.constants.animations.fast)
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0)
                .remove();
        },

        /**
        * Sets bar element visualization.
        * @param {object} canvas - The canvas element.
        * @param {int} seriesIndex - The series index.   
        * @param {int} categoryIndex - The category index.   
        * @param {int} visualizationMode - The visualization mode.   
        * @param {bool} IsSegmentSelectionDisabled - The IsSegmentSelectionDisabled flag.
        **/
        setBarElementVisualization: function (canvas, seriesIndex, categoryIndex, visualizationMode, IsSegmentSelectionDisabled) {
            var elements = canvas.select("g.nv-group.nv-series-" + seriesIndex + " .nv-bar:nth-child(" + (categoryIndex + 1) + ") rect:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");           
            if (!IsSegmentSelectionDisabled) {
              elements.each(function () {
                d3.select(this).style("cursor", "pointer");
              });
            }
            models.nvd3VisualizationManager.setRectElementsVisualization(
                canvas,
                elements,
                seriesIndex,
                categoryIndex,
                visualizationMode,
                0,
                models.constants.chartType.bar);
        },

        /**
        * Sets column element visualization.
        * @param {object} canvas - The canvas element.
        * @param {int} seriesIndex - The series index.   
        * @param {int} categoryIndex - The category index.   
        * @param {int} visualizationMode - The visualization mode.  
        * @param {bool} IsSegmentSelectionDisabled - The IsSegmentSelectionDisabled flag. 
        **/
        setColumnElementVisualization: function (canvas, seriesIndex, categoryIndex, visualizationMode, IsSegmentSelectionDisabled) {
            var elements = canvas.selectAll("g.nv-group.nv-series-" + seriesIndex + " > rect:nth-child(" + (categoryIndex + 1) + "):not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");
            if (!IsSegmentSelectionDisabled) {
              elements.each(function () {
                d3.select(this).style("cursor", "pointer");
              });
            }
            models.nvd3VisualizationManager.setRectElementsVisualization(
                canvas,
                elements,
                seriesIndex,
                categoryIndex,
                visualizationMode,
                0,
                models.constants.chartType.column);
        },

        /**
         * Sets column element visualization.
         * @param {object} canvas - The canvas element.
         * @param {int} seriesIndex - The series index.   
         * @param {int} categoryIndex - The category index.   
         * @param {int} visualizationMode - The visualization mode.   
         * @param {bool} IsSegmentSelectionDisabled - The IsSegmentSelectionDisabled flag.
         **/
        setCombinationElementVisualization: function (canvas, seriesIndex, categoryIndex, visualizationMode, IsSegmentSelectionDisabled) {
            var elements = canvas.select("g.nvd3.nv-wrap.nv-linePlusBar g.nv-focus g.nv-barsWrap.nvd3-svg g.nv-bars rect.nv-bar-"+seriesIndex+"-" + (categoryIndex ) + ":not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");   
            if (!IsSegmentSelectionDisabled) {
              elements.each(function () {
                d3.select(this).style("cursor", "pointer");
              });
            }
            models.nvd3VisualizationManager.setRectElementsVisualization(
                canvas,
                elements,
                seriesIndex,
                categoryIndex,
                visualizationMode,
                0,
                models.constants.chartType.combination);
        },

        /**
        * Resets path elements visualization.
        * @param {object} canvas - The canvas element.          
        **/
        resetRectElementsVisualization: function (canvas) {
            //this.removeOverlapLayers(canvas);
        },

        /**
        * Removes overlap layers.
        * @param {object} canvas - The canvas element.
        **/
        removeOverlapLayers: function (canvas) {
            if (canvas) {
                canvas.selectAll(".sc-emphasize-mask, .sc-deemphasize-mask")
                    .remove();
            }
        },

        /**
        * Removes overlap layers.
        * @param {object} canvas - The canvas element.
        **/
        removeAllEmphasizeLayers: function (canvas) {
            canvas.selectAll(".sc-emphasize-mask")
                .remove();
        },


        /**
        * Removes inside lines.
        * @param {object} canvas - The canvas element.
        **/
        removeAllInsideLines: function (canvas) {
            canvas.selectAll("path.sc-inside-line").remove();
        },

        /**
        * Resets path elements visualization.
        * @param {object} canvas - The canvas element.      
        * @param {object} elements - The elements to highlight. 
        * @param {int} chartType - The chartType. 
        **/
        resetPathElementsVisualization: function (canvas, elements, chartType) {
            //this.removeOverlapLayers(canvas);
            if (chartType === models.constants.chartType.area) {
                elements.each(function () {
                    d3.select(this).style("stroke-width", 1);
                });
            }
        },

        /**
        * Visualizes label line elements.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The data. 
        * @param {bool} highlight - Defines wheter to highlight or not the dot..  
        * @param {number} seriesIndex - The series index.  
        * @param {object} palette - The color palette.  
        * */
        visualizeLabelLineElements: function (canvas, visualizationMode, seriesIndex, palette) {
            if (visualizationMode === models.constants.visualizationMode.emphasized) {
                var line = canvas.select("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie .sc-labels-lines line.sc-label-line[sc-series-index='" + seriesIndex + "']");

                if (!line[0][0]) {
                    return;
                }

                if (!line) {
                    return;
                }

                var parent = canvas.select("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g .sc-labels-lines");
                var color = d3.rgb(models.colors.getPaletteColor(palette, seriesIndex)).darker(1);

                parent.append("line")
                    .attr({
                        x1: line.attr("x1"),
                        y1: line.attr("y1"),
                        x2: line.attr("x2"),
                        y2: line.attr("y2")
                    })
                    .style("stroke", color)
                    .style("opacity", 0)
                    .attr("class", "sc-line-mask")
                    .attr("sc-series-index", seriesIndex)
                    .transition()
                    .duration(models.constants.animations.medium)
                    .style("opacity", 1);
            } else {
                canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie .sc-labels-lines line.sc-line-mask[sc-series-index='" + seriesIndex + "']")
                 .transition()
                 .duration(models.constants.animations.fast)
                 .remove();
            }
        },

        /**
        * Visualizes label line elements.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The data. 
        * @param {bool} highlight - Defines wheter to highlight or not the dot..  
        * @param {number} seriesIndex - The series index.  
        * @param {object} palette - The color palette.  
        * */
        visualizeInsideLineElements: function (canvas, visualizationMode, seriesIndex, palette, sizes) {
            if (visualizationMode === models.constants.visualizationMode.emphasized ||
                visualizationMode === models.constants.visualizationMode.standard) {               
                var path = canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g.nv-pie .nv-slice:nth-child(" + (seriesIndex + 1) + ") path:not(.sc-emphasize-mask):not(.sc-deemphasize-mask)");

                if (!path[0][0]) {
                    return;
                }

                var diameter = Math.min(sizes.chartCanvasHeight, sizes.chartCanvasWidth);

                var container = canvas.select("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g");

                if (diameter < models.constants.doughnutLabelsVisibilityThreshold) {
                    return;
                }

                var nvPie = canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g.nv-pie");
                var transform = nvPie.attr("transform");

                var color = d3.rgb(models.colors.getPaletteColor(palette, seriesIndex));
                var radius = diameter / 2;
                var arc = d3.svg.arc()
                .outerRadius((radius * 0.52) - 2)
                .innerRadius((radius * 0.52) - 10)
                .startAngle(path.node()._current.startAngle)
                .endAngle(path.node()._current.endAngle);

                container.selectAll("path.sc-inside-line").remove();

                container.append("path")
                    .style("fill", color)
                    .style("fill-opacity", 0)
                    .attr("transform", transform)
                    .attr("d", arc)
                    .attr("class", "sc-inside-line")
                    .attr("sc-series-index", seriesIndex)
                    .transition()
                    .duration(models.constants.animations.fast)
                    .style("fill-opacity", 1);
                if (visualizationMode === models.constants.visualizationMode.emphasized) {
                    container.append("path")
                        .style("fill", models.constants.darkLayerColor)
                        .style("fill-opacity", 0)
                        .attr("transform", transform)
                        .attr("d", arc)
                        .attr("class", "sc-inside-line")
                        .attr("sc-series-index", seriesIndex)
                        .transition()
                        .duration(models.constants.animations.fast)
                        .style("fill-opacity", models.constants.darkerLayerOpacity);
                }
            } else {
                canvas.selectAll("g.nv-pieWrap.nvd3-svg g.nvd3.nv-wrap.nv-pie g path.sc-inside-line[sc-series-index='" + seriesIndex + "']")
                 .transition()
                 .duration(models.constants.animations.veryFast)
                 .remove();
            }
        },

        arcTween: function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        },

        /**
        * Visualizes dots elements.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The data. 
        * @param {object} elements - The elements to highlight.  
        * @param {bool} highlight - Defines wheter to highlight or not the dot..  
        * @param {object} palette - The color palette.  
        * */
        visualizeDotsElements: function (canvas, data, elements, visualizationMode, palette) {
            if (visualizationMode === models.constants.visualizationMode.emphasized ||
                visualizationMode === models.constants.visualizationMode.deemphasized) {
                if (!elements) {
                    return;
                }

                elements.forEach(function (object) {
                    if (!object || !object.element) {
                        return;
                    }

                    var dot = d3.select(object.element);
                    var transformTranslate = dot.attr("transform");
                    var parent = d3.select(object.element.parentNode);
                    var existingCircles = parent.select("circle.sc-dots-mask");
                    var color = d3.rgb(models.colors.getPaletteColor(palette, object.seriesIndex)).darker(1);
                    var opacity = 1;
                    if (existingCircles[0][0] && (existingCircles.attr("transform") === transformTranslate)) {
                        return;
                    }

                    parent.selectAll("circle.sc-dots-mask").remove();

                    if (data[object.seriesIndex].legendState === models.constants.legendState.disengaged) {

                        parent.append("circle")
                            .attr("cx", 0)
                            .attr("cy", 0)
                            .attr("r", 6)
                            .style("fill", models.colors.getPaletteColor(palette, object.seriesIndex))
                            .style("opacity", 1)
                            .attr("transform", transformTranslate)
                            .attr("class", "sc-dots-mask");

                        color = models.constants.brightLayerColor;
                        opacity = 0.65;

                        parent.append("circle")
                            .attr("cx", 0)
                            .attr("cy", 0)
                            .attr("r", 6)
                            .style("fill", color)
                            .style("opacity", opacity)
                            .attr("transform", transformTranslate)
                            .attr("class", "sc-dots-mask");
                    } else {
                        parent.append("circle")
                          .attr("cx", 0)
                          .attr("cy", 0)
                          .attr("r", 6)
                          .style("fill", color)
                          .style("opacity", opacity)
                          .attr("transform", transformTranslate)
                          .attr("class", "sc-dots-mask");
                    }

                });
            } if (visualizationMode === models.constants.visualizationMode.standard) {
                canvas.selectAll(".sc-dots-mask")
                    .transition()
                    .duration(models.constants.animations.fast)
                    .remove();
            }
        },

        /**
        * Highlights Path elements.
        * @param {object} canvas - The canvas element.  
        * @param {object} data - The data.  
        * */
        getScatterDots: function (canvas, data) {
            if (!data) {
                return null;
            }

            var dataLength = data.length;
            var dots = [];
            var index;
            for (var seriesIndex = 0; seriesIndex < dataLength; seriesIndex++) {
                index = models.utils.getVisibleSerieIndex(data, seriesIndex);
                var dot = canvas.select("g.nv-scatterWrap .nv-groups g.nv-group.nv-series-" + index + " path.nv-point.nv-noninteractive.hover");
                if (dot[0]) {
                    dots.push({
                        seriesIndex: seriesIndex,
                        visibleIndex: index,
                        element: dot.node()
                    });
                }
            }

            return dots;
        },

        /**
        * Set ComnbinationChart highlighted point.
        * @param {object} chartProperties - The chartProperties object.  
        * @param {object} tooltipArgs - The tooltip arguments.  
        * */
        setComnbinationChartHighlightedPoint: function (chartProperties, tooltipArgs) {
            var tooltipOn = !chartProperties.chartElement.tooltip.hidden();
            var categoryIndex = 0;
            var isBar = false;
            if (tooltipArgs.point) {
                categoryIndex = tooltipArgs.pointIndex + 1;
            } else {
                isBar = true;
                categoryIndex = tooltipArgs.index;
                if (tooltipArgs.index === 0 || (tooltipArgs.index === chartProperties.chartData[0].values.length - 1)) {
                    return;
                }
            }

            chartProperties.chartData.forEach(function (series) {
                if (!series.bar) {
                    chartProperties.svgElement.selectAll("g.nv-groups g.nv-series-" + series.combinationChartLineSeriesIndex + " path.nv-point-" + (categoryIndex - 1)).classed("hover", tooltipOn);
                }
            }.bind(this));

            if (!isBar) {

                if (tooltipOn) {
                    models.nvd3VisualizationManager.setCombinationElementVisualization(chartProperties.svgElement, chartProperties.barSeriesIndex, categoryIndex, models.constants.visualizationMode.emphasized);
                } else {
                    var visualizationMode;
                    visualizationMode = models.constants.visualizationMode.standard;

                    if (chartProperties.hasBarSeries && chartProperties.chartData[chartProperties.barSeriesIndex].legendState === models.constants.legendState.disengaged) {
                        visualizationMode = models.constants.visualizationMode.deemphasized;
                    }
                    if (chartProperties.hasBarSeries) {
                        models.nvd3VisualizationManager.setCombinationElementVisualization(chartProperties.svgElement, chartProperties.barSeriesIndex, categoryIndex, visualizationMode);
                    }
                }
            }
        } 

    }
}(Sitecore.Speak.D3.models));