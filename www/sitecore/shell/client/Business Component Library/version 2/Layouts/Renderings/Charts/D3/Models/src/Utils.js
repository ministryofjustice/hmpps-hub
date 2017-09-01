(function (speak, models) {
  models.utils = {

    /**
    * Ellipses text in a D3 element.
    * 
    * @param {object} d3Element - The D3 element.      
    * @param {number} width - The width to fit the text within.      
    * @param {string} padding - The text padding.     
    * @param {bool} startEllipse - Defines whether the ellipse should be End (false, default) or Start (true).          
    */
    ellipse: function(d3Element, width, paddingLeft, paddingRight, startEllipse, addTitle) {
      if (!d3Element[0][0]) {
        return null;
      }

      var
        text = d3Element.text(),        
        textCharsLength = text.length,
        textLength = d3Element.node().getComputedTextLength(),
        originalTextLength = textLength,
        originalText = text,
        availableSpace = (width - paddingRight - paddingLeft -3);
      if (text.length === 0) {
        return text;
      }

      var lastAddedChunkLenght = Math.floor(textCharsLength / 2);
      var currentChunkLenght = lastAddedChunkLenght;
      var done = false;
      if (textLength > availableSpace && text.length > 0) {
        while (!done) {
          if (startEllipse) {
            text = originalText.slice(textCharsLength - currentChunkLenght);
            d3Element.text("..." + text);
          } else {
            text = originalText.slice(0, currentChunkLenght);
            d3Element.text(text + "...");
          }

          textLength = d3Element.node().getComputedTextLength();

          lastAddedChunkLenght = Math.floor(lastAddedChunkLenght / 2);

          if (lastAddedChunkLenght === 0 || Math.abs(textLength - availableSpace) < 3) {
            done = true;
          } else {
            if (textLength < availableSpace) {
              currentChunkLenght = currentChunkLenght + lastAddedChunkLenght;
            } else {

              currentChunkLenght = currentChunkLenght - lastAddedChunkLenght;
            }
          }
        }
      }

      if (text === "") {
        if (startEllipse) {
          text = ".." + originalText.slice(-1);
        } else {
          text = originalText.slice(0, 1) + "..";
        }
        d3Element.text(text);
      }

      if (textLength >= originalTextLength) {
        d3Element.text(originalText);
      }

      var newText = d3Element.text();
      if (addTitle && typeof d3Element.append === "function") {
        d3Element.attr("pointer-events", "auto");
        d3Element.select("title").remove();
        d3Element.append("title")
          .text(originalText);
      }

      return newText;
    },

    /**
    * Wrape text in a D3 element
    * 
    * @param {object} d3Element - The D3 element.      
    * @param {number} width - The width to fit the text within.      
    * @param {bool} applyEllipse - DEfines whether the function shoudl wrap and ellipse.          
    
    */
    wrap: function(d3Element, width, applyEllipse) {
      if (!d3Element[0][0]) {
        return;
      }

      var words = d3Element.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = d3Element.attr("y"),
        dy = parseFloat(d3Element.attr("dy")),
        tspan = d3Element.text(null).append("tspan").attr("x", 0).attr("y", y);

      if (!isNaN(dy)) {
        tspan.attr("dy", dy + "em");
      }
      while (words.length) {
        word = words.pop();
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = d3Element.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          if (applyEllipse) {
            this.ellipse(tspan, width, 1);
          }
        }
      }
    },

    /**
    * Show and hides a set of elements.
    * 
    * @param {array} controls - The array of elements.      
    * @param {bool} show - Defines whether to show or hiode the elements.      
    */
    showElements: function(elements, show) {
      elements.classed("hide", !show);
    },

    /**
    * Sets the fill color of a set of elements.
    *
    * @param {array} controls - The array of elements.      
    * @param {string} color - The new color.  
    */
    setFillColor: function(elements, color) {
      elements.style("fill", color);
    },

    /**
    * Gets the chart top offest.
    */
    getTopOffset: function(element) {
      if (element.node()) {
        var t = d3.transform(element.attr("transform"));
        var offset = parseFloat(-t.translate[1]);
        return offset;
      }

      return 0;
    },

    /**
    * Sets the canvas height.
    */
    setCanvasHeight: function(canvas, element, topMargin, isTitleVisible, isLegendVisible, isYAxisLabelVisible) {
      var height = this.getChartHeight(element, topMargin, isTitleVisible, isLegendVisible, isYAxisLabelVisible);
      canvas.style({ 'height': +height + "px" });
    },

    /* Center the leged
    * @param {object} canvas - The component element.             
    */
    getChartHeight: function(element, topMargin, isTitleVisible, isLegendVisible, isYAxisLabelVisible) {
      var offset = isYAxisLabelVisible ? models.constants.yAxisLabelHeight : 0;
      offset += isTitleVisible ? models.constants.chartTitleHeight : 0;
      offset += isLegendVisible ? models.constants.legend.legendItemHeight : 0;
      return element.parent().height() - offset;
    },


    /**
    * Gets the series index from the selected index.
    * @param {object} data - The data object.  
    * @param {int} index - The serie index.  
    */
    getSerieIndex: function(data, index) {
      var serieIndex = 0;
      var visibleIndex = 0;

      data.some(function(serie) {
        if (serie.legendState !== models.constants.legendState.unchecked) {
          if (index === visibleIndex) {
            return true;
          }
          visibleIndex++;
        }
        serieIndex++;
      });

      return serieIndex;
    },

    /**
    * Gets the viible series index from series index.
    * @param {object} data - The data object.  
    * @param {int} index - The serie index.  
    */
    getVisibleSerieIndex: function(data, index) {
      var serieIndex = 0;
      var visibleIndex = 0;

      data.some(function(serie) {
        if (serie.legendState !== models.constants.legendState.unchecked) {
          if (index === serieIndex) {
            return true;
          }
          visibleIndex++;
        }
        serieIndex++;
      });

      return visibleIndex;
    },

    /**
    * Sets negative color for single series
    * @param {object} canvas - The canvas element.  
    */
    setSingleSeriesNegativeColor: function(canvas, selector, isSingleSeries) {
      if (isSingleSeries) {
        models.utils.setFillColor(canvas.selectAll(selector), models.colors.singleNegativeColor[0]);
      }
    },

    /**
    * Sets negative color for single series
    * @param {object} canvas - The canvas element.  
    */
    setSingleSeriesPositiveColor: function(canvas, selector, isSingleSeries, color) {
      if (isSingleSeries) {
        models.utils.setFillColor(canvas.selectAll(selector), color);
      }
    },

    /**
    * Checks wheter the data has Date objects
    * @param {object} data - The data object
    * @param {string} seriesDefinitions - The seriesDefinitions dataformatting property.  
    * @param {string} fieldName - The seriesDefinitions fieldName property.  
    */
    hasDateCategory: function(data, dataFormatting, fieldName) {
      if (dataFormatting) {
        return (dataFormatting.fieldType === models.constants.dataFormatType.date);
      }

      var firstValue = data[0].values[0];
      if (firstValue[fieldName]) {
        return models.utilsConfig.isDate(firstValue[fieldName]);
      }

      return false;
    },

    /**
    * Checks wheter the data has Number or Currency objects
    * @param {object} data - The data object
    * @param {string} seriesDefinitions - The seriesDefinitions dataformatting property.  
    * @param {string} fieldName - The seriesDefinitions fieldName property.  
    */
    hasNumberCategory: function(data, dataFormatting, fieldName) {
      if (dataFormatting) {
        return ((dataFormatting.fieldType === models.constants.dataFormatType.number));
      }

      var firstValue = data[0].values[0];
      if (fieldName in firstValue) {
        return (models.utilsConfig.isNumber(firstValue[fieldName]));
      }

      return false;
    },

    /**
    * Checks wheter the data has Number or Currency objects
    * @param {object} data - The data object
    * @param {string} seriesDefinitions - The seriesDefinitions dataformatting property.          
    */
    hasCurrencyCategory: function(data, dataFormatting) {
      if (dataFormatting) {
        return ((dataFormatting.fieldType === models.constants.dataFormatType.currency));
      }
      return false;
    },

    /**
    * Gets the drawing canvas width.
    * @param {object} element - The component element.  
    * @param {object} margin - The margin object.
    */
    getCanvasWidth: function(element, margin) {
      return element.width() - margin.left - margin.right;
    },

    /**
    * Extend the Y domain excluding a specific series.
    * @param {object} data - The data object.  
    * @param {number} barSeriesIndex - The bar series index.
    */
    extendYDomainExcludeSeriesAt: function(data, barSeriesIndex) {
        var index = 0;
        var min = d3.min(data, function (c) {
            if (index === barSeriesIndex) {
                index++;
                return Number.POSITIVE_INFINITY;
            }
            index++;
            var partialMin = d3.min(c.values,
              function (v) { return v.y; });
            return partialMin;
        });

        index = 0;
        var max = d3.max(data, function (c) {
            if (index === barSeriesIndex) {
                index++;
                return Number.NEGATIVE_INFINITY;
            }
            index++;
            var partialMax = d3.max(c.values,
                 function (v) { return v.y; });
            return partialMax;
        });

        if (min === Number.POSITIVE_INFINITY) {
            min = 0;
        }

        if (max === Number.NEGATIVE_INFINITY) {
            max = 0;
        }

        var newMin = Math.floor(min - ((max - min) / 100) * 10);
        if (min >= 0 && newMin < 0) {
            newMin = 0;
        }

        var newMax = Math.ceil(max + ((max - min) / 100) * 10);

        if (newMin === 0 && newMax === 0) {
            newMax = 1;
        }
        return [newMin, newMax];
    },

    /**
    * Extend the Y domain.
    * @param {object} data - The data object.  
    */
    extendYDomain: function(data) {
        var min = d3.min(data, function (c) {
            return d3.min(c.values,
              function (v) { return v.y; });
        });

        var max = d3.max(data, function (c) {
            return d3.max(c.values,
              function (v) { return v.y; });
        });

        var newMin = Math.floor(min - ((max - min) / 100) * 10);
        if (min >= 0 && newMin < 0) {
            newMin = 0;
        }

        var newMax = Math.ceil(max + ((max - min) / 100) * 10);

        if (newMin === 0 && newMax === 0) {
            newMax = 1;
        }
        return [newMin, newMax];
    },

    /**
    * Extend the X domain of a specific series series.
    * @param {object} data - The data object.  
    * @param {object} chartElement - The chart object.  
    * @param {number} barSeriesIndex - The bar series index.
    */
    extendXDomain: function(chartProperties) {
      var min = d3.min(chartProperties.chartData, function(c) {
        return d3.min(c.values,
          function(v) { return v.x; });
      });

      var max = d3.max(chartProperties.chartData, function(c) {
        return d3.max(c.values,
          function(v) { return v.x; });
      });

      var newMin = Math.floor(min - ((max - min) / 100) * 10);
      if (min >= 0 && newMin < 0) {
        newMin = 0;
      }
      var newMax = Math.ceil(max + ((max - min) / 100) * 10);

      if (newMin === newMax) {
        newMin = Math.floor(newMin - (newMin / 100) * 10);
        newMax = Math.floor(newMax + (newMax / 100) * 10);
      }

      var newDomain = [newMin, newMax];
      chartProperties.originalXDomain = [min, max];
      chartProperties.extendedXDomain = newDomain;
      chartProperties.chartElement.bars.forceX(newDomain);
      chartProperties.chartElement.lines.forceX(newDomain);

      chartProperties.chartData[chartProperties.barSeriesIndex].values.splice(0, 0, { x: newMin, y: 0 });
      chartProperties.chartData[chartProperties.barSeriesIndex].values.push({ x: newMax, y: 0 });
    },

    /**
    * Set Pie chart and legend sizes.
    * @param {object} componentElement - The component element.  
    * @param {number} chartHeight - The chart height.
    * @param {number} legendWidth - The legend width.
    */
    setPieSizes: function(componentElement, chartHeight, legendWidth, isValueShown) {
      var componentWidth = componentElement.width();
      var chartCanvasWidth = chartHeight;
      if (legendWidth > 0) {
        legendWidth += 10;
      }

      if (chartHeight > componentWidth - legendWidth) {
        if (legendWidth === 0) {
          chartCanvasWidth = componentWidth;
        } else {
          chartCanvasWidth = componentWidth * 0.75;
          legendWidth = componentWidth - chartCanvasWidth;
        }
      }

      if (isValueShown) {
        chartCanvasWidth = componentWidth;
      }

      d3.select("#svg-" + componentElement.attr("data-sc-id"))
        .style("width", chartCanvasWidth + "px");
      d3.select("#svg-legend-" + componentElement.attr("data-sc-id"))
        .style("width", legendWidth + "px");

      componentElement.find(".svg-wrapper").width(chartCanvasWidth + legendWidth);
      return ({
        chartCanvasHeight: chartHeight,
        chartCanvasWidth: chartCanvasWidth,
        legendWidth: legendWidth
      });
    },

    /**
    * Gets element BBox.
    * @param {object} element - The element.  
    * */
    getBBox: function(element) {
      var bBox = {};
      try {
        bBox = element.node().getBBox();
      } catch (e) {
        // Firefox 3.0.x plays badly here
      } finally {
        bBox = bBox || {};
      }
      return bBox;
    },

    /**
    * Gets element BBox width.
    * @param {object} element - The element.  
    * */
    getBBoxWidth: function(element) {
      var bBox = this.getBBox(element);
      if (bBox.width) {
        return bBox.width;
      }
      return 0;
    },

    /**
    * Gets element BBox height.
    * @param {object} element - The element.  
    * */
    getBBoxHeight: function(element) {
      var bBox = this.getBBox(element);
      if (bBox.height) {
        return bBox.height;
      }
      return 0;
    },

    /**
    * Shortens a number.
    * @param {number} n - The number.
    * @param {number} d - The number of decimals.  
    * */
    shortenNumber: function(n, d) {
      if (n < 1) return "<1";
      var k = n = Math.floor(n);
      if (n < 1000) return (n.toString().split("."))[0];
      if (d !== 0) d = d || 1;

      function shorten(a, b, c) {
        var d = a.toString().split(".");
        if (!d[1] || b === 0) {
          return d[0] + c;
        } else {
          return d[0] + "." + d[1].substring(0, b) + c;
        }
      }

      k = n / 1e15;
      if (k >= 1) return shorten(k, d, "Q");
      k = n / 1e12;
      if (k >= 1) return shorten(k, d, "T");
      k = n / 1e9;
      if (k >= 1) return shorten(k, d, "B");
      k = n / 1e6;
      if (k >= 1) return shorten(k, d, "M");
      k = n / 1e3;
      if (k >= 1) return shorten(k, d, "K");

      return n;
    },

    /**
    * Checks if the component has a positive width and height.
    * @param {object} componentElement - The componentElement.
    * @param {object} margin - The margin.  
    * */
    hasPositiveSize: function(componentElement, margin) {
      return ((componentElement.height() - margin.top - margin.bottom) > 0)
        && ((componentElement.width() - margin.right - margin.left) > 0);
    },

    /**
      * Checks if the component is visible.
      * @param {object} componentElement - The componentElement.        
      * */
    isVisible: function(componentElement) {
      return componentElement.is(":visible");
    },

    /**
    * Checks if the component is visible and has a positive width and height.
    * @param {object} componentElement - The componentElement.
    * @param {object} margin - The margin.  
    * */
    isVisibleWithPositiveSize: function(componentElement, margin) {
      return this.isVisible(componentElement) && this.hasPositiveSize(componentElement, margin);
    },

    /**
    * Sets chart animation.
    * @param {object} chartElement - The chartElement.
    * @param {bool} isAnimationEnabled - The isAnimationEnabled flag.  
    * */
    setChartAnimation: function(chartElement, isAnimationEnabled) {
      chartElement.duration(isAnimationEnabled ? models.constants.animations.slow : models.constants.animations.none);
    }
  }
}(Sitecore.Speak, Sitecore.Speak.D3.models));

