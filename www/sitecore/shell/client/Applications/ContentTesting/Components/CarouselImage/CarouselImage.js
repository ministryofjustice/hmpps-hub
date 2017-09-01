var modernizrPath;
var jqueryppPath;
var elastislidePath;
var imageThumbsPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
    modernizrPath = jqueryppPath = elastislidePath = "/-/speak/v1/assets/";
    imageThumbsPath = "/-/speak/v1/contenttesting/";
}
else { // launching of the code-coverage estemating
    modernizrPath = clientDir + "/Speak/Assets/lib/ui/1.1/deps/modernizr/";
    jqueryppPath = clientDir + "/Speak/Assets/lib/ui/1.1/deps/jquerypp/";
    elastislidePath = clientDir + "/Speak/Assets/lib/ui/1.1/deps/elastislide/";
    imageThumbsPath = contentTestingDir + "/Common/lib/";
}

/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
require.config({
    paths: {
        modernizr: modernizrPath + "modernizr.custom.17475",
        jquerypp: jqueryppPath + "jquerypp.custom",
        elastislide: elastislidePath + "jquery.elastislide",
        imageThumbs: imageThumbsPath + "Imagethumbs"
    },
    shim: {
        'jquerypp': { deps: ['jquery'] },
        'elastislide': { deps: ['jquerypp'] },
    }
});

define([
  "sitecore",
  "imageThumbs",
  "modernizr",
  "jquerypp",
  "elastislide"
], function (_sc, thumbs) {

    // model
    var model = _sc.Definitions.Models.ControlModel.extend(
      {
          initialize: function (options) {
              this._super();

              this.set({
                  startGetThumbnailUrl: "/sitecore/shell/api/ct/TestThumbnails/StartGetThumbnails",
                  tryFinishGetThumbnailUrl: "/sitecore/shell/api/ct/TestThumbnails/TryFinishGetThumbnails",
                  items: [],
                  selectedTestId: null,
                  isBusy: false,
                  imageThumbs: null,
                  imageDescriptionHandler: null
              });
          }
      });

    // view
    var view = _sc.Definitions.Views.ControlView.extend(
    {
        // selected image
        selectedImg: null,
        slider: null,

        initialize: function (options) {
            //this._super();

            if (this.$el.attr("data-sc-startgetthumbnailurl")) {
                this.model.set("startGetThumbnailUrl", this.$el.attr("data-sc-startgetthumbnailurl"));
            }

            if (this.$el.attr("data-sc-tryfinishgetthumbnailurl")) {
                this.model.set("tryFinishGetThumbnailUrl", this.$el.attr("data-sc-tryfinishgetthumbnailurl"));
            }

            this.model.set("selectedTestId", this.$el.attr("data-sc-selectedtestid") || "");

            this.model.on("change:items change:selectedTestId", this.populateCarousel, this);

            if (this.app && this.app.ZoomFrame) {
                this.$el.find(".imgBig").click(this, this.imgBigClickHandler);
            }
        },

        imgBigClickHandler: function (event) {

            var self = event.data;

            var imageThumbs = self.model.get("imageThumbs");

            if (imageThumbs) {
                var thumbId = $(event.currentTarget).attr("data-uid");
                var item = _.find(self.model.get("items"), function (element) {
                    return element.uId === thumbId;
                });

                if (item) {
                    var startUrl = self.model.get("startGetThumbnailUrl");
                    var endUrl = self.model.get("tryFinishGetThumbnailUrl");

                    var itemCallback = function(id, el, url) {
                        self.app.ZoomFrame.set("imageUrl", url);
                    };

                    var finishCallback = function () {
                        if (self.app.ZoomFrame.get("isVisible"))
                            self.app.ZoomFrame.set("isVisible", false);
                        self.app.ZoomFrame.set("isVisible", true);
                    };

                    imageThumbs.populateImages([item], null, startUrl, endUrl, itemCallback, finishCallback);
                }
            }
        },

        // testing options for unit-tests
        setTestingOptions: function (options) {
            this.$el = options.$el;
            this.model = options.model;
        },

        populateCarousel: function () {

            // No point in populating if not visible. The slider will not be able to calculate it's width and won't show anyway.
            if (!this.$el.is(":visible")) {
                return;
            }

            var items = this.model.get("items");
            if (typeof items === 'undefined' || items.length === 0)
                return;

            this.model.set("isBusy", true);

            var self = this;

            // options for elastslide
            var options = {
                minimumTiles: 3,
                tileWidth: 170,
                tileHeight: 150,
                orientation: "horizontal",
                tilePadding: 5,
                onClick: this.carouselClicked(this)
            };

            var listContainer = this.$el.find(".elastislide-list").first();

            // Calculate delta between model and rendered view.
            var modelIds = _.map(items, function (item) {
                return self.generateEntryId(item);
            });

            //#25904 - fixing empty slider-tiles after filtering
            listContainer.empty();

            var imgIds = _.map(listContainer.find("img"), function (img) {
                return $(img).attr("data-entry-id");
            });

            var deltaModelIds = _.difference(modelIds, imgIds);
            var deltaImgIds = _.difference(imgIds, modelIds);

            // Remove items not in the model
            _.each(deltaImgIds, function (id) {
                var item = listContainer.find("[data-entry-id='" + id + "']");
                if (item) {
                    item.closest("li").remove();
                    if (self.slider !== null) {
                        self.slider.add();
                    }
                }
            });

            var tileTemplate = _.template($("#liItem").html());
            var testId = this.model.get("selectedTestId");
            if (testId) {
                testId = testId.toUpperCase();
                if (testId[0] !== "{")
                    testId = "{" + testId + "}";
            }

            _.each(items, function (item) {
                var attrs = item.attrs;
                var name = item.name;
                var uid = item.uId;

                var entryId = self.generateEntryId(item);

                // Filter by test Id
                if (testId && attrs.testId.toUpperCase() !== testId) {
                    var imgElem = listContainer.find("[id='" + "img_" + uid + "']");
                    if (imgElem) {
                        imgElem.parents("li").remove();
                    }
                    return;
                }

                var displayName = name;

                // Add to holder
                if (name.indexOf(",") !== -1 && name.length > 25) {
                    displayName = name.substring(0, name.indexOf(",")) + " ...";
                }

                // Add if the entry doesn't exist yet, otherwise update (name will change as test item entries change)
                if (_.contains(deltaModelIds, entryId)) {
                    listContainer.append(tileTemplate({
                        id: "img_" + uid,
                        name: displayName,
                        imgSrc: item.src,
                        entryid: entryId
                    }));

                    if (self.slider !== null) {
                        self.slider.add();
                    }
                } else {
                    // update existing entry
                    var entryName = listContainer.find("[data-entry-id='" + entryId + "']").siblings("span");
                    if (entryName) {
                        entryName.text(displayName);
                    }
                }
            });

            if (this.slider === null) {
                this.slider = listContainer.elastislide(options);
            }

            // select the first item
            var firstImage = listContainer.find("img").first();
            if (firstImage) {
                firstImage.click();
                this.selectedImg = firstImage;
            }

            // populate the images
            var startUrl = this.model.get("startGetThumbnailUrl");
            var endUrl = this.model.get("tryFinishGetThumbnailUrl");
            var imageThumbs = this.model.get("imageThumbs");

            if (imageThumbs) {
                var locator = function (id) {
                    return $("[id = 'img_" + id + "']");
                };

                var itemCallback = function (id, el) {
                    el.load(function () {
                        el.removeClass("img-loading");
                    });

                    el.attr("data-uid", id);

                    if (self.selectedImg && self.selectedImg.attr("id") === "img_" + id) {
                        self.selectedImg.click();
                    }
                };

                var finishCallback = function () {
                    self.model.set("isBusy", false);
                };

                // Request thumbnails in size for focus panel
                var panel = self.$el.find(".imgBig").parent();
                imageThumbs.populateImages(items, locator, startUrl, endUrl, itemCallback, finishCallback, panel.width(), panel.height());
            }

        },

        generateEntryId: function (item) {
            if (item.attrs) {
                var revision = item.attrs.revision;
                if (revision == undefined) {
                    revision = item.attrs.id;
                }
                return item.attrs.testId + item.attrs.version + revision + item.attrs.combination;
            }
            else
                return "";
        },

        // click-handler
        carouselClicked: function (ctx) {
            var self = this;
            return function (element, position, evt) {
                if (evt && evt.target) {
                    evt.preventDefault();

                    var bigImage = self.$el.find(".imgBig");
                    bigImage.addClass("img-loading");

                    var img = element.find("img");

                    bigImage.attr("src", img[0].src).load(function () {
                        bigImage.removeClass("img-loading");
                    });

                    bigImage.attr("data-uid", img.attr("data-uid"));

                    // selecting image in Carousel
                    if (self.selectedImg) {
                        self.selectedImg.removeClass("imgSelected");
                    }

                    img.addClass("imgSelected");
                    self.selectedImg = img;

                    _.each(self.model.get("items"), function (item) {
                        var nameItem = self.selectedImg.attr("id").replace("img_", "");
                        // showing data in info panel 
                        if (nameItem === item.uId) {
                            if (self.model.get("imageDescriptionHandler")) {
                                self.model.get("imageDescriptionHandler")(item, self.$el.find("#dvInformation").first());
                            }
                            else {
                                var imageThumbs = self.model.get("imageThumbs");
                                if (imageThumbs) {
                                    self.$el.find("#dvInformation").first().html(imageThumbs.getVariationInfo(item, true));
                                }

                            }
                        }
                    });
                }
            };
        }

    });

    // create component
    _sc.Factories.createComponent("CarouselImage", model, view, ".sc-carouselimage");

});
