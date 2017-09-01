var imageThumbsPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  imageThumbsPath = "/-/speak/v1/contenttesting/ImageThumbs.js";
}
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      imageThumbsPath: contentTestingDir + "/Common/lib/ImageThumbs"
    },
  });
  imageThumbsPath = "imageThumbsPath";
}

define(["sitecore", imageThumbsPath], function (_sc, thumbs) {

  // model
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      initialize: function (options) {
        this._super();

        this.set({
          startGetThumbnailUrl: "/sitecore/shell/api/ct/TestThumbnails/StartGetThumbnails",
          tryFinishGetThumbnailUrl: "/sitecore/shell/api/ct/TestThumbnails/TryFinishGetThumbnails",
          items: [],
          isBusy: false,
          imageThumbs: null
        });
      }
    });

  // view
  var view = _sc.Definitions.Views.ControlView.extend(
  {
    busyCounter: 0,

    initialize: function (options) {
      if (this.$el.attr("data-sc-startgetthumbnailurl")) {
        this.model.set("startGetThumbnailUrl", this.$el.attr("data-sc-startgetthumbnailurl"));
      }

      if (this.$el.attr("data-sc-tryfinishgetthumbnailurl")) {
        this.model.set("tryFinishGetThumbnailUrl", this.$el.attr("data-sc-tryfinishgetthumbnailurl"));
      }

      var isTestingUnit = false;
      if (options && options.isTestingUnit)
        isTestingUnit = options.isTestingUnit;

      if (!isTestingUnit)
        this._super();


      if (this.app && this.app.ZoomFrame) {
        $("#imgBefore").click(this, this.imgClickHandler);
        $("#imgAfter").click(this, this.imgClickHandler);
      }

      this.model.on("change:items", this.redraw, this);
    },

    imgClickHandler: function (event) {
      var self = event.data;
      var imageUrl = $(event.currentTarget).attr("src");

      self.app.ZoomFrame.set("imageUrl", imageUrl);
      if (self.app.ZoomFrame.get("isVisible"))
        self.app.ZoomFrame.set("isVisible", false);
      self.app.ZoomFrame.set("isVisible", true);
    },

    // testing options for unit-tests
    setTestingOptions: function (options) {
      this.$el = options.$el;
      this.model = options.model;
    },

    redraw: function () {
      this.model.set("isBusy", true);

      var items = this.model.get("items");
      var self = this;

      if (items.length >= 2) {
        var startUrl = this.model.get("startGetThumbnailUrl");
        var endUrl = this.model.get("tryFinishGetThumbnailUrl");
        var imageThumbs = this.model.get("imageThumbs");

        if (imageThumbs) {
          var locator = function(id){
            var elId = id == items[0].uId ? "imgAfter" : "imgBefore";
            return $("[id = '" + elId + "']");
          };

          var itemCallback = function (id, el) {
            el.load(function () {
              el.removeClass("img-loading");
            });
          }
          
          var finishCallback = function () {
            self.model.set("isBusy", false);
          };

          imageThumbs.populateImages(items, locator, startUrl, endUrl, itemCallback, finishCallback);
        }
      }
    }
  });

  // create component
  _sc.Factories.createComponent("CompareImage", model, view, ".dvCompareImage");

});
