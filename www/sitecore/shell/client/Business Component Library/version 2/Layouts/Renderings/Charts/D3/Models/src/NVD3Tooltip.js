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


