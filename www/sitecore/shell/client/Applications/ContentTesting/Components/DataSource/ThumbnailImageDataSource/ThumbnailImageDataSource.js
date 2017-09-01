var requestUtilPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
    requestUtilPath = "/-/speak/v1/contenttesting/RequestUtil.js";
}
else { // launching of the code-coverage estemating
    require.config({
        paths: {
            requestUtilPath: contentTestingDir + "/Common/lib/RequestUtil"
        },
    });
    requestUtilPath = "requestUtilPath";
}

define([
    "sitecore",
    requestUtilPath],
  function (Sitecore, requestUtil) {

      var model = Sitecore.Definitions.Models.ControlModel.extend({
          initialize: function (options) {
              this._super();

              this.set({
                  isBusy: false,
                  invalidated: false,
                  items: [],
                  imageThumbs: null,
                  beforeImageSrc: "",
                  beforeImageUnscaledSrc: "",
                  afterImageSrc: "",
                  afterImageUnscaledSrc: "",
                  beforeTooltipInfo: "",
                  afterTooltipInfo: "",
                  startGetThumbnailUrl: "",
                  tryFinishGetThumbnailUrl: "",
                  thumbnailWidth: 0,
                  thumbnailHeight: 0
              });

              this.on("change:items", this.refresh, this);
          },

          refresh: function () {
              if (this.get("isBusy")) {
                  this.set("invalidated", true);
                  return;
              }

              this.set("isBusy", true);

              var items = this.get("items");
              var self = this;

              if (items.length >= 2) {
                  var startUrl = this.get("startGetThumbnailUrl");
                  var endUrl = this.get("tryFinishGetThumbnailUrl");

                  var finishCallback = function () {
                      self.set("isBusy", false);
                  };

                  if (startUrl && endUrl) {
                      this.populateImages(items, startUrl, endUrl, finishCallback);
                  }
              } else {
                  this.set("isBusy", false);
              }
          },

          getImageType: function (id) {
              var items = this.get("items");
              return (id === items[0].uId ? "after" : "before");
          },

          getBeforeAfterTooltipInfo: function () {
              var self = this;
              var beforeAfterInfo = {};
              var items = this.get("items");
              if (items) {
                  _.each(items, function (item) {
                      var imageThumbs = self.get("imageThumbs");
                      if (imageThumbs) {
                          var content = imageThumbs.getTooltipContent(item);
                          var imgType = self.getImageType(item.uId);
                          if (imgType === "after") {
                              beforeAfterInfo.after = content;
                          }
                          else if (imgType === "before") {
                              beforeAfterInfo.before = content;
                          }
                      }
                  });
              }

              return beforeAfterInfo;
          },

          populateImages: function (items, startGetUrl, endGetUrl, finishCallback) {
              var self = this;
              var width = this.get("thumbnailWidth");
              var height = this.get("thumbnailHeight");

              var data = _.map(items, function (item) {
                  var attrs = item.attrs || {};

                  return {
                      id: attrs.id,
                      version: attrs.version,
                      language: attrs.language,
                      mvvariants: attrs.mvvariants,
                      combination: attrs.combination,
                      rules: attrs.rules,
                      compareVersion: attrs.compareVersion,
                      revision: attrs.revision,
                      uid: item.uId,
                      width: width || 0,
                      height: height || 0
                  };
              });

              var ajaxOptions = {
                  cache: false,
                  url: startGetUrl,
                  type: "POST",
                  data: "=" + JSON.stringify(data),
                  context: this,
                  success: function (data) {
                      if (this.get("invalidated")) {
                          this.set("invalidated", false);
                          this.refresh();
                      }

                      if (data) {
                          if (data.urls) {
                              _.each(data.urls, function (t) {
                                  self._setImage(t.uid, t.url, t.unscaledUrl);
                              });
                          }
                          if (data.handle) {
                              self._tryFinishPopulateImages({
                                  endGetUrl: endGetUrl,
                                  handle: data.handle,
                                  finishCallback: finishCallback
                              });
                          }
                          else if (finishCallback) {
                              finishCallback();
                          }
                      }
                  },
                  error: function (req, status, error) {
                      console.log("ThumbnailImageDataSource ajax call failed");
                      console.log(status);
                      console.log(error);
                      console.log(req);
                  }
              };

              requestUtil.performRequest(ajaxOptions);
          },

          _tryFinishPopulateImages: function (params) {
              var self = this;

              var ajaxOptions = {
                  cache: false,
                  url: params.endGetUrl + "?handle=" + params.handle,
                  type: "GET",
                  context: this,
                  success: function (data) {
                      if (data) {
                          if (data.urls) {
                              _.each(data.urls, function (t) {
                                  self._setImage(t.uid, t.url, t.unscaledUrl);
                              });
                          }
                          if (data.IsDone) {
                              if (params.finishCallback) {
                                  params.finishCallback();
                              }
                          }
                          else {
                              setTimeout(function () {
                                  self._tryFinishPopulateImages(params, {
                                      endGetUrl: params.endGetUrl,
                                      handle: params.handle,
                                      finishCallback: params.finishCallback
                                  });
                              }, 1500);
                          }
                      }
                  },
                  error: function (req, status, error) {
                      console.log("ThumbnailImageDataSource ajax call failed");
                      console.log(status);
                      console.log(error);
                      console.log(req);
                  }
              };

              requestUtil.performRequest(ajaxOptions);
          },

          _setImage: function (uid, url, unscaledUrl) {
              var imgType = this.getImageType(uid);
              if (imgType === "after") {
                  this.set("afterImageUnscaledSrc", unscaledUrl);
                  this.set("afterImageSrc", url);
              } else if (imgType === "before") {
                  this.set("beforeImageUnscaledSrc", unscaledUrl);
                  this.set("beforeImageSrc", url);
              }
          },

      });

      var view = Sitecore.Definitions.Views.ControlView.extend({
          initialize: function (options) {
              this.model.set({
                  items: this.$el.attr("data-sc-items") || [],
                  startGetThumbnailUrl: this.$el.attr("data-sc-startgetthumbnailurl") || [],
                  tryFinishGetThumbnailUrl: this.$el.attr("data-sc-tryfinishgetthumbnailurl") || [],
                  thumbnailWidth: this.$el.attr("data-sc-thumbnailwidth") || 0,
                  thumbnailHeight: this.$el.attr("data-sc-thumbnailheight") || 0
              });

              this.model.refresh();
          }
      });

      Sitecore.Factories.createComponent("ThumbnailImageDataSource", model, view, ".sc-ThumbnailImageDataSource");
  });
