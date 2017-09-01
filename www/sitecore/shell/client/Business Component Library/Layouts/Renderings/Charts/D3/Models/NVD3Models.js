Sitecore = window.Sitecore || {};
Sitecore.Speak = Sitecore.Speak || {};
Sitecore.Speak.D3 = Sitecore.Speak.D3 || {};
Sitecore.Speak.D3.models = Sitecore.Speak.D3.models || {};
Sitecore.Speak.D3.models.constants = Sitecore.Speak.D3.models.constants || {};
Sitecore.Speak.D3.models.formatter = Sitecore.Speak.D3.models.formatter || {};
Sitecore.Speak.D3.models.dispatcher = Sitecore.Speak.D3.models.dispatcher || {};
Sitecore.Speak.D3.models.data = Sitecore.Speak.D3.models.data || {};
Sitecore.Speak.D3.models.utils = Sitecore.Speak.D3.models.utilsConfig || {};
Sitecore.Speak.D3.models.utils = Sitecore.Speak.D3.models.utils || {};
Sitecore.Speak.D3.models.chartProperties = Sitecore.Speak.D3.models.chartProperties || {};
Sitecore.Speak.D3.models.colors = Sitecore.Speak.D3.models.colors || {};
Sitecore.Speak.D3.models.nvd3Legend = Sitecore.Speak.D3.models.nvd3Legend || {};
Sitecore.Speak.D3.models.nvd3Tooltip = Sitecore.Speak.D3.models.nvd3Tooltip || {};
Sitecore.Speak.D3.models.functionLines = Sitecore.Speak.D3.models.functionLines || {};
Sitecore.Speak.D3.models.nvd3Axis = Sitecore.Speak.D3.models.nvd3Axis || {};
Sitecore.Speak.D3.models.nvd3VisualizationManager = Sitecore.Speak.D3.models.nvd3VisualizationManager || {};

Sitecore.Speak.D3.components = Sitecore.Speak.D3.components || {};
Sitecore.Speak.D3.components.Area = Sitecore.Speak.D3.components.Area || {};
Sitecore.Speak.D3.components.Line = Sitecore.Speak.D3.components.Line || {};
Sitecore.Speak.D3.components.Pie = Sitecore.Speak.D3.components.Pie || {};
Sitecore.Speak.D3.components.Doughnut = Sitecore.Speak.D3.components.Doughnut || {};
Sitecore.Speak.D3.components.Bar = Sitecore.Speak.D3.components.Bar || {};
Sitecore.Speak.D3.components.Column = Sitecore.Speak.D3.components.Column || {};
Sitecore.Speak.D3.components.Combination = Sitecore.Speak.D3.components.Combination || {};





(function (models) {
    models.colors = {
        otherColor: ["#CCCCCC"], //sky
        singleColor: ["#6AC0E2"], //sky
        singleNegativeColor: ["#EA6962"], //sky

        // fixed facets colors
        facetColors: {
            "value": "#88BB5D",
            "visits": "#6AC0E2",
            "valuepervisit": "#FCE179",
            "allfacets": "#a6a6a6",
            "otherfacets": "#e3e3e3",
            "avgvisitduration": "#E5DDB3",
            "bouncerate": "#D4C4D0",
            "bounce": "#B497AD",
            "conversionrate": "#CAE1B7",
            "conversion": "#A2CA81",
            "avgpagecount": "#D09F62",
            "avgvisitcount": "#E8CFB0",
            "pageviews": "#FB9851",
            "avgvisitpageviews": "#AADBEE",
            "timeonsite": "#D1C47A",
            "avgcountvalue": "#FAD338",
            "count": "#D6AB76"
        },

        selectedSegmentColor: "#185F7B",

        // standardColors: used in all charts, based on Harvard theme DataPalette    
        standardColors: [
            //L60% - Dark
            "#55B7DD", //sky
            "#95C36F", //grass
            "#FAD338", //banana      
            "#FA8938", //carot
            "#E7534B", //tomato
            "#A989A1", //eggplant
            "#CBBC67", //sand        
            "#D09F62", //wood

            //L65% - Default
            "#6AC0E2", //sky
            "#A2CA81", //grass
            "#FCE179", //banana 
            "#FB9851", //carot
            "#EA6962", //tomato
            "#B497AD", //eggplant      
            "#D1C47A", //sand        
            "#D6AB76", //wood

            //L73% - Light
            "#8CCEE8", //sky
            "#B7D69E", //grass
            "#FCE179", //banana      
            "#FCAF79", //carot
            "#EE8B86", //tomato
            "#C5AFC0", //eggplant
            "#DCD298", //sand        
            "#DFBE95", //wood 

            //L80% - XLight
            "#AADBEE", //sky
            "#CAE1B7", //grass
            "#FCE99C", //banana      
            "#FCC49C", //carot
            "#F3A9A5", //tomato
            "#D4C4D0", //eggplant
            "#E5DDB3", //sand        
            "#E8CFB0", //wood        

            //L89% - XXLight
            "#D0EBF6", //sky
            "#E2EED7", //grass
            "#FEF3C8", //banana      
            "#FEDFC8", //carot
            "#F8D0CE", //tomato
            "#E7DEE5", //eggplant
            "#F1EDD5", //sand        
            "#F2E4D4", //wood

            //L95% - XXXLight
            "#EAF6FB", //sky
            "#F2F7ED", //grass
            "#FEFAE6", //banana      
            "#FEF0E6", //carot
            "#FCEAE9", //tomato
            "#F4F0F3", //eggplant
            "#F8F7EC", //sand        
            "#F9F3EB", //wood

            //L55% - XDark
            "#3FAED9", //sky
            "#88BB5D", //grass
            "#F9CE1F", //banana      
            "#F97A1F", //carot
            "#9F7A95", //eggplant
            "#C4B454", //sand        
            "#CA924E", //wood
            "#E33E35", //tomato    

            //L45% - XXDark
            "#2694C0", //sky
            "#6EA244", //grass
            "#E0B406", //banana
            "#E06106", //carot
            "#CA241C", //tomato
            "#85607C", //eggplant      
            "#AB9A3B", //sand        
            "#B17935", //wood       

            //L36% -XXXDark
            "#1E7699", //sky
            "#588136", //grass
            "#B39005", //banana      
            "#B34D05", //carot
            "#A21D16", //tomato
            "#6A4D63", //eggplant
            "#897B2F", //sand        
            "#8D612A" //wood          
        ],

        // shadedSkyColors: used in chart taht show a shade of colors   
        shadedSkyColors: [
        //Sky
        "#1E7699", //sky
        "#2694C0", //sky
        "#3FAED9", //sky
        "#55B7DD", //sky
        "#6AC0E2", //sky
        "#8CCEE8", //sky
        "#AADBEE", //sky
        "#D0EBF6", //sky
        "#EAF6FB" //sky        
        ],

        /**
        * Gets the palette.
        * @param {bool} isColorPaletteShaded - Defines whether the palette is shaded.
        * @param {int} numberOfItems - The number of items..
        * @param {int} maxNumberOfSegments -The max Nnmber of segments.
        */
        getPalette: function (isColorPaletteShaded, numberOfItems, maxNumberOfSegments) {
            var palette = isColorPaletteShaded ? models.colors.getShadedPalette(numberOfItems) : models.colors.standardColors;
            if (maxNumberOfSegments > 0 && maxNumberOfSegments < numberOfItems) {
                var newPalette = models.data.clone(palette);
                newPalette[maxNumberOfSegments] = models.colors.otherColor;
                return newPalette;
            }
            return palette;
        },

        /**
        * Set the chart colors.
        * @param {object} chartElement - The chartElement.
        * @param {bool} isSingleSeries -  Defines whether the data is single series.
        * @param {bool} isColorPaletteShaded - Defines whether the palette is shaded.
        * @param {int} palette - The palette.
        */
        setChartColors: function (chartElement, isSingleSeries, isColorPaletteShaded, palette) {
            if (isSingleSeries && isColorPaletteShaded) {
                chartElement.barColor(palette);
            } else {
                chartElement.color(palette);
            }
        },

        /**
        * Sets the shaded palette.
        * @param {int} seriesNumber - The seriesNumber.
        */
        getShadedPalette: function (seriesNumber) {
            var shadedColors = models.colors.shadedSkyColors;
            if (seriesNumber >= 5 && seriesNumber <= 8) {
                shadedColors = models.colors.shadedSkyColors.slice(1);
            }

            if (seriesNumber < 5) {
                shadedColors = [
                    models.colors.shadedSkyColors[1],
                    models.colors.shadedSkyColors[3],
                    models.colors.shadedSkyColors[5],
                    models.colors.shadedSkyColors[7]
                ];
            }
            return shadedColors;
        },

        /**
        * Gets a palette color by index using the module.
        * @param {object} palette - The palette.  
        * @param {int} index - The index.  
        */
        getPaletteColor: function (palette, index) {
            return palette[index % palette.length];
        }
    }
}(Sitecore.Speak.D3.models));
(function (models) {
    models.tooltip = function () {
        var direction = d3TipDirection,
            offset = d3TipOffset,
            html = d3TipHtml,
            node = initNode(),
            svg = null,
            point = null,
            target = null;

        function tooltip(vis) {
            svg = getSVGNode(vis);
            point = svg.createSVGPoint();
            document.body.appendChild(node);
        }

        // Public - show the tooltooltip on the screen
        //
        // Returns a tooltip
        tooltip.show = function () {
            var args = Array.prototype.slice.call(arguments);
            if (args[args.length - 1] instanceof SVGElement) {
                target = args.pop();
            }

            var content = html.apply(this, args),
                poffset = offset.apply(this, args),
                dir = direction.apply(this, args),
                nodel = d3.select(node),
                i = 0,
                coords;

            nodel.html(content)
              .style({ opacity: 1, 'pointer-events': 'all' });

            while (i--) nodel.classed(directions[i], false);
            coords = directionCallbacks.get(dir).apply(this);
            nodel.classed(dir, true).style({
                top: (coords.top + poffset[0]) + 'px',
                left: (coords.left + poffset[1]) + 'px'
            });

            return tooltip;
        }

        // Public - hide the tooltooltip
        //
        // Returns a tooltip
        tooltip.hide = function () {
            nodel = d3.select(node);
            nodel.style({ opacity: 0, 'pointer-events': 'none' });
            return tooltip;
        }

        // Public: Proxy attr calls to the d3 tooltip container.  Sets or gets attribute value.
        //
        // n - name of the attribute
        // v - value of the attribute
        //
        // Returns tooltip or attribute value
        tooltip.attr = function (n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return d3.select(node).attr(n);
            } else {
                var args = Array.prototype.slice.call(arguments);
                d3.selection.prototype.attr.apply(d3.select(node), args);
            }

            return tooltip;
        }

        // Public: Proxy style calls to the d3 tooltip container.  Sets or gets a style value.
        //
        // n - name of the property
        // v - value of the property
        //
        // Returns tooltip or style property value
        tooltip.style = function (n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return d3.select(node).style(n);
            } else {
                var args = Array.prototype.slice.call(arguments);
                d3.selection.prototype.style.apply(d3.select(node), args);
            }

            return tooltip;
        }

        // Public: Set or get the direction of the tooltooltip
        //
        // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
        //     sw(southwest), ne(northeast)  se(southeast) , mp(x:mousePointer.x, y:n.y)
        //
        // Returns tooltip or direction
        tooltip.direction = function (v) {
            if (!arguments.length) return direction;
            direction = v == null ? v : d3.functor(v);

            return tooltip;
        }

        // Public: Sets or gets the offset of the tooltip
        //
        // v - Array of [x, y] offset
        //
        // Returns offset or
        tooltip.offset = function (v) {
            if (!arguments.length) return offset;
            offset = v == null ? v : d3.functor(v);

            return tooltip;
        }

        // Public: sets or gets the html value of the tooltooltip
        //
        // v - String value of the tooltip
        //
        // Returns html value or tooltip
        tooltip.html = function (v) {
            if (!arguments.length) return html;
            html = v == null ? v : d3.functor(v);

            return tooltip;
        }

        function d3TipDirection() {
            return 'pointerTop';
        };

        function d3TipOffset() {
            return [-5, 0];
        };

        function d3TipHtml() {
            return ' ';
        };

        var directionCallbacks = d3.map({
            n: directionN,
            s: directionS,
            e: directionE,
            w: directionW,
            nw: directionNw,
            ne: directionNE,
            sw: directionSW,
            se: directionSE,
            pointerTop: directionPointerTop,
            pointer: directionPointer
        });

        directions = directionCallbacks.keys();

        function directionPointer() {
            var mousePoistion = getMousePosition();
            return {
                top: mousePoistion.y - node.getBoundingClientRect().height,
                left: mousePoistion.x - node.getBoundingClientRect().width / 2
            }
        };

        function directionPointerTop() {
            var bbox = getScreenBBox();
            var mousePoistion = getMousePosition();
            var bcr = node.getBoundingClientRect();
            return {
                top: bbox.n.y - bcr.height,
                left: mousePoistion.x - bcr.width / 2
            }
        };

        function directionN() {
            var bbox = getScreenBBox();
            var bcr = node.getBoundingClientRect();
            return {
                top: bbox.n.y - bcr.height,
                left: bbox.n.x - bcr.width / 2
            }
        };

        function directionS() {
            var bbox = getScreenBBox();
            return {
                top: bbox.s.y,
                left: bbox.s.x - node.getBoundingClientRect().width / 2
            }
        };

        function directionE() {
            var bbox = getScreenBBox();
            return {
                top: bbox.e.y - node.getBoundingClientRect().height / 2,
                left: bbox.e.x
            }
        };

        function directionW() {
            var bbox = getScreenBBox();
            return {
                top: bbox.w.y - node.getBoundingClientRect().height / 2,
                left: bbox.w.x - node.getBoundingClientRect().width
            }
        };

        function directionNw() {
            var bbox = getScreenBBox();
            return {
                top: bbox.nw.y - node.getBoundingClientRect().height,
                left: bbox.nw.x - node.getBoundingClientRect().width
            }
        };

        function directionNE() {
            var bbox = getScreenBBox();
            return {
                top: bbox.ne.y - node.getBoundingClientRect().height,
                left: bbox.ne.x
            }
        };

        function directionSW() {
            var bbox = getScreenBBox();
            return {
                top: bbox.sw.y,
                left: bbox.sw.x - node.getBoundingClientRect().width
            }
        };

        function directionSE() {
            var bbox = getScreenBBox();
            return {
                top: bbox.se.y,
                left: bbox.e.x
            }
        };

        function initNode() {
            var node = d3.select(document.createElement('div'));
            node.attr('class', 'd3-toolip');
            node.style({
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                boxSizing: 'border-box'
            });

            return node.node();
        }

        function getSVGNode(el) {
            el = el.node();
            if (el.tagName.toLowerCase() === 'svg')
                return el;

            return el.ownerSVGElement;
        }

        function getMousePosition() {
            var mousePosition = {};
            mousePosition.x = d3.event.clientX;
            mousePosition.y = d3.event.clientY;
            return mousePosition;
        }

        // Private - gets the screen coordinates of a shape
        //
        // Given a shape on the screen, will return an SVGPoint for the directions
        // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
        // sw(southwest).
        //
        // Returns an Object {n, s, e, w, nw, sw, ne, se}
        function getScreenBBox() {
            var targetel = target || d3.event.target,
                bbox = {},
                matrix = targetel.getScreenCTM(),
                tbbox = targetel.getBBox(),
                width = tbbox.width || 0,
                height = tbbox.height || 0,
                x = tbbox.x || 0,
                y = tbbox.y || 0,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

            point.x = x + scrollLeft;
            point.y = y + scrollTop;
            bbox.nw = point.matrixTransform(matrix);
            point.x += width;
            bbox.ne = point.matrixTransform(matrix);
            point.y += height;
            bbox.se = point.matrixTransform(matrix);
            point.x -= width;
            bbox.sw = point.matrixTransform(matrix);
            point.y -= height / 2;
            bbox.w = point.matrixTransform(matrix);
            point.x += width;
            bbox.e = point.matrixTransform(matrix);
            point.x -= width / 2;
            point.y -= height / 2;
            bbox.n = point.matrixTransform(matrix);
            point.y += height;
            bbox.s = point.matrixTransform(matrix);

            return bbox;
        }

        return tooltip;
    }
}(Sitecore.Speak.D3.models));
(function (models, speak) {
  /**
   * The check on Sitecore.Speak.version is done to verify if we are in SPEAK 2 or not (SPEAK 1.1 does not have such variable)           
   */
  if (Sitecore.Speak.version) {
    models.utilsConfig = {
      isDate: speak.utils.is.date.bind(speak.Helpers.date),
      isNumber: speak.utils.is.number,
      isISODate: speak.utils.date.isISO.bind(speak.Helpers.date),
      parseISODate: speak.utils.date.parseISO.bind(speak.Helpers.Date)
    };
  } else {
    models.utilsConfig = {
      isDate: _.isDate,
      isNumber: _.isNumber,
      isISODate: speak.Helpers.date.isISO.bind(speak.Helpers.date),
      parseISODate: speak.Helpers.date.parseISO.bind(speak.Helpers.date)
    };
  }
  
}(Sitecore.Speak.D3.models, Sitecore.Speak));

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


(function (models) {
  /**
   * In order to use a different formmating module than Globalize.js
   * you need to redefine models.formatterConfig specifying a new date, currency, number formatter function       
   */
  models.formatterConfig = models.formatterConfig || {
    dateFormatter: Sitecore.Speak.globalize.dateFormatter.bind(Sitecore.Speak.globalize),
    currencyFormatter: Sitecore.Speak.globalize.currencyFormatter.bind(Sitecore.Speak.globalize),
    numberFormatter: Sitecore.Speak.globalize.numberFormatter.bind(Sitecore.Speak.globalize)
  };
}(Sitecore.Speak.D3.models));
(function (models) {
  models.formatter = {

    /**
    * Foramts a value according to it's data type and format.
    * 
    * @param {string} type - The value data type. 
    * @param {object} value - The value to be formatted. 
    * @param {string} format - The format.          
    */
    format: function (value, dataFormatting) {
      var formatter =
        function(v) {
          return v;
        };
      if (!dataFormatting) {
        return formatter(value);
      }

      var options = {},
      type = dataFormatting.fieldType,
      formatPreset,
      formatType;

      if (dataFormatting.metricsFormat && dataFormatting.metricsFormat.numberScale) {
        formatter = models.formatterConfig.metricsFormatter(dataFormatting.metricsFormat);
      } else {
        switch (type) {
          case models.constants.dataFormatType.date:
          case models.constants.dataFormatType.time:
          case models.constants.dataFormatType.datetime:
            if (dataFormatting.formatCustom.length > 0) {
              formatPreset = dataFormatting.formatCustom;
              formatType = "raw";
            } else {
              formatPreset = dataFormatting.formatPreset.value;
              formatType = dataFormatting.formatPreset.type.toLowerCase();
            }

            options[formatType] = formatPreset;
            formatter = models.formatterConfig.dateFormatter(options);
            break;

          case models.constants.dataFormatType.number:
            options = {
              style: dataFormatting.isPercentage ? "percent" : "decimal",
              round: dataFormatting.roundingMethod.length > 0 ? dataFormatting.roundingMethod : "round",
              useGrouping: dataFormatting.isThousandSeparated
            }
            if (dataFormatting.numberOfDecimals > -1) {
              options.minimumFractionDigits = 0;
              options.maximumFractionDigits = parseInt(dataFormatting.numberOfDecimals);
            } else {
              options.minimumFractionDigits = 0;
              options.maximumFractionDigits = 10;
            }

            formatter = models.formatterConfig.numberFormatter(options);
            break;

          case models.constants.dataFormatType.currency:
            options = {
              style: dataFormatting.style.length > 0 ? dataFormatting.style.toLowerCase() : "symbol",
              round: dataFormatting.roundingMethod.length > 0 ? dataFormatting.roundingMethod : "round",
              useGrouping: dataFormatting.isThousandSeparated
            }
            if (dataFormatting.numberOfDecimals > -1) {
              options.minimumFractionDigits = 0;
              options.maximumFractionDigits = parseInt(dataFormatting.numberOfDecimals);
            } else {
              options.minimumFractionDigits = 0;
              options.maximumFractionDigits = 10;
            }

            formatter = models.formatterConfig.currencyFormatter(dataFormatting.currency, options);
            break;

            //case models.constants.dataFormatType.text:
            //    //TODO: to be defined;
            //    break;                                       
        }
      }
      if (formatter) {
        value = formatter(value);
      }

      dataFormatting.prefix = dataFormatting.prefix || "";
      dataFormatting.suffix = dataFormatting.suffix || "";
      return dataFormatting.prefix + value + dataFormatting.suffix;
      
    }
  }
}(Sitecore.Speak.D3.models));

(function (models) {
    models.dispatcher = function () {
        "use strict";

        function dispatcher(event) {
            return d3.dispatch(event);
        };

        dispatcher.add = function (event) {
            return dispatcher(event);
        }

        return dispatcher;
    }
}(Sitecore.Speak.D3.models));

(function (speak, models) {
  models.data = {

    /**
    * Maps the data into the NVD3 data contract.
    * 
    * @param {object} datum - The dataset. 
    * @param {object} seriesDefinitions - The seriesDefinitions. 
    * @param {object} hasMultipleSeries - Defines whether the data has multiple series.    
    * @param {object} componentId - The component Id.  
    * @param {string} chartType - The chart type.       
    * @param {object} metricsFormat - The metricsFormat object used for SPEAK 1.1 formatting.       
    */
    initData: function (datum, seriesDefinitions, hasMultipleSeries, componentId, chartType, metricsFormat) {
      if (!this.validateData(datum, seriesDefinitions, componentId, chartType)) {
        console.warn(componentId + ": Invalid data");
        return null;
      }

      seriesDefinitions = this.validateSeriesDefinition(datum, seriesDefinitions, metricsFormat);

      // generate mapping fields array
      var fields = [];
      seriesDefinitions.forEach(function (seriesDefinition) {
        fields.push(
            [
                { key: "x", field: seriesDefinition.categoryFieldName },
                { key: "y", field: seriesDefinition.valueFieldName }
            ]
        );
      });

      return {
        data: this.mapData(datum, fields, hasMultipleSeries, seriesDefinitions, chartType),
        seriesDefinitions: seriesDefinitions
      };
    },

    /**
    * Validate.
    * 
    * @param {object} datum - The dataset. 
    * @param {object} seriesDefinitions - The seriesDefinitions.          
    * @param {object} metricsFormat - The metricsFormat object used for SPEAK 1.1 formatting.
    */
    validateSeriesDefinition: function (datum, seriesDefinitions, metricsFormat) {
      // order series definition by same data series order
      var index = 0;
      seriesDefinitions.forEach(function (seriesDefinition) {
        if (seriesDefinition.categoryDataFormatting) {
          if (seriesDefinition.categoryDataFormatting.numberOfDecimals) {
            seriesDefinition.categoryDataFormatting.numberOfDecimals = parseInt(seriesDefinition.categoryDataFormatting.numberOfDecimals);
            if (isNaN(seriesDefinition.categoryDataFormatting.numberOfDecimals)) {
              seriesDefinition.categoryDataFormatting.numberOfDecimals = -1;
            }
          } else {
            seriesDefinition.categoryDataFormatting.numberOfDecimals = -1;
          }
          if (isNaN(seriesDefinition.categoryDataFormatting.numberOfDecimals)) {
            seriesDefinition.categoryDataFormatting.numberOfDecimals = -1;
          }
        }

        if (seriesDefinition.valueDataFormatting) {
          if (seriesDefinition.valueDataFormatting.numberOfDecimals) {
            seriesDefinition.valueDataFormatting.numberOfDecimals = parseInt(seriesDefinition.valueDataFormatting.numberOfDecimals);
            if (isNaN(seriesDefinition.valueDataFormatting.numberOfDecimals)) {
              seriesDefinition.categoryDataFormatting.numberOfDecimals = -1;
            }
          } else {
            seriesDefinition.valueDataFormatting.numberOfDecimals = -1;
          }
        }
        index++;
      });

      var orderedSeriesDefinitions = [];
      datum.forEach(function (serie) {
        var foundItem = _.find(seriesDefinitions, function (seriesDefinition) {
          return seriesDefinition.seriesKey === serie.key;
        });

        if (foundItem) {
          this.setDataFormatting(datum, foundItem, metricsFormat);
          orderedSeriesDefinitions.push(foundItem);
        } else {
          var newSeriedDefinition = this.clone(seriesDefinitions[0]);
          newSeriedDefinition.seriesDisplayName = serie.key;
          newSeriedDefinition.seriesKey = serie.key;
          this.setDataFormatting(datum, newSeriedDefinition, metricsFormat);
          orderedSeriesDefinitions.push(newSeriedDefinition);
        }
      }.bind(this));
      seriesDefinitions = orderedSeriesDefinitions;

      return seriesDefinitions;
    },

    /**
    * Maps the data into the NVD3 data contract.
    * 
    * @param {object} datum - The dataset. 
    * @param {object} seriesDefinitions - The seriesDefinitions. 
    * @param {object} metricsFormat - The metricsFormat object used for SPEAK 1.1 formatting.       
    */
    setDataFormatting: function (datum, seriesDefinition, metricsFormat) {
      if (!seriesDefinition.categoryDataFormatting) {
        seriesDefinition.categoryDataFormatting = this.setDefaultDataFormatting(datum, seriesDefinition.categoryDataFormatting, seriesDefinition.categoryFieldName);
      }

      if (!seriesDefinition.valueDataFormatting) {
        seriesDefinition.valueDataFormatting = this.setDefaultDataFormatting(datum, seriesDefinition.valueDataFormatting, seriesDefinition.valueFieldName);
      }

      seriesDefinition.categoryDataFormatting = seriesDefinition.categoryDataFormatting || {};
      seriesDefinition.valueDataFormatting = seriesDefinition.valueDataFormatting || {};

      seriesDefinition.categoryDataFormatting.metricsFormat = metricsFormat.xOptions;
      seriesDefinition.valueDataFormatting.metricsFormat = metricsFormat.yOptions;
    },

    /**
    * Checks wheter the data has Number or Currency objects
    * @param {object} datum - The data object
    * @param {string} seriesDefinitions - The seriesDefinitions dataformatting property.  
    * @param {string} fieldName - The seriesDefinitions fieldName property.  
    */
    setDefaultDataFormatting: function (datum, dataFormatting, fieldName) {
      var newDataFormatting;
      if (models.utils.hasDateCategory(datum, dataFormatting, fieldName)) {
        newDataFormatting = models.constants.defaultDateDataFormatting;
      }
      else {
        if (models.utils.hasNumberCategory(datum, dataFormatting, fieldName)) {
          newDataFormatting = this.clone(models.constants.defaultNumberDataFormatting);
        } else {
          if (models.utils.hasCurrencyCategory(datum, dataFormatting)) {
            newDataFormatting = models.constants.defaultCurrencyDataFormatting;
          } else {
            newDataFormatting = null;
          }
        }
      }

      return newDataFormatting ? this.clone(newDataFormatting) : null;
    },

    /**
    * Maps the NVD3 data.
    * 
    * @param {object} datum - The dataset. 
    * @param {object} fields - The array of fields.    
    * @param {object} hasSeries - Defines whether the data has multiple series.                 
    * @param {object} seriesDefinitions - The seriesDefinitions.
    * @param {string} chartType - The chart type.  
    */
    mapData: function (datum, fields, hasMultipleSeries, seriesDefinitions, chartType) {
      var mappedData;
      var index = 0;
      if (hasMultipleSeries) {
        mappedData = datum.map(function (series) {
          return this.initSeries(series, fields[index], seriesDefinitions[index++], chartType);
        }.bind(this));
      } else {
        mappedData = this.initSingleSeries(datum, fields[0], seriesDefinitions[0]);
      }

      return mappedData;
    },

    /**
    * Maps a single series of the NVD3 data.
    * 
    * @param {object} series - The series. 
    * @param {object} fields - The array of fields.   
    * @param {object} seriesDefinition - The seriesDefinition. 
    * @param {string} chartType - The chart type.  
    */
    initSeries: function (series, fields, seriesDefinition, chartType) {
      var newSeries = {};
      var index;
      for (var property in series) {
        if (series.hasOwnProperty(property)) {
          newSeries.legendState = models.constants.legendState.checked;
          newSeries.previusLegendState = newSeries.legendState;
          newSeries.displayName = seriesDefinition.seriesDisplayName ? seriesDefinition.seriesDisplayName : series.key;

          if (property === "values") {
            index = 0;
            newSeries.values = [];
            series.values.forEach(function (dataItem) {
              newSeries.values.push({});
              fields.forEach(function (fieldItem) {
                if (fieldItem.field) {
                  var value = dataItem[fieldItem.field];

                  if (models.utilsConfig.isISODate(value)) {
                    value = models.utilsConfig.parseISODate(value);
                  }

                  if (chartType === models.constants.chartType.combination) {
                    if (models.utilsConfig.isDate(value)) {
                      value = Date.parse(value);
                    }
                  } else {
                    if (models.utilsConfig.isDate(value)) {
                      value = new Date(value);
                    }                    
                  }

                  newSeries.values[index][fieldItem.key] = value;
                }
              });
              index++;
            });
          } else {
            newSeries[property] = series[property];
          }
        }
      }
      return newSeries;
    },

    /**
    * Maps a single series of the NVD3 data.
    * 
    * @param {object} datum - The dataset. 
    * @param {object} fields - The array of fields. 
    * @param {object} seriesDefinition - The seriesDefinition.       
    */
    initSingleSeries: function (datum, fields, seriesDefinition) {
      var newData = datum[0].values.map(function (dataItem) {
        var newItem = {};
        newItem.legendState = models.constants.legendState.checked;
        newItem.previusLegendState = newItem.legendState;
        for (var property in dataItem) {
          if (dataItem.hasOwnProperty(property)) {
            fields.forEach(function (fieldItem) {
              if (fieldItem.field) {
                var value = dataItem[fieldItem.field];
                if (models.utilsConfig.isISODate(value)) {
                  value = models.utilsConfig.parseISODate(value);
                }
                newItem[fieldItem.key] = value;
              }
            });
          }
        };

        return newItem;
      });

      return newData;
    },

    /**
    * Set combination chart line series index.
    * 
    * @param {object} datum - The dataset.         
    */
    setCombinationChartLineSeriesIndex: function (datum) {
      var index = 0;
      datum.forEach(function (d) {
        if (!d.bar) {
          d.combinationChartLineSeriesIndex = index++;
        }
      });
    },

    /**
    * Calculate series percentages.
    * 
    * @param {object} datum - The dataset.         
    */
    setSeriesPercentages: function (datum) {
      var sum = this.sum(datum);
      var factor = sum !== 0 ? 100 / sum : 0;
      datum.forEach(function (d) {
        d.percentage = models.data.round(d.y * factor);
      });
    },

    /**
    * Calculate series percentages.
    * 
    * @param {object} datum - The dataset.         
    */
    setTooltipStackedSeriesPercentages: function (datum) {
      var sum = d3.sum(datum.series, function (g) { return g.value; });
      var factor = sum !== 0 ? 100 / sum : 0;
      datum.series.forEach(function (d) {
        d.percentage = models.data.round(d.value * factor);
      });
    },

    /**
    * Calculate the sum.
    * 
    * @param {object} datum - The dataset.         
    */
    sum: function (datum) {
      return d3.sum(datum, function (g) { return g.y; });
    },

    /**
    * Calculate the sum.        
    * @param {object} datum - The dataset.         
    * @param {bool} isValueConvertedToPercent - Defines whether ther value should be converted to percent. 
    */
    getVisibleSeriesSum: function (datum, isValueConvertedToPercent) {
      var visibleSum = d3.sum(datum, function (g) {
        return g.legendState === models.constants.legendState.unchecked ? 0 : g.y;
      });

      if (isValueConvertedToPercent) {
        var sum = models.data.sum(datum);
        return models.data.round((visibleSum / sum) * 100);
      }

      return visibleSum;
    },

    /**
    * Rounds to 2 decimal if not an integer.
    * 
    * @param {number} value - The number to round.         
    */
    round: function (value) {
      return Math.round(value * 100) / 100;
    },

    /**
    * Deep clones an object.
    * 
    * @param {object} object - The object to clone..        
    */
    clone: function (datum) {
      return JSON.parse(JSON.stringify(datum));
    },


    /**
    * Validates data
    * 
    * @param {object} datum - The dataset.      
    * @param {string} seriesDefinition - The seriesDefinition. 
    * @param {object} componentId - The component Id.                  
    * @param {string} chartType - The chartType id.                       
    */
    validateData: function (datum, seriesDefinitions, componentId, chartType) {
      if (!datum) {
        return false;
      }

      var seriesIndex = 0;
      try {
        seriesDefinitions.forEach(function (seriesDefinition) {

          if (!seriesDefinition.categoryFieldName) {
            throw "CategoryFieldName undefined!";
          }

          if (!seriesDefinition.valueFieldName) {
            throw "ValueFieldName undefined!";
          }
          if (datum[seriesIndex]) {

            if (!datum[seriesIndex].values[0].hasOwnProperty(seriesDefinition.categoryFieldName)) {
              throw "The Data does not contain '" + seriesDefinition.categoryFieldName + "' field";
            }

            if (!datum[seriesIndex].values[0].hasOwnProperty(seriesDefinition.valueFieldName)) {
              throw "The Data does not contain '" + seriesDefinition.valueFieldName + "' field";
            }

            if (chartType === models.constants.chartType.combination ||
              chartType === models.constants.chartType.area ||
              chartType === models.constants.chartType.line) {

              var firstCategory = datum[seriesIndex].values[0][seriesDefinition.categoryFieldName];
              if (!models.utilsConfig.isDate(firstCategory) && !models.utilsConfig.isISODate(firstCategory) && !models.utilsConfig.isNumber(firstCategory)) {
                throw "Area, Line and Combination charts require a numerable (number or date) category.";
              }
            }
          }

          seriesIndex++;
        });
      } catch (e) {
        console.warn(componentId + ": " + e);
        return false;
      }
      return true;
    },

    /**
    * Gets the Bar to Lines axis scale.
    * 
    * @param {array} yAxisDomain - The y axis domain.      
    * @param {array} y2AxisDomain - The y2 axis domain.          
    */
    getBarToLineAxisScale: function (yAxisDomain, y2AxisDomain) {
      var yAxisRange = (yAxisDomain[1] - yAxisDomain[0]);
      return yAxisRange === 0 ? 0 : (y2AxisDomain[1] - y2AxisDomain[0]) / yAxisRange;
    },

    /**
    * Maps the NVD3 data.
    * 
    * @param {object} datum - The dataset. 
    * returns - sorted by value array 
    **/
    sortByValue: function (datum) {
      return datum.sort(function (a, b) { return b.y - a.y; });
    },

    /**
    * Groups segments overmaxNumberOfSegments into the "Other" segment.
    * 
    * @param {object} datum - The dataset. 
    * @param {int} maxNumberOfSegments - The max number of segments. 
    * @param {string} otherTranslation - The "other" localized world. 
    * returns - sorted by value array 
    **/
    groupOtherSegment: function (datum, maxNumberOfSegments, otherTranslation) {
      if (maxNumberOfSegments < datum.length) {
        var otherValues = datum.slice(maxNumberOfSegments);
        var sum = d3.sum(otherValues, function (d) { return d.y; });
        datum = datum.slice(0, maxNumberOfSegments + 1);
        datum[maxNumberOfSegments].x = otherTranslation;
        datum[maxNumberOfSegments].y = sum;
      }

      return datum;
    },

    /**
    * Initializes SeriesDefinition.
    * 
    * @param {objet} seriesDefinitions - The seriesDefinitions object.        
    */
    initializeSeriesDefinitions: function (seriesDefinitions) {
      var output;

      if (seriesDefinitions && seriesDefinitions !== "[null]") {
        output = JSON.parse(seriesDefinitions);
      } else {
        output =
            [
                {
                  categoryDataFormatting: null,
                  valueDataFormatting: null,
                  seriesDisplayName: null,
                  seriesKey: null,
                  categoryFieldName: "x",
                  valueFieldName: "y"
                }
            ];
      }

      return output;
    },

    /**
     * Initialize Metrics Format
     * 
     * @param {object} options - The formatting options.  
     * returns - Inizialized metricsFormat. 
     **/
    initializeMetricsFormat: function (options) {
      var metricsFormat = {
        xOptions: {
          numberScale:null,
          numberScaleUnits: null,
          numberScaleValues: null
        },
        yOptions: {
          numberScale: null,
          numberScaleUnits: null,
          numberScaleValues: null
        }
      };
      metricsFormat.xOptions.numberScale = options.xNumberScale;
      metricsFormat.xOptions.numberScaleUnits = options.xNumberScaleUnits;
      metricsFormat.xOptions.numberScaleValues = options.xNumberScaleValues;
      metricsFormat.yOptions.numberScale = options.yNumberScale;
      metricsFormat.yOptions.numberScaleUnits = options.yNumberScaleUnits;
      metricsFormat.yOptions.numberScaleValues = options.yNumberScaleValues;

      return metricsFormat;
    },

     selectedDataItem: function(seriesKey,  x, y, rawData) {
       this.item = {
         seriesKey: seriesKey,
         x: x,
         y: y,
         rawData:rawData
     }
      return this.item;
    }
  }
}(Sitecore.Speak, Sitecore.Speak.D3.models));


var globalizeDataTypes = {
    date: "date",
    datetime: "datetime",
    time: "time",
    number: "number",
    currency: "currency",
    text: "text"
};

var mediumDateFormat = "medium";

Sitecore.Speak.D3.models.constants =
{
  animations: {
    none: 0,
    veryFast: 50,
    fast: 150,
    medium: 250,
    quiteSlow: 400,
    slow: 500,
    verySlow: 1000
  },

  chartType: {
    bar: 0,
    column: 1,
    line: 2,
    area: 3,
    pie: 4,
    doughnut: 5,
    combination: 6
  },

  legend: {
    iconSize: 12,
    gapIconText: 5,
    textPosition: 12 + 5,
    legendItemHeight: 20,
    legendItemsMargin: 20
  },

  yAxisLabelHeight: 18,
  chartTitleHeight: 48,

  categoryInformation: {
    legend: "Legend",
    calloutLabels: "Callout Labels",
    none: "None"
  },

  eventType: {
    mouseClick: 0,
    mouseOver: 1,
    mouseOut: 2
  },

  legendState: {
    checked: 0,
    unchecked: 1,
    disengaged: 2,
    hover: 3
  },

  legendMode: {
    exclusiveCheck: 0,
    multipleCheck: 1
  },

  visualizationMode: {
    standard: 0,
    notVisible: 1,
    emphasized: 2,
    deemphasized: 3
  },

  dataFormatType: globalizeDataTypes,

  defaultDateFormat: mediumDateFormat,
  defaultDateType: globalizeDataTypes.date,

  defaultDateDataFormatting: {
    prefix: "",
    suffix: "",
    formatCustom: "",
    fieldType: globalizeDataTypes.date,
    formatPreset: {
      type: globalizeDataTypes.date,
      value: mediumDateFormat
    }
  },

  defaultNumberDataFormatting: {
    prefix: "",
    suffix: "",
    fieldType: globalizeDataTypes.number,
    isPercentage: false,
    roundingMethod: "round",
    numberOfDecimals: -1, //not applied
    isThousandSeparated: true
  },

  defaultCurrencyDataFormatting: {
    currency: "USD",
    style: "symbol",
    prefix: "",
    suffix: "",
    fieldType: globalizeDataTypes.number,
    isPercentage: false,
    roundingMethod: "round",
    numberOfDecimals: -1, //not applied
    isThousandSeparated: true
  },


  defaultNumberDataFormattingForPercentages: {
    prefix: "",
    suffix: "",
    fieldType: globalizeDataTypes.number,
    isPercentage: true,
    roundingMethod: "round",
    numberOfDecimals: 2,
    isThousandSeparated: true
  },
  pieLabelsVisibilityThreshold: 200,

  darkerLayerOpacity: 0.4,
  brighterLayerOpacity: 0.8,
  legendItemBrighterLayerOpacity: 0.2,
  doughnutLabelsVisibilityThreshold: 125,
  doughnutRadio: 0.52,
  pieLabelAngleThreshold: 0.1,
  idSelector: "data-sc-id",
  darkLayerColor: "black",
  brightLayerColor: "white",
  darkLabelColor: "black",
  brightLabelColor: "white",
  trimFromStart: "TrimFromStart",
  allSeries: "all"
};
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



(function (models) {
  models.nvd3Tooltip = {

    /**
    * Sets the tooltip for single, multiple and stacked series.
    * @param {object} chartProperties - The ChartProperties object.       
    * @param {bool} reverseOrder -  Defines whether the data should be in reversed order.    
    * @param {object} isPercentage - Defines whether the value is in percentage.      
    * @param {object} valueFormatter - Values formatter function.      
    * @param {object} categoryFormatter - Category formmater function
    */
    setTooltip: function (chartProperties, reverseOrder, isPercentage) {
      var roundedClass = "",
          valueClass = "",
          seriesIndex,
          index,
          content,
          values = [],
          value,
          visibleSeriesIndex,
          valueIndex,
          color,
          hasTotal,
          scaledValue,
          chartElement = chartProperties.chartElement,
          data = chartProperties.chartData,
          palette = chartProperties.palette,
          isSingleSeries = chartProperties.isSingleSeries,
          isSeriesStacked = chartProperties.isSeriesStacked,
          chartType = chartProperties.chartType,
          barToLineAxisScale = chartProperties.barToLineAxisScale,
          dataLength = data.length,
          valueFormatter = chartProperties.valueFormatter,
          categoryFormatter = chartProperties.categoryFormatter;

      if (chartType === models.constants.chartType.pie || chartType === models.constants.chartType.doughnut) {
        chartElement.tooltip.contentGenerator(function (d) {
          valueClass = d.data.y < 0 ? " negativeValue" : "";
          content = "<table><thead><tr><td colspan='3'><strong class='x-value'>" + d.data.x + "</strong></td></tr></thead><tbody>";
          content += this.createSingleSeriesTooltipContent(
              d.data.y,
              d.data.percentage,
              chartProperties.valueFormatter
          );
          content += "</tbody></table>";
          return content;
        }.bind(this));
        return;
      }

      if (chartType === models.constants.chartType.line || chartType === models.constants.chartType.area) {
        roundedClass = "rounded";

        chartElement.interactiveLayer.tooltip.contentGenerator(function (d) {
          if (!data || data.length === 0) {
            return "";
          }
          hasTotal = (d.series[(d.series.length - 1)].key && d.series[(d.series.length - 1)].key === "TOTAL");
          valueClass = d.value < 0 ? " negativeValue" : "";
          content = "<table><thead><tr><td colspan='3'><strong class='x-value " + valueClass + "'>" + d.value + "</strong></td></tr></thead><tbody>";
          values = [];
          if (isPercentage) {
            models.data.setTooltipStackedSeriesPercentages(d);
          }
          for (seriesIndex = 0; seriesIndex < dataLength; seriesIndex++) {
            index = reverseOrder ? (dataLength - 1 - seriesIndex) : seriesIndex;
            if (data[index].legendState === models.constants.legendState.unchecked) {
              continue;
            }
            visibleSeriesIndex = models.utils.getVisibleSerieIndex(data, index);
            color = models.colors.getPaletteColor(palette, index);
            switch (chartType) {
              case models.constants.chartType.line:
                if (data[index].values.length >= d.index && d.index >= 0) {
                  values.push({ key: data[index].displayName, value: data[index].values[d.index].y, color: color, legendState: data[index].legendState });
                }
                break;
              case models.constants.chartType.area:
                // data.series is added by 1 value (total) if more than 1 series is visible and is not percentage stacked are. 
                // Its order is inverted.
                valueIndex = d.series.length === 1 ? 0 : (d.series.length - (hasTotal ? 2 : 1)) - visibleSeriesIndex;
                if (valueIndex >= 0) {
                  value = isPercentage ? d.series[valueIndex].percentage : d.series[valueIndex].value;
                  if (d.series.length > valueIndex) {
                    values.push({ key: data[index].displayName, value: value, color: color, legendState: data[index].legendState });
                  }
                }
                break;
            }
          }

          if (chartType === models.constants.chartType.line) {
            values.sort(function (a, b) {
              return b.value - a.value;
            });
          }

          values.forEach(function (serie) {
            content += this.createSeriesTooltipContent(
                serie.key,
                serie.value,
                serie.color,
                roundedClass,
                isPercentage,
                valueFormatter,
                serie.legendState);
          }.bind(this));
          content += "</tbody></table>";

          return content;
        }.bind(this));

        return;
      }

      if (!isSingleSeries && isSeriesStacked) {
        chartElement.tooltip.contentGenerator(function (d) {
          content = "<table><thead><tr><td colspan='3'><strong class='x-value'>" + this.formatValue(false, categoryFormatter, d.value) + "</strong></td></tr></thead><tbody>";

          for (seriesIndex = 0; seriesIndex < dataLength; seriesIndex++) {
            index = reverseOrder ? (dataLength - 1 - seriesIndex) : seriesIndex;
            if (data[index].legendState === models.constants.legendState.unchecked) {
              continue;
            }
            content += this.createSeriesTooltipContent(
                data[index].displayName,
                data[index].values[d.index].y,
                d3.rgb(models.colors.getPaletteColor(palette, index)).darker(1),
                roundedClass,
                isPercentage,
                valueFormatter,
                models.constants.legendState.emphasized);
          }
          content += "</tbody></table>";
          return content;
        }.bind(this));
      } else {
        if (isSingleSeries) {
          chartElement.tooltip.contentGenerator(function (d) {
            valueClass = d.data.y < 0 ? " negativeValue" : "";
            content = "<table><thead><tr><td>" +
                "<strong class='x-value'>" + this.formatValue(false, categoryFormatter, d.value) + "</strong></td></tr></thead><tbody>" +
                "<tr><td class='value" + valueClass + "'>" + d.data.y + "</td></tr></tbody></table>";
            return content;
          }.bind(this));
        } else {
          if (chartType === models.constants.chartType.combination) {
            chartElement.tooltip.contentGenerator(function (d) {
              values = [];
              var categoryIndex = 0;
              if (d.point) {
                categoryIndex = chartProperties.hasBarSeries ? d.pointIndex + 1 : d.pointIndex;
              } else {
                categoryIndex = d.index;
                if (d.index === 0 || (d.index === chartProperties.chartData[0].values.length - 1)) {
                  chartProperties.chartElement.tooltip.hidden(true);
                  return "";
                }
              }
              if (!data[0].values[categoryIndex]) {
                return "";
              }

              content = "<table><thead><tr><td colspan='3'><strong class='x-value'>" + this.formatValue(false, categoryFormatter, data[0].values[categoryIndex].x) + "</strong></td></tr></thead><tbody>";

              for (seriesIndex = 0; seriesIndex < dataLength; seriesIndex++) {

                if (data[seriesIndex].legendState === models.constants.legendState.unchecked) {
                  continue;
                }

                color = data[seriesIndex].bar ? d3.rgb(models.colors.getPaletteColor(palette, seriesIndex)).darker(1) : models.colors.getPaletteColor(palette, seriesIndex);

                valueIndex = data[seriesIndex].bar ? categoryIndex : categoryIndex - 1;
                if (data[seriesIndex].values[valueIndex]) {
                  roundedClass = data[seriesIndex].bar ? "" : "rounded";
                  scaledValue = data[seriesIndex].bar ? data[seriesIndex].values[valueIndex].y * barToLineAxisScale : data[seriesIndex].values[valueIndex].y;
                  values.push({
                    key: data[seriesIndex].displayName,
                    value: data[seriesIndex].values[valueIndex].y,
                    scaledValue: scaledValue,
                    color: color,
                    legendState: data[seriesIndex].legendState,
                    roundedClass: roundedClass,
                    valueFormatter: data[seriesIndex].bar ? chartProperties.valueFormatter : chartProperties.valueFormatter2
                  });
                }
              }
              values.sort(function (a, b) {
                return b.scaledValue - a.scaledValue;
              });

              values.forEach(function (serie) {
                content += this.createSeriesTooltipContent(
                    serie.key,
                    serie.value,
                    serie.color,
                    serie.roundedClass,
                    isPercentage,
                    serie.valueFormatter,
                    serie.legendState);
              }.bind(this));

              content += "</tbody></table>";
              chartProperties.dispatcher.tooltipShown(d);
              return content;

            }.bind(this));
          } else {
            chartElement.tooltip.contentGenerator(function (d) {
              valueClass = d.series[0].value < 0 ? " negativeValue" : "";
              content = "<table><thead><tr><td colspan='3'><strong class='x-value'>" + this.formatValue(false, categoryFormatter, d.value) + "</strong></td></tr></thead><tbody>";
              content += this.createSeriesTooltipContent(
                  data[models.utils.getSerieIndex(data, d.data.series)].displayName,
                  d.series[0].value,
                  d3.rgb(d.series[0].color).darker(1.5),
                  roundedClass,
                  isPercentage,
                  valueFormatter,
                  models.constants.legendState.emphasized);
              content += "</tbody></table>";
              return content;
            }.bind(this));
          }
        }
      }
    },

    /**
    * Disables the tooltip.
    * @param {bool} isDisabled - The isDisabled flag.       
    * @param {object} chartElement - The chartElement object.       
    * @param {string} chartType - The chartType.       
    */
    disableTooltip: function (isDisabled, chartElement, chartType) {
      if (chartType === models.constants.chartType.line || chartType === models.constants.chartType.area) {
        chartElement.interactiveLayer.tooltip.enabled(!isDisabled);
        return;
      }

      chartElement.tooltip.contentGenerator(function (d) {
      });
      return;
    },

    /**
    * Format value.
    * @param {object} isPercentage - define if the value is in percentage.       
    * @param {string} formatter - The formatter funtion.    
    * @param {object} value - The value.      
    */
    formatValue: function (isPercentage, formatter, value) {
      if (formatter) {
        if (typeof formatter === 'function') {
          value = formatter(value);
        }
      }
      return value;
    },

    /**
    * Create series tooltip content.
    * @param {object} key - The key.       
    * @param {string} value - The value.    
    * @param {color} value - The color.      
    */
    createSeriesTooltipContent: function (key, value, color, roundedClass, isPercentage, formatter, legendState) {
      var valueClass = value < 0 ? " negativeValue" : "";
      value = this.formatValue(isPercentage, formatter, value);
      var deemphasizedStyle = (legendState === models.constants.legendState.disengaged) ? " opacity:" + models.constants.legendItemBrighterLayerOpacity + ";" : "";
      var content = "<tr><td class='legend-color-guide'><div class='" + roundedClass + "' style='background-color: " + color + "; " + deemphasizedStyle + "'></div></td>";
      content += "<td class='key'>" + key + "</td>";
      content += "<td class='value right-align" + valueClass + "'>" + value + "</td></tr>";
      return content;
    },

    /**
    * Create stacked series tooltip content.
    * @param {object} key - The key.       
    * @param {string} value - The value.    
    * @param {color} value - The color.      
    */
    createSingleSeriesTooltipContent: function (value, percentage, formatter) {
      var valueClass = value < 0 ? " negativeValue" : "";
      if (formatter) {
        value = formatter(value);
      }
      var percentageValue = "";
      if (percentage != null) {
        percentageValue = "(" + models.nvd3Axis.calculatedPercentageFormatter(percentage) + ")";
      }
      var content = "<tr>";
      content += "<td class='value" + valueClass + "'>" + value + "</td>";
      content += "<td class='value" + valueClass + "'>" + percentageValue + "</td><td></td></tr>";
      return content;
    },

    /**
     * Remove tooltips on screen resize to prevent horizontal scrollbar
     */
    removeTooltipOnResize: function () {
      $(document.body).find('div.nvtooltip').css({ transform: 'translateX(-999px)' });
    }
  }
}(Sitecore.Speak.D3.models));



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