define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.InputModel.extend(
    {
      initialize: function (options)
      {
        this._super();
        
        this.set("text", "");
        this.set("isReadOnly", false);
        this.set("cols", 0);
        this.set("maxLength", 0);
        this.set("rows", 0);
        this.set("wrap", "");
        this.set("isRequired", false);
        this.set("watermark", "");
      }
    });

    var view = _sc.Definitions.Views.InputView.extend(
    {
      initialize: function(options)
      {
        this._super();
        this.model.set("text", this.$el.val());
        this.model.set("isReadOnly", this.$el.attr("readonly") === "readonly");
        this.model.set("cols", this.$el.attr("cols"));
        this.model.set("maxLength", this.$el.attr("maxlength"));
        this.model.set("rows", this.$el.attr("rows"));
        this.model.set("wrap", this.$el.attr("wrap"));
        this.model.set("isRequired", this.$el.attr("required"));
        this.model.set("watermark", this.$el.attr("placeholder"));
      }
    });
    _sc.Factories.createComponent("TextArea", model, view, ".sc-textarea");
});