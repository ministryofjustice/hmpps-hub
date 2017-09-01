define(["sitecore", "/-/speak/v1/business/multiselectcontrolbase.js"], function (_sc, multiSelectControlBaseComponent) {
  _sc.Factories.createBaseComponent({
    name: "ListBox",
    base: "MultiSelectControlBase",
    selector: ".sc-listbox",
    attributes: multiSelectControlBaseComponent.model.prototype._scAttrs,

    initialize: function (options) {
      this._super();
    }
  });
});