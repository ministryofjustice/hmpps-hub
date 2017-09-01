define(["sitecore"], function (_sc) {

  var hyperlinkBase = _sc.Factories.createBaseComponent({
    name: "HyperlinkButtonBase",
    base: "ButtonBase",
    selector: ".sc-hyperlinkbuttonbase",
    
    attributes: [
      { name: "text", value: "$el.text" },
      { name: "navigateUrl", value: "$el.attr:href" },
      { name: "isEnabled", defaultValue: true },
      { name: "isButtonMode", value: "$el.data:sc-isbuttonmode", defaultValue: false },
      { name: "clickScript", value: "$el.data:sc-click" }
    ],
    
    events: {
      "click": "preventIfDisable"
    },
    
    initialize: function () {
      this.model.on("change:navigateUrl", this.updateClickAttributes, this);
    },
    
    preventIfDisable: function (e) {
      if (e && !this.model.get("isEnabled")) {
        e.preventDefault();
      }
    },
    
    updateClickAttributes: function () {
      this.$el.attr("href", this.model.get("navigateUrl"));      
    }
  });

  return hyperlinkBase;
});