require.config({
  paths: {
    hyperlinkButtonBase: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Common/HyperlinkButtons/HyperlinkButtonBase"
  }
});

define(["sitecore", "hyperlinkButtonBase"], function (_sc, base) {
  _sc.Factories.createBaseComponent({
    name: "IconHyperlinkButton",
    base: "HyperlinkButtonBase",
    selector: ".sc-iconhyperlinkbutton",
    
    attributes: base.model.prototype._scAttrs.concat([
      { name: "imageUrl",  defaultValue:"" },
      { name: "backgroundPosition", defaultValue: "center" }
    ]),
    
    initialize: function () {
      this._super();
      this.model.set("imageUrl", this.$el.find(".sc-icon").attr("data-sc-imageUrl"));
      this.model.set("backgroundPosition", this.$el.find(".sc-icon").attr("data-sc-backgroundPosition"));
    }
  });
});