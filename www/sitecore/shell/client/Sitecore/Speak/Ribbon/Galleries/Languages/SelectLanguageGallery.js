define(["sitecore", "/-/speak/v1/Ribbon/GalleryUtil.js"], function (Sitecore, GalleryUtil) {
  Sitecore.Factories.createBaseComponent({
    name: "SelectLanguageGallery",
    base: "ControlBase",
    selector: ".sc-language-gallery",
    attributes: [
      { name: "changeLanguageCommand", value: "$el.data:sc-changelanguagecommand" }
    ],
    initialize: function () {
      this._super();
      var that = this;
      this.app.on("selectlanguageoption:click", function(event) {
        var command = that.model.get("changeLanguageCommand");
        if (!command || command == '') {
          return;
        }

        var argument = $(event.sender.el).data("sc-argument");
        if (!argument || argument == '') {
          return;
        }

        GalleryUtil.executeCommand(command, argument);
      }, this);
    }
  });
});