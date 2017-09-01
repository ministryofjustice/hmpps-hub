/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "Expander",
    base: "BlockBase",
    selector: ".sc-expander",
    attributes: [
        { name: "isOpen", defaultValue: true, value: "$el.data:sc-isopen" }
    ],
        
    toogle: function () {
      this.model.set("isOpen", !this.model.get("isOpen"));
    },
    
    changeExpand: function () {
      this.model.get("isOpen") ?
        this.$el.find(".sc-expander-body").slideDown(100) :
        this.$el.find(".sc-expander-body").slideUp(100);
    },
        
    initialize: function () {
      !this.model.get("isOpen") ? this.changeExpand() : $.noop();
      this.model.on("change:isOpen", function () {
        this.changeExpand();
      }, this);
    }
      
      
  });
});