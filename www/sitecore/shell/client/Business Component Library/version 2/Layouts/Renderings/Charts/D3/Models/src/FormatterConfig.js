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