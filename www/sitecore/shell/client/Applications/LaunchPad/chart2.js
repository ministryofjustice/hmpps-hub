define(["sitecore"], function (Sitecore) {
  var Chart2PageCode = Sitecore.Definitions.App.extend({
    initialized: function () {
      Sitecore.trigger("chart:loaded", this);
    }
  });

  return Chart2PageCode;
});