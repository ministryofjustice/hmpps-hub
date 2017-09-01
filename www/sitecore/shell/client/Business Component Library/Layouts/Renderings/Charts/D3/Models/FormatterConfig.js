Sitecore.Speak.D3 = Sitecore.Speak.D3 || {};
Sitecore.Speak.D3.models = Sitecore.Speak.D3.models || {};

(function (models) {
  /**
   * In order to use a different formmating module than Globalize.js
   * you need to redefine models.formatterConfig specifying a new date, currency, number formatter function       
   */
  models.formatterConfig = {
    dateFormatter: function (options) {
       return function (value) {
          return value;
       };
    },
    currencyFormatter: function (options) {
       return function (value) {
          return value;
       };
    },
    numberFormatter: function (options) {
      return function (value) {
        if (options.style === "percent") {
          value = parseFloat((value * 100).toFixed(options.maximumFractionDigits)) + '%';
        }
        return value;
      };
    },

    metricsFormatter: function (options) {
      return function (value) {
        return models.metricsFormatter.getFormattedString(
          value,
          options.numberScale,
          options.numberScaleUnits,
          options.numberScaleValues);
    };
  }
  };
}(Sitecore.Speak.D3.models));