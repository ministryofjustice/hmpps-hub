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
      var actionUrl = "/sitecore/shell/api/ct/TestObjectives/GetTestObjectives";

      var model = Sitecore.Definitions.Models.ControlModel.extend({
          initialize: function (options) {
              this._super();

              this.set({
                  isBusy: false,
                  invalidated: false,
                  excludeItems: "",
                  items: [],
                  totalItems: 0,
                  page: 1,
                  pageSize: 5,
                  searchTerm: ""
              });

              this.on("change:searchTerm change:page", this.refresh, this);
          },

          refresh: function () {
              var excludeItems = this.get("excludeItems") || "";
              if (this.changed.searchTerm != undefined) {
                  this.set("page", 1, { silent: true });
              }

              var page = this.get("page");
              var pageSize = this.get("pageSize");
              var searchTerm = this.get("searchTerm");

              var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                  excludeitems: excludeItems
              });

              url = Sitecore.Helpers.url.addQueryParameters(url, {
                  "page": page
              });

              url = Sitecore.Helpers.url.addQueryParameters(url, {
                  "pageSize": pageSize
              });

              url = Sitecore.Helpers.url.addQueryParameters(url, {
                  "query": searchTerm
              });

              if (this.prevUrl === url) {
                  return;
              }

              if (this.get("isBusy")) {
                  this.set("invalidated", true);
                  return;
              }

              this.prevUrl = url;

              this.set({
                  isBusy: true,
                  invalidated: false
              });

              var ajaxOptions = {
                  cache: false,
                  url: url,
                  context: this,
                  success: function (data) {
                      this.set("isBusy", false);
                      if (this.get("invalidated")) {
                          this.refresh();
                      } else {
                          this.set({
                              items: data.items,
                              totalItems: data.totalResults
                          });
                      }
                  }
              };

              requestUtil.performRequest(ajaxOptions);
          }
      });

      var view = Sitecore.Definitions.Views.ControlView.extend({
          initialize: function (options) {
              this._super();

              // stop refreshing while initial settings are read
              this.model.set("isBusy", true);

              this.model.set({
                  excludeItems: this.$el.attr("data-sc-excludeItems") || "",
                  items: this.$el.attr("data-sc-items") || []
              });

              // settings have completed reading. Resume
              this.model.set("isBusy", false);
              this.model.refresh();
          }
      });

      Sitecore.Factories.createComponent("TestObjectivesDataSource", model, view, ".sc-TestObjectivesDataSource");
  });
