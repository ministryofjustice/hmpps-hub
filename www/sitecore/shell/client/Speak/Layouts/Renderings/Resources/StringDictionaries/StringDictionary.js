define(["sitecore"], function (Sitecore) {
  "use strict";

  var model = Sitecore.Definitions.Models.ComponentModel.extend(
  {
      initialize: function () {
      },
      translate: function (phrase) {
        var value = this.get(phrase);
        return value ? value : phrase;
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
          Sitecore.Resources.Dictionary = Sitecore.Resources.Dictionary || {};
          Sitecore.Resources.Dictionary.translate = function (phrase) {
            return Sitecore.Resources.Dictionary[phrase] || phrase;
          };
          var model = this.model;
          _.each(_.pairs(values), function (value) {
            model.set(value[0], value[1]);
            Sitecore.Resources.Dictionary[value[0]] = value[1];
          });
        }
      },    
    }    
  );

Sitecore.Factories.createComponent("StringDictionary", model, view, "script[type='text/x-sitecore-string']");
});