define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "Ribbon",
    base: "ControlBase",
    selector: ".sc-ribbon",
    attributes: [],

    initialize: function () {
      this._super();
    }
  });
});