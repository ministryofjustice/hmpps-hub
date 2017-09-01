define(["sitecore", "/-/speak/v1/Ribbon/GalleryUtil.js"], function (Sitecore, GalleryUtil) {
  Sitecore.Factories.createBaseComponent({
    name: "SelectVersionOption",
    base: "ButtonBase",
    selector: ".sc-gallery-versionoption",
    attributes: [
      { name: "version", value: "$el.data:sc-version" },
      { name: "active", value: "$el.data:sc-active" }
    ],
    initialize: function () {
      this._super();
      GalleryUtil.scrollToActive(this);
    }
  });
});