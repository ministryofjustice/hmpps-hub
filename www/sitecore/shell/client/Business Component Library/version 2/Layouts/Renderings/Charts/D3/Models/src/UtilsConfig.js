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
