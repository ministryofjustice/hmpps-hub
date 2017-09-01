/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {

  var model = _sc.Definitions.Models.ButtonBaseModel.extend({
    initialize: function () {
      this._super();
    },
  });

  var view = _sc.Definitions.Views.ButtonBaseView.extend({
    initialize: function () {
      this._super();
      _sc.on("resetNavigation", this.resetNavigation);
    },

    resetNavigation: function () {
      var wrapper = $(".sc-navigation-wrapper");
      if (wrapper && !wrapper.hasClass("active")) {
        wrapper.addClass("active");
      }
    },
        
    togglePanel: function () {
      var wrapper = $(".sc-navigation-wrapper");
      if (wrapper) {
        wrapper.toggleClass("active");
      }
    }
  });

  _sc.Factories.createComponent("NavigationPanelToggleButton", model, view, ".sc-navigationPanelToggleButton");

});

