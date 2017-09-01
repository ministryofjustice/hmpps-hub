/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ToggleButton",
    base: "ButtonBase",
    selector: ".sc-togglebutton",
    attributes: [
    { name: "text", value: "$el.text" },
    { name: "backgroundPosition", defaultValue: "center" },
    { name: "isOpen", value: "$el.data:sc-isopen" }
    ],
    extendModel: {
        toggle: function () {
            this.set("isOpen", !this.get("isOpen"));
            this.viewModel.click();
        }
    },
    listen: _.extend({}, _sc.Definitions.Views.BlockView.prototype.listen, {
        "open:$this": "open",
        "close:$this": "close",
        "toggle:$this": "toogle"
    }),
    initialize: function () {
      this._super();         
      this.model.set("text", this.$el.find(".sc-togglebutton-text").text());
      this.model.set("imageUrl", this.$el.find(".sc-icon").attr("data-sc-imageUrl"));
      this.model.set("backgroundPosition", this.$el.find(".sc-icon").attr("data-sc-backgroundPosition"));

     },
     toogle: function () {
         this.model.set("isOpen", !this.model.get("isOpen"));
     },
     open: function () {
         this.model.set("isOpen", true);
     },
     close: function (e) {
         if (e && e.target) {
             e.preventDefault();
         }
         this.model.set("isOpen", false);
     }
  });
});
