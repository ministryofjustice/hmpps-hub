/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "BackButton",
    base: "ButtonBase",
    selector: ".sc-backbutton",
    attributes: [
    { name: "text", value: "$el.text" }
    ],

    initialize: function () {
      this._super();         
      this.model.set("text", this.$el.find(".sc-backbutton-text").text());      
    }
    
  });
});
