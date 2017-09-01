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
