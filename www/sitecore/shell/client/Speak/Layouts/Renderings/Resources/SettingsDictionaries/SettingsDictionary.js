define(["sitecore"], function (Sitecore) {
  "use strict";

  var model = Sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();
      }
    }
  );

  var view = Sitecore.Definitions.Views.ComponentView.extend(
    {
      initialize: function (options) {
        this._super();

        var values;

        if (this.$el.is("[data-sc-values]")) {
          values = $.parseJSON(this.$el.attr("data-sc-values"));
          Sitecore.Resources = Sitecore.Resources || {};
          Sitecore.Resources.Settings = Sitecore.Resources.Settings || {};
          var model = this.model;
          _.each(_.pairs(values), function (value) {
            model.set(value[0], value[1]);
            Sitecore.Resources.Settings[value[0]] = value[1];
          });
        }
      }
    }
  );

  Sitecore.Factories.createComponent("SettingsDictionary", model, view, "script[type='text/x-sitecore-settings']");
});