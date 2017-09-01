define(["sitecore"], function (sitecore) {
  "use strict";
  var model = sitecore.Definitions.Models.ComponentModel.extend({
    initialize: function () {
      this._super();

      this.set("isAnalyticsEnabled", true);
    },
  });

  var view = sitecore.Definitions.Views.ComponentView.extend({
    initialize: function () {
      this._super();
      var isAnalyticsDisabled = this.$el.attr("data-sc-isanalyticsenabled") === "false";
      this.model.set("isAnalyticsEnabled", !isAnalyticsDisabled);
    },
  });

  return sitecore.Factories.createComponent("AnalyticsChecker", model, view, ".sc-AnalyticsChecker");
});
