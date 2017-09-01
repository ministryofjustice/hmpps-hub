define(["sitecore"], function(Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "InsertOptions",
    base: "ControlBase",
    selector: ".sc-insert-items",
    attributes: [
      { name: "selectedItemId", value: "" },
      { name: "selectedDisplayName", value: "" }
    ],
    initialize: function() {
    }
  });
});