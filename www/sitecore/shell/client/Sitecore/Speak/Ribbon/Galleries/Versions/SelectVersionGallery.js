define(["sitecore", "/-/speak/v1/Ribbon/GalleryUtil.js"], function (Sitecore, GalleryUtil) {
  Sitecore.Factories.createBaseComponent({
    name: "SelectVersionGallery",
    base: "ControlBase",
    selector: ".sc-versions-gallery",
    attributes: [
      { name: "selectVersionCommand", value: "$el.data:sc-selectversioncommand" }
    ],
    initialize: function () {
      this._super();
      var that = this;
      this.app.on("selectversionoption:click", function (event) {
        var command = that.model.get("selectVersionCommand");
        if (!command || command == '') {
          return;
        }

        var version = $(event.sender.el).data("sc-version");
        if (!version || version == '') {
          return;
        }

        GalleryUtil.executeCommand(command, version);
      }, this);
    }
  });
});