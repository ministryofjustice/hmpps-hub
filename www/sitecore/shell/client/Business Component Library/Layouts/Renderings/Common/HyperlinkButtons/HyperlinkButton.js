require.config({
  paths: {
    hyperlinkButtonBase: "/-/speak/v1/business/hyperlinkbuttonbase"
  }
});

define(["sitecore", "hyperlinkButtonBase"], function (_sc, base) {
  _sc.Factories.createBaseComponent({
    name: "HyperlinkButton",
    base: "HyperlinkButtonBase",
    selector: ".sc-hyperlinkbutton",
    
    attributes: base.model.prototype._scAttrs.concat([]),

    initialize: function () {
      this._super();
    }
  });
});