define(["sitecore"], function (sitecore) {
  var chartPageCode = sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.trigger("chart:loaded", this);
    }
  });

  return chartPageCode;
});