define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "Label",
    base:"ControlBase",
    selector: ".sc-label",
    attributes: [
      { name: "text", value: "$el.text" },
      { name: "isVisible", defaultValue: true }
    ]
  });
});