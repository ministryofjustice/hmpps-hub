define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "Section",
    base: "ControlBase",
    selector: ".sc-Section",
    attributes: [
    { name: "content", value: "$el.html" }
    ]
  });
});