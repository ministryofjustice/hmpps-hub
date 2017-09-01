define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.InputModel.extend({
    initialize: function (options) {
      this._super();

      this.set("text", "");
      this.set("value", "");
      this.set("isChecked", false);
    }
  });

  var view = _sc.Definitions.Views.InputView.extend(
    {
      initialize: function (options) {
        this._super();

        var input = $(this.$el.children().get(0));
        var label = $(this.$el.children().get(1));

        this.model.set("text", label.text());
        this.model.set("value", input.val());
        this.model.set("isChecked", input.is(":checked"));
      }
    });

  _sc.Factories.createComponent("CheckBox", model, view, ".sc-checkbox");
});

