define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "SilverlightFrame",
    base: "ControlBase",
    selector: ".sc-silverlightframe",
    attributes: [
    ],
    initialize: function () {
      this._super();
    }
  });
});