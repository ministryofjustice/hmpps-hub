define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "Text",
    base:"ControlBase",
    selector: ".sc-text",
    attributes: [
      { name: "text", value: "$el.text" },
      { name: "isVisible", defaultValue: true }
    ]
  });
});