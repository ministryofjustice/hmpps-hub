/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "Button",
    base: "ButtonBase",
    selector: ".sc-button",
    attributes: [
    { name: "text", value: "$el.text" },
    { name: "backgroundPosition", defaultValue: "center" },
    { name: "isOpen", defaultValue: false }
    ],

    initialize: function () {
      this._super();         
      this.model.set("text", this.$el.find(".sc-button-text").text());
      this.model.set("imageUrl", window.encodeURI(this.$el.find(".sc-icon").attr("data-sc-imageUrl")));
      this.model.set("backgroundPosition", this.$el.find(".sc-icon").attr("data-sc-backgroundPosition"));
    }
    
  });
});
