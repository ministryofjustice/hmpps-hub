define(["bclChartPalette"], function (chartPalette) {
  var fusionChartsAdapter = {
    chartDictionary: null,
    propertySeperator: "|",
    disableSelection: false,
    fusionChartsAttributeNames: {
      axis: "axis",
      category: "category",
      categories: "categories",
      colorrange: "colorRange",
      data: "data",
      dataset: "dataset",
      id: "id",
      label: "label",
      link: "link",
      seriesname: "seriesname",
      value: "value"
    },
    reservedDataProperties: {
      id: "id",
      segmentTooltip: "segmentTooltip"
    },

    // Convert the data into the correct format depending on the dataType
    convert: function (datasetIndex, dataType, data, dataMapping, thresholdPercentage, dictionary, disableSelection) {
      "use strict";
      this.chartDictionary = dictionary;
      this.disableSelection = disableSelection;
      var arrayData = data.dataset[datasetIndex].data,
        localization = data.localization;

      if (arrayData.length) {

        // Convert the data to the specific adapter
        switch (dataType) {
          case "SingleSeries":
            return this.singleSeries(arrayData, dataMapping);
          case "MultiSeries":
            return this.multiSeries(arrayData, dataMapping, localization);
          case "MultiAxis":
            return this.multiAxis(arrayData, dataMapping);
          case "Mapping":
            return this.mapping(arrayData, dataMapping, thresholdPercentage);
        }
      }

      return null;
    },

    // Returns the correctly formatted data for MultiAxis charts
    multiAxis: function (arrayData, dataMapping) {
      "use strict";

      var data = {};

      data[this.fusionChartsAttributeNames.categories] = this.createCategories(arrayData, dataMapping);
      data[this.fusionChartsAttributeNames.axis] = this.createAxis(arrayData, dataMapping);

      return data;
    },

    // Returns the correctly formatted data for MultiSeries charts
    multiSeries: function (arrayData, dataMapping, localization) {
      "use strict";

      var data = {},
        seriesKeys;

      data[this.fusionChartsAttributeNames.categories] = this.createCategories(arrayData, dataMapping);
      seriesKeys = this.getSeriesKeys(arrayData, dataMapping);
      data[this.fusionChartsAttributeNames.dataset] = this.createDataset(arrayData, dataMapping, seriesKeys, localization);

      return data;
    },

    // Returns the correctly formatted data for SingleSeries charts
    singleSeries: function (arrayData, dataMapping) {
      "use strict";

      var data = {};

      data[this.fusionChartsAttributeNames.data] = this.createData(arrayData, dataMapping, false);

      return data;
    },


    // Returns the correctly formatted data for Mapping charts
    mapping: function (arrayData, dataMapping, thresholdPercentage) {
      "use strict";

      var data = {};

      var minMax = this.setDataMinMax(arrayData, dataMapping.valueChartFields[0].dataField);
      var minValue = minMax.min;
      var maxValue = minMax.max;
      var threshold = minValue + ((maxValue - minValue) * thresholdPercentage / 100);
      data[this.fusionChartsAttributeNames.colorrange] = this.createMappingColorRange(minValue, maxValue, threshold, null, chartPalette.comparisonColors);
      data[this.fusionChartsAttributeNames.data] = this.createData(arrayData, dataMapping, true);

      return data;
    },

    // Create all axes for a MultiAxis and return them as an array of objects
    createAxis: function (arrayData, dataMapping) {
      "use strict";

      var axis = [],
        axes = dataMapping.valueChartFields,
        axesLength = axes.length,
        axisDefinitions = [],
        i,
        currentAxisDefinition,
        axisDefinitionsLength,
        j;

      // Finds the axis definitions and put them into the array axisDefinitions
      for (i = 0; i < axesLength; i += 1) {
        currentAxisDefinition = {
          dataField: axes[i].dataField,
          headerText: axes[i].headerText,
          multiAxisChartPosition: axes[i].multiAxisChartPosition,
          prefix: axes[i].prefix,
          suffix: axes[i].suffix,
          numberScale: axes[i].numberScale,
          decimalSeparator: axes[i].decimalSeparator,
          thousandSeparator: axes[i].thousandSeparator,
          scaleRecursively: axes[i].scaleRecursively,
        };
        axisDefinitions.push(currentAxisDefinition);
      }

      axisDefinitionsLength = axisDefinitions.length;

      // Create a single axis for each axisDefinition
      for (j = 0; j < axisDefinitionsLength; j += 1) {
        axis.push(this.createSingleAxis(arrayData, dataMapping, axisDefinitions[j]));
      }

      return axis;
    },

    // Create a single axis object and returns it
    createSingleAxis: function (arrayData, dataMapping, axisDefinitions) {
      "use strict";

      var singleAxis = {
        "title": axisDefinitions.headerText,
        "titlepos": axisDefinitions.multiAxisChartPosition.toUpperCase(),
        "axisonleft": axisDefinitions.multiAxisChartPosition.toLowerCase() === "left" ? 1 : 0,
        "numberprefix": axisDefinitions.prefix,
        "numbersuffix": axisDefinitions.suffix,
        "decimalSeparator": axisDefinitions.decimalSeparator,
        "thousandSeparator": axisDefinitions.thousandSeparator
      };

      if (axisDefinitions.numberScale && axisDefinitions.numberScale.scaleValue && axisDefinitions.numberScale.scaleUnit) {
        singleAxis["numberScaleValue"] = axisDefinitions.numberScale.scaleValue.replace(/"/g, "");
        singleAxis["numberScaleUnit"] = axisDefinitions.numberScale.scaleUnit.replace(/"/g, "");
        singleAxis["scaleRecursively"] = axisDefinitions.scaleRecursively ? 1 : 0;
      }

      singleAxis[this.fusionChartsAttributeNames.dataset] = this.createMultiAxisDataset(arrayData, dataMapping, axisDefinitions);

      return singleAxis;
    },

    // Returns the categories, and also cleans up arrayData by the categoryFilter
    createCategories: function (arrayData, dataMapping) {
      "use strict";

      var categories = [],
        arrayDataLength = arrayData.length,
        category = {},
        categoryFilter = dataMapping.categoryFilter,
        filteredCategories = [],
        tempDataArray = [],
        i,
        dataRow,
        categoryName,
        filteredCategoriesLength,
        j;

      if (arrayData[0][dataMapping.categoryChartField.dataField] !== 0 && !arrayData[0][dataMapping.categoryChartField.dataField]) {
        throw { name: "Error", message: chartDictionary["CategoryChartField not defined"] };
      }

      category[this.fusionChartsAttributeNames.category] = [];

      // get array of unique filtered categories
      for (i = 0; i < arrayDataLength; i += 1) {
        dataRow = arrayData[i];
        categoryName = arrayData[i][dataMapping.categoryChartField.dataField];

        if (categoryFilter && categoryFilter.indexOf(categoryName) === -1) {
          categoryName = null;
        } else {
          tempDataArray.push(dataRow);
        }

        if (categoryName && filteredCategories.indexOf(categoryName) === -1) {
          filteredCategories.push(categoryName);
        }
      }

      // we are actually setting a new value to the array 
      arrayData = tempDataArray;

      filteredCategoriesLength = filteredCategories.length;

      for (j = 0; j < filteredCategoriesLength; j += 1) {
        category[this.fusionChartsAttributeNames.category].push(this.createCategory(filteredCategories[j]));
      }

      categories.push(category);

      if (categories[0].category.length === 0) {
        throw { name: "Warning", message: chartDictionary["Categories not defined"] };
      }

      return categories;
    },

    // Returns a category label object
    createCategory: function (label) {
      "use strict";

      var categoryObj = {};

      categoryObj[this.fusionChartsAttributeNames.label] = label.toString();

      return categoryObj;
    },

    // Returns all unique series as an array
    getSeriesKeys: function (arrayData, dataMapping) {
      "use strict";

      if (dataMapping.seriesFilter) {
        return dataMapping.seriesFilter;
      }

      var arrayDataLength = arrayData.length,
        seriesKeys = [],
        i,
        key;

      if (!arrayData[0][dataMapping.seriesChartField.dataField]) {
        throw { name: "Error", message: chartDictionary["SeriesChartField not defined"] };
      }

      for (i = 0; i < arrayDataLength; i += 1) {
        key = arrayData[i][dataMapping.seriesChartField.dataField];

        if (seriesKeys.indexOf(key) === -1) {
          seriesKeys.push(key);
        }
      }

      return seriesKeys;
    },

    // Creates the series datapoint
    createSet: function (value, tooltip, label, isMapping, selectedSegment) {
      "use strict";

      var setObj = {};

      setObj[this.fusionChartsAttributeNames.value] = value;

      if (tooltip) {
        setObj["toolText"] = tooltip.replace(/<br \/>/g, "{br}");
      }

      if (selectedSegment.dataObject.color) {
        setObj["color"] = selectedSegment.dataObject.color;
      }

      if (!this.disableSelection) {
        setObj[this.fusionChartsAttributeNames.link] = "javascript:_sc.Charting.SelectedSegment = " + JSON.stringify(selectedSegment);
      }

      if (label) {
        if (isMapping) {
          setObj[this.fusionChartsAttributeNames.id] = label.toString();
        } else {
          setObj[this.fusionChartsAttributeNames.label] = label.toString();
        }
      }

      return setObj;
    },

    // Create dataset for MultiSeries
    createDataset: function (arrayData, dataMapping, seriesKeys, localization) {
      "use strict";

      var dataset = [],
        datasetCount = seriesKeys.length,
        seriesFilter = dataMapping.seriesFilter,
        arrayDataLength = arrayData.length,
        j,
        seriesObj,
        i,
        k,
        currentDatarow,
        seriesValue,
        seriesIndex,
        value,
        localizationFieldsLength = localization ? localization.fields.length : 0,
        seriesTranslations,
        selectedSegment;

      if (arrayData[0][dataMapping.valueChartFields[0].dataField] !== 0 && !arrayData[0][dataMapping.valueChartFields[0].dataField]) {
        throw { name: "Error", message: chartDictionary["ValueChartField not defined"] };
      }

      // Locate the correct localization translation
      if (localizationFieldsLength) {
        for (k = 0; k < localizationFieldsLength; k++) {
          if (localization.fields[k].field === dataMapping.seriesChartField.dataField) {
            seriesTranslations = localization.fields[k].translations;
          }
        }
      }

      // Create each series object
      for (j = 0; j < datasetCount; j += 1) {
        if (!dataMapping.seriesFilter || (seriesFilter && seriesFilter.indexOf(seriesKeys[j]) !== -1)) {
          seriesObj = {};

          // Add seriesname
          seriesObj[this.fusionChartsAttributeNames.seriesname] = seriesTranslations && typeof seriesTranslations[seriesKeys[j]] !== "undefined" ? seriesTranslations[seriesKeys[j]] : seriesKeys[j];

          // Add data
          seriesObj[this.fusionChartsAttributeNames.data] = [];

          dataset.push(seriesObj);
        }
      }

      // Set the data for each series object
      for (i = 0; i < arrayDataLength; i += 1) {
        currentDatarow = arrayData[i];
        seriesValue = currentDatarow[dataMapping.seriesChartField.dataField];
        seriesIndex = seriesKeys.indexOf(seriesValue);
        if (currentDatarow[this.reservedDataProperties.id]) {
          selectedSegment = this.createSelectedSegment(currentDatarow[this.reservedDataProperties.id], i, currentDatarow, seriesIndex);
        } else {
          selectedSegment = this.createSelectedSegment(currentDatarow[dataMapping.categoryChartField.dataField], i, currentDatarow, seriesIndex);
        }

        if (seriesIndex !== -1) {
          value = currentDatarow[dataMapping.valueChartFields[0].dataField];
          var segmentTooltip = currentDatarow[this.reservedDataProperties.segmentTooltip];

          dataset[seriesIndex][this.fusionChartsAttributeNames.data].push(this.createSet(value, segmentTooltip, null, false, selectedSegment));
        }
      }

      return dataset;
    },

    createSelectedSegment: function (id, dataIndex, dataObject, seriesIndex) {
      if (!id) {
        return null;
      }

      return {
        id: id,
        action: null,
        dataIndex: dataIndex,
        seriesIndex: seriesIndex,
        dataObject: dataObject
      };
    },

    createMappingColorRange: function (minValue, maxValue, thershold, displayValues, colorPalette) {
      var numberOfSteps = colorPalette.length / 2;
      var singleStepRangeGood = (maxValue - thershold) / numberOfSteps;

      var color = [];
      this.setMappingColors(maxValue, numberOfSteps, 0, singleStepRangeGood, colorPalette, color);

      var singleStepRangeBad = (thershold - minValue) / numberOfSteps;
      this.setMappingColors(thershold, numberOfSteps, numberOfSteps, singleStepRangeBad, colorPalette, color);

      var colorRange = {
        "color": color
      };

      return colorRange;
    },

    setMappingColors: function (maxValue, numberOfSteps, startingStep, singleStepRange, colorPalette, color) {

      for (var index = 0; index < numberOfSteps; index++) {

        var singleStep = {
          "minValue": maxValue - (singleStepRange * (index + 1)),
          "maxValue": maxValue - (singleStepRange * index),
          "displayValue": "",
          "color": colorPalette[startingStep++]
        };
        color.push(singleStep);
      }
    },

    // Create dataset for SingleSeries
    createData: function (arrayData, dataMapping, isMapping) {
      "use strict";

      var data = [],
        arrayDataLength = arrayData.length,
        categoryFilter = dataMapping.categoryFilter,
        i,
        label,
        value,
        dataLength,
        existsInData,
        j,
        selectedSegment;

      if (arrayData[0][dataMapping.valueChartFields[0].dataField] !== 0 && !arrayData[0][dataMapping.valueChartFields[0].dataField]) {
        throw { name: "Error", message: chartDictionary["ValueChartField not defined"] };
      }

      if (arrayData[0][dataMapping.categoryChartField.dataField] !== 0 && !arrayData[0][dataMapping.categoryChartField.dataField]) {
        throw { name: "Error", message: chartDictionary["CategoryChartField not found"] };
      }

      // Set the data
      for (i = 0; i < arrayDataLength; i += 1) {
        value = arrayData[i][dataMapping.valueChartFields[0].dataField];
        label = arrayData[i][dataMapping.categoryChartField.dataField];
        dataLength = data.length;
        existsInData = false;

        if (arrayData[i][this.reservedDataProperties.id]) {
          selectedSegment = this.createSelectedSegment(arrayData[i][this.reservedDataProperties.id], i, arrayData[i], 0);
        } else {
          selectedSegment = this.createSelectedSegment(arrayData[i][dataMapping.categoryChartField.dataField], i, arrayData[i], 0);
        }


        if (!categoryFilter || categoryFilter.indexOf(label) !== -1) {
          for (j = 0; j < dataLength; j += 1) {
            if (!existsInData) {
              existsInData = data[j][this.fusionChartsAttributeNames.label] === label;

              if (existsInData) {
                data[j][this.fusionChartsAttributeNames.value] = parseFloat(data[j][this.fusionChartsAttributeNames.value]) + parseFloat(value);
              }
            }
          }

          if (!existsInData) {
            var segmentTooltip = arrayData[i][this.reservedDataProperties.segmentTooltip];

            data.push(this.createSet(value, segmentTooltip, label, isMapping, selectedSegment));
          }
        }
      }

      if (arrayData.length > 0 && categoryFilter && data.length === 0) {
        throw { name: "Warning", message: chartDictionary["Categories not defined"] };
      }

      return data;
    },

    // Create each dataset for MultiAxis and returns it as an array
    createMultiAxisDataset: function (arrayData, dataMapping, valueChartField) {
      "use strict";

      var dataset = [],
        arrayDataLength = arrayData.length,
        seriesObj = {},
        category = "",
        value = 0,
        i,
        currentDatarow,
        currentCategory,
        currentValue,
        selectedSegment;

      if (arrayData[0][dataMapping.valueChartFields[0].dataField] !== 0 && !arrayData[0][dataMapping.valueChartFields[0].dataField]) {
        throw { name: "Error", message: chartDictionary["ValueChartField not defined"] };
      }

      if (arrayData[0][dataMapping.categoryChartField.dataField] !== 0 && !arrayData[0][dataMapping.categoryChartField.dataField]) {
        throw { name: "Error", message: chartDictionary["CategoryChartField not defined"] };
      }

      // Add seriesname
      seriesObj[this.fusionChartsAttributeNames.seriesname] = valueChartField.headerText;

      // Add data
      seriesObj[this.fusionChartsAttributeNames.data] = [];

      // Set the data for each series object
      for (i = 0; i < arrayDataLength; i += 1) {
        currentDatarow = arrayData[i];
        currentCategory = currentDatarow[dataMapping.categoryChartField.dataField];
        currentValue = parseFloat(currentDatarow[valueChartField.dataField]);

        if (currentDatarow[this.reservedDataProperties.id]) {
          selectedSegment = this.createSelectedSegment(currentDatarow[this.reservedDataProperties.id], i, currentDatarow);
        } else {
          selectedSegment = this.createSelectedSegment(currentCategory, i, currentDatarow);
        }

        var segmentTooltip = currentDatarow[this.reservedDataProperties.segmentTooltip];

        if (category !== currentCategory) {
          if (category) {

            seriesObj[this.fusionChartsAttributeNames.data].push(this.createSet(value, segmentTooltip, null, false, selectedSegment));
          }

          category = currentCategory;
          value = currentValue;
        } else {
          value = value + currentValue;
        }

        if ((i + 1) === arrayDataLength) {
          seriesObj[this.fusionChartsAttributeNames.data].push(this.createSet(value, segmentTooltip, null, false, selectedSegment));
        }
      }

      dataset.push(seriesObj);

      return dataset;
    },

    calculateFunction: function (data, dataField, dataFunction) {
      if (data) {

        var result = 0;

        if (!data.dataset[0].data[0][dataField]) {
          throw { name: "Error", message: chartDictionary["DataField not defined"] };
        }

        switch (dataFunction) {
          case "Sum":
            result = 0;
            _.each(data.dataset[0].data, function (obj) {
              result += parseFloat(obj[dataField]);
            }, this);
            break;

          case "Average":
            if (data.dataset[0].data.length == 0) {
              return 0;
            }

            result = 0;
            _.each(data.dataset[0].data, function (obj) {
              result += parseFloat(obj[dataField]);
            }, this);

            result = result / data.dataset[0].data.length;
            break;

          case "Max":
            result = Number.MIN_VALUE;
            _.each(data.dataset[0].data, function (obj) {
              var currentValue = parseFloat(obj[dataField]);
              if (currentValue > result) {
                result = currentValue;
              }
            }, this);
            break;

          case "Min":
            result = Number.MAX_VALUE;
            _.each(data.dataset[0].data, function (obj) {
              var currentValue = parseFloat(obj[dataField]);
              if (currentValue < result) {
                result = currentValue;
              }
            }, this);
            break;

          case "Last":
            result = parseFloat(data.dataset[0].data[data.dataset[0].data.length - 1][dataField]);
            break;

          case "First":
            result = parseFloat(data.dataset[0].data[0][dataField]);
            break;
        }

        if (isNaN(result)) {
          return "";
        }

        result = result.toFixed(2);
        if (result % 1 === 0) {
          result = parseInt(result);
        }
        return result;
      }

      return "";
    },

    setDataMinMax: function (data, dataField) {
      var maxValue = Number.MIN_VALUE;
      var minValue = Number.MAX_VALUE;
      _.each(data, function (obj) {
        var currentValue = parseFloat(obj[dataField]);
        if (currentValue < minValue) {
          minValue = currentValue;
        }

        if (currentValue > maxValue) {
          maxValue = currentValue;
        }
      }, this);

      return {
        min: minValue,
        max: maxValue
      };
    }
  };
  return fusionChartsAdapter;
});