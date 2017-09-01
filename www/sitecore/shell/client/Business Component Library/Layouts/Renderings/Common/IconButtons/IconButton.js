/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {

  var model = _sc.Definitions.Models.ButtonBaseModel.extend({
    initialize: function () {
      this._super();

      this.set("imageUrl", "");
      this.set("backgroundPosition", "center");
      this.set("title", "");
    },
    changeImageUrl: function () {
        this.set("imageUrl", this._createImagePath(this.get("imageUrl")));
    },

    _createImagePath: function (path) {
      var newPath = path.toLowerCase();
      if (!(newPath.indexOf("/temp/") >= 0 ||
        newPath.indexOf("/~/icon/") >= 0 ||
        newPath.indexOf("http://") === 0 ||
        newPath.indexOf("https://") === 0 ||
        newPath.indexOf(_sc.SiteInfo.virtualFolder) === 0)) {
        newPath = _sc.SiteInfo.virtualFolder + "~/icon/" + newPath;
      }

      return newPath;
    }
  });

  var view = _sc.Definitions.Views.ButtonBaseView.extend({
    initialize: function () {
      this._super();

      this.model.set("imageUrl", this.$el.find(".sc-icon-button-image").attr("data-sc-imageUrl"));
      this.model.set("backgroundPosition", this.$el.find(".sc-icon-button-image").attr("data-sc-backgroundPosition"));
      this.model.on("change:imageUrl", this.model.changeImageUrl, this.model);
      this.model.on("change:isEnabled", this.toggleEnable, this);
    },
    toggleEnable: function () {
        if (!this.model.get("isEnabled")) {
            this.$el.attr("disabled", "disabled");
        } else {
            this.$el.removeAttr("disabled");
        }
    }
  });

  _sc.Factories.createComponent("IconButton", model, view, ".sc-icon-button");

});

