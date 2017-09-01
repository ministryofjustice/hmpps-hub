define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "Separator",
    base:"ControlBase",
    selector: ".sc-separator",
    attributes: [
      { name: "isVisible", defaultValue: true }
    ]
  });
});