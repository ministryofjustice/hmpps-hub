define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      defaults: {
        imageUrl: "",
        alt: "",
        width: 0,
        height: 0,
        isVisible: true
      },

      initialize: function () {
        var self = this;

        this.set("src", "", {
          computed: true,
          read: function () {
            var url = this.imageUrl();

            if (this.width() != 0) {
              url = _sc.Helpers.url.addQueryParameters(url, { w: parseInt(this.width()) });
            }

            if (this.height() != 0) {
              url = _sc.Helpers.url.addQueryParameters(url, { h: parseInt(this.height()) });
            }

            return url;
          }
        });
      }
    });
    var view = _sc.Definitions.Views.ControlView.extend(
    {
      initialize: function (options) {
        this._super();

        if (!this.$el.is("img")) {
          return false;
        }

        this.model.set("imageUrl", $(this.el).attr("data-image-src"));
        this.model.set("alt", $(this.el).attr("alt"));

        var desiredWidth, desiredHeight;

        desiredWidth = $(this.el).attr("data-sc-width");

        //setting the desired width
        if (desiredWidth) {
          $(this.el)[0].style.width = desiredWidth;
        }

        //getting the computed width
        if ($(this.el)[0].style.width) {
          this.model.set("width", $(this.el).width());
        }

        desiredHeight = $(this.el).attr("data-sc-height");
        //setting the desired height
        if (desiredHeight) {
          $(this.el)[0].style.height = desiredHeight;
        }

        //getting the computed height
        if ($(this.el)[0].style.height) {
          this.model.set("height", $(this.el).height());
        }

      }
    });

  _sc.Factories.createComponent("Image", model, view, ".sc-image");
});
