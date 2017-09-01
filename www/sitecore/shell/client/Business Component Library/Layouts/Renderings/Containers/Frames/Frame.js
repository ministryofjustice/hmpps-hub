/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {

  var model = _sc.Definitions.Models.BlockModel.extend({
    initialize: function (options) {
      this._super();
      this.set("sourceUrl", "");
      this.set("isDeferred", null);
    }
  });

  var view = _sc.Definitions.Views.BlockView.extend({
    initialize: function () {
      this._super();
      this.model.set("isDeferred", this.$el.data("sc-isdeferred"));

      if (!this.model.get("isDeferred")) {
        this.model.set("sourceUrl", this.$el.attr("src") || "");
      }

      this.model.on("change:sourceUrl", function () {
        this.$el.attr("src", this.model.get("sourceUrl"));
      }, this);

      this.model.on("change:width change:height", function () {
        this.$el.width(this.model.get("width"));
        this.$el.height(this.model.get("height"));
      }, this);
    },
    
    afterRender: function () {
      if (this.model.get("isDeferred")) {
        this.model.set("sourceUrl", this.$el.data("sc-sourceurl") || "");
      }
    }
  });

  _sc.Factories.createComponent("Frame", model, view, ".sc-frame");
});