require.config({
  paths: {
    hyperlinkButtonBase: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Common/HyperlinkButtons/HyperlinkButtonBase"
  }
});

var arLoadComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arLoadComponents = ["sitecore", "hyperlinkButtonBase"];
else // launching of the code-coverage estemating
  arLoadComponents = ["sitecore"];

define(arLoadComponents, function (_sc, base) {

  _sc.Factories.createBaseComponent({
    name: "WrappingLink",
    base: "HyperlinkButtonBase",
    selector: ".sc-WrappingLink",

    attributes: base ? base.model.prototype._scAttrs.concat([]) : [],    

    initialize: function () {
      this._super();
    }
  });
});