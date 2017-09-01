define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
      var baseUrl = "/sitecore/shell/api/ct/Tests";

      var model = Sitecore.Definitions.Models.ComponentModel.extend({
          initialize: function (options) {
              this._super();

              this.set({
                  isBusy: false,
                  invalidated: false,
                  pageSize: 20,
                  page: 1,
                  hostItemId: null,
                  language: null,
                  hasMore: false,
                  mode: "active", // active | draft | historical | suggested
                  search: null,
                  items: [],
                  totalResults: 0
              });

              this.on("change:pageSize change:page", this.fetch, this);
              this.on("change:mode change:hostItemId change:search change:language", this.reset, this);
          },

          reset: function () {
              this.set({ items: [] });
              this.set({ page: 1 }, { silent: true });
              this.fetch();
          },

          next: function () {
              if (this.get("isBusy") || this.get("hasMore") !== "true") {
                  return;
              }
              this.fetchMore();
          },

          fetchMore: function () {
              this.set("page", this.get("page") + 1);
          },

          fetch: function () {
              if (!this.get("mode")) {
                  return;
              }

              var url = baseUrl;

              switch (this.get("mode")) {
                  case "active":
                      url += "/GetActiveTests";
                      break;
                  case "draft":
                      url += "/GetDraftPageTests";
                      break;
                  case "historical":
                      url += "/GetHistoricalTests";
                      break;
                  case "suggested":
                      url += "/GetSuggestedTests";
                      break;
                  default:
                      throw ("Unknown mode: " + this.get("mode"));
              }

              url += "?page=" + this.get("page") + "&pageSize=" + this.get("pageSize");

              if (this.get("hostItemId")) {
                  url += "&hostItemId=" + this.get("hostItemId");
              }

              if (this.get("language")) {
                  url += "&language=" + this.get("language");
              }

              if (this.get("search")) {
                  url += "&searchText=" + this.get("search");
              }

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
                          this.fetch();
                      } else {
                          var items = data.Items;
                          _.each(items, function (item) {
                              // Filter out invalid days (when no historical data available)
                              if (item.Days && item.Days < 0) {
                                  item.Days = "--";
                              }
                          });
                          this.set("items", this.get("items").concat(items));
                          //this.set("totalResults", data.TotalResults);
                          this.set("totalResults", 10);
                          //this.set("hasMore", data.TotalResults > this.get("items").length);
                          this.set("hasMore", "true"); //data.TotalResults > this.get("items").length);
                      }
                  },
                  error: function (req, status, error) {
                      console.log("Ajax call failed");
                      console.log(status);
                      console.log(error);
                      console.log(req);
                  }
              };

              requestUtil.performRequest(ajaxOptions);
          }
      });



      var view = Sitecore.Definitions.Views.ComponentView.extend(
        {

            initialize: function (options) {
                this._super();

                this.model.set({
                    pageSize: this.$el.attr("data-sc-pagesize") || 20,
                    page: this.$el.attr("data-sc-page") || 1,
                    mode: this.$el.attr("data-sc-mode") || "active",
                    hostItemId: this.$el.attr("data-sc-hostitemid") || null,
                    language: this.$el.attr("data-sc-language") || null,
                    search: this.$el.attr("data-sc-search") || null
                });
            },
        });

      Sitecore.Factories.createComponent("TestsDataSource", model, view, "script[type='x-sitecore-testsdatasource']");
  });
