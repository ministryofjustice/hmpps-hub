define(["sitecore", "/-/speak/v1/Ribbon/GalleryUtil.js"], function (Sitecore, GalleryUtil) {
  Sitecore.Factories.createBaseComponent({
    name: "GalleryOption",
    base: "ButtonBase",
    selector: ".sc-gallery-option",
    attributes: [
      { name: "argument", value: "$el.data:sc-argument" },
      { name: "active", value: "$el.data:sc-active" }
    ],
    initialize: function () {
      this._super();
      GalleryUtil.scrollToActive(this);
    }
  });
});