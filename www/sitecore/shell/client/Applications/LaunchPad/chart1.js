define(["sitecore"], function (Sitecore) {
  var Chart1PageCode = Sitecore.Definitions.App.extend({
    initialized: function () {
      Sitecore.trigger("chart:loaded", this);
    }
  });
  return Chart1PageCode;
});