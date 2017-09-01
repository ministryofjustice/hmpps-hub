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

