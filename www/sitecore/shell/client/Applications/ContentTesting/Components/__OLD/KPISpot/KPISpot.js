define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("value", null);
      this.set("text", "");
      this.set("percentage", false);
      this.set("indicatechanges", false);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      //this._super();

      this.model.set("value", parseFloat(this.$el.attr("data-sc-value") || 0));
      this.model.set("text", this.$el.attr("data-sc-text") || "");
      this.model.set("percentage", (this.$el.attr("data-sc-percentage") || "").toLowerCase() === "true");
      this.model.set("indicatechanges", (this.$el.attr("data-sc-indicate-changes") || "").toLowerCase() === "true");

      this.model.on("change:indicatechanges change:value", this.render, this);

      this.render();
    },

    // testing options for unit-tests
    setTestingOptions: function (options) {
      this.$el = options.$el;
      this.model = options.model;
    },

    render: function () {
      var indicateChanges = this.model.get("indicatechanges");
      if (indicateChanges) {
        var container = this.$el.find(".spot");

        container.removeClass("value-increase");
        container.removeClass("value-decrease");
        container.removeClass("value-nochange");

        var value = this.model.get("value");
        if (value > 0) {
          container.addClass("value-increase");
        }
        else if (value < 0) {
          container.addClass("value-decrease");
        }
        else {
          container.addClass("value-nochange");
        }
      }
    }
  });

  Sitecore.Factories.createComponent("KPISpot", model, view, ".sc-KPISpot");
});
