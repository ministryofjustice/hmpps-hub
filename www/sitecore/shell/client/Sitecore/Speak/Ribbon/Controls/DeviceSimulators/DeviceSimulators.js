define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "DeviceSimulators",
    base: "ControlBase",
    selector: ".sc-deviceSimulators",
    attributes: [
      { name: "selectedItemId", value: "" },
      { name: "selectedDisplayName", value: "" }
    ],
    initialize: function () {

    }
  });
});