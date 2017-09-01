define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Factories.createBaseComponent({
    name: "LargeGalleryButton",
    base: "ButtonBase",
    selector: ".sc-chunk-gallerybutton",
    attributes: [
        { name: "command", value: "$el.data:sc-command" },
        { name: "GalleryWidth", value: "$el.data:sc-gallerywidth" },
        { name: "GalleryHeight", value: "$el.data:sc-galleryheight" },
        { name: "GalleryUrl", value: "$el.data:sc-galleryurl" }
    ],
    initialize: function () {
      this._super();

      this.model.set("galleryUrlQueryString", "");

      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change:isVisible", this.toggleVisible, this);
      this.model.on("click", this.onClick, this);
    },
    toggleEnable: function () {
      if (!this.model.get("isEnabled")) {
        this.$el.addClass("disabled");
      } else {
        this.$el.removeClass("disabled");
      }
    },
    toggleVisible: function () {
      if (!this.model.get("isVisible")) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
    },
    onClick: function () {
      var galleryUrl = this.formGalleryUrl();
      if (galleryUrl == '') {
        return;
      }

      var galleryHeight = this.model.get("GalleryHeight") + "px";
      var galleryWidth = this.model.get("GalleryWidth") + "px";
      var dimensions = {
        width: galleryWidth,
        height: galleryHeight
      };

      var sourceNode = $("[data-sc-id='" + this.$el.attr("data-sc-id") + "']")[0];
      if (!sourceNode) {
        return;
      }

      ExperienceEditor.Common.showGallery(galleryUrl, sourceNode, dimensions);
    },

    formGalleryUrl: function() {
      var initialUrl = decodeURI(this.model.get("GalleryUrl"));
      if (!initialUrl && initialUrl == "") {
        ExperienceEditor.Dialogs.alert("The 'GalleryUrl' property of LargeGalleryButton is invalid");
        return '';
      }

      var galleryQueryString = this.model.get("galleryUrlQueryString");
      if (!galleryQueryString && galleryQueryString == "") {
        return initialUrl;
      }

      var initialUrlQueryStringIndex = initialUrl.indexOf("?");
      if (initialUrlQueryStringIndex != -1) {
        initialUrl = initialUrl.substring(0, initialUrlQueryStringIndex);
      }

      if (galleryQueryString.indexOf("?") != 0) {
        galleryQueryString = "?" + galleryQueryString;
      }

      return initialUrl + galleryQueryString;
    }
  });
});