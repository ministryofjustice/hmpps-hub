define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("value", 0);
      this.set("maxValue", 100);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      this.model.set("value", this.$el.attr("data-sc-value") || 0);
      this.model.set("maxValue", this.$el.attr("data-sc-max-value") || 100);

      this.model.on("change:value change:maxValue", this.redraw, this);
    },

    // testing options for unit-tests
    setTestingOptions: function (options) {
      this.$el = options.$el;
      this.model = options.model;
    },

    redraw: function() {
      this.$el.width(((this.model.get("value") / this.model.get("maxValue")) * 100) + "%");
    }
  });

  Sitecore.Factories.createComponent("ValueBar", model, view, ".sc-ValueBar");
});
