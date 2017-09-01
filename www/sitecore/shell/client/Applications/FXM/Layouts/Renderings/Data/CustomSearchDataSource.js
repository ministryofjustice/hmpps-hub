define(["sitecore"], function (sc) {
    "use strict";

        var model = Sitecore.Speak.Definitions.Models.ControlModel.extend(
      {
          initialize: function (attributes) {
              this._super();
              
              this.set("pageSize", 0);
              this.set("pageIndex", 0);
              this.set("totalItemsCount", 0);
              this.set("items", null);

              this.set("searchText", "");
              this.set("sorting", "");

              this.set("pagingMode", "appending");
              this.set("autoRefresh", true);

              this.set("isBusy", false);
              this.set("hasItems", false);
              this.set("hasNoItems", true);
              this.set("hasMoreItems", false);

              this.set("baseUrl", null);
              this.set("buildQuery", function (url, qsParams, control) { return { url: url, qsParams: qsParams }; });

              this.set("parseResponseItems", function(data) { return data; });
              this.set("parseResponseTotalCount", function(data) { return data.length; });

              this.isReady = false;
              this.pendingRequests = 0;
              this.lastPage = 0;

              var self = this;
              var internalRefresh = function () {
                  if (self.get("autoRefresh") == true) {
                      self.refresh();
                  }
              };

              this.on("change:searchText change:pageSize change:pageIndex change:sorting", internalRefresh, this);
          },

          refresh: function () {
              this.set("pageIndex", 0);
              this.lastPage = 0;
              this.getItems();
          },

          next: function () {
              this.lastPage++;
              this.getItems();
          },

          getItems: function () {
              if (!this.isReady) {
                  return;
              }

              var baseUrl = this.get("baseUrl");
              var buildQuery = this.get("buildQuery");

              var qsParams = {};

              if (!baseUrl || !buildQuery) {
                  _sc.debug("CustomSearchDataSource request: insufficient parameters are set; '", baseUrl);
                  return;
              }

              var finalUrl = {};
              finalUrl = buildQuery(baseUrl, qsParams, this);

              var finalQs = [];
              _.each(Object.keys(finalUrl.qsParams), function (qsParam) {
                  finalQs.push(qsParam + '=' + finalUrl.qsParams[qsParam]);
              });

              var urlString = finalUrl.url + "?" + finalQs.join("&");

              this.pendingRequests++;
              this.set("isBusy", true);

              _sc.debug("CustomSearchDataSource request: '", finalUrl);

              var that = this;
              $.ajax({
                  url: urlString,
                  headers: {
                      "X-RequestVerificationToken": jQuery('[name=__RequestVerificationToken]').val(),
                      "X-Requested-With": "XMLHttpRequest"
                  }
              }).fail(function (data) {
                  that.failed(data);
              }).done(function (data) {
                  that.completed(data);
              });
          },

          failed: function(data) {
              _sc.debug("CustomSearchDataSource received: ", data);

              this.pendingRequests--;
              if (this.pendingRequests <= 0) {
                  var self = this;
                  self.set("isBusy", false);

                  this.pendingRequests = 0;
              }
          },

          completed: function (data) {
              _sc.debug("CustomSearchDataSource received: ", data);

              var parseResponseItems = this.get("parseResponseItems"),
                  parseResponseTotalCount = this.get("parseResponseTotalCount");

              if (!parseResponseItems || !parseResponseTotalCount) {
                  _sc.debug("CustomSearchDataSource response: parseResponseItems and parseResponseTotalCount must be set");
                  return;
              }
              
              var items = parseResponseItems(data);
              var totalCount = parseResponseTotalCount(data);

              if (this.get("pagingMode") == "appending" && this.lastPage > 0) {
                  items = this.get("items").concat(items);
              }

              _.each(items, function (item) {
                  var el = document.createElement("div");
                  el.innerText = el.textContent = item.Domain;
                  item.Domain = el.innerHTML;
              });

              this.set("items", items, { force: true });

              this.set("totalItemsCount", totalCount);
              this.set("hasItems", items && items.length > 0);
              this.set("hasNoItems", !items || items.length === 0);
              this.set("hasMoreItems", items.length < totalCount);

              this.pendingRequests--;
              if (this.pendingRequests <= 0) {
                  var self = this;
                  self.set("isBusy", false);

                  this.pendingRequests = 0;
              }

              this.trigger("itemsChanged");
          }
      }
    );

    var view = Sitecore.Speak.Definitions.Views.ComponentView.extend(
      {
          listen: _.extend({}, Sitecore.Speak.Definitions.Views.ComponentView.prototype.listen, {
              "refresh:$this": "refresh",
              "next:$this": "next"
          }),

          initialize: function (options) {
              this._super();

              var pageIndex, pageSize, autoRefresh;

              this.model.set("baseUrl", this.$el.attr("data-sc-baseurl"));

              this.model.set("autoRefresh", this.$el.attr("data-sc-autorefresh").toLowerCase() != 'false');

              pageSize = parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0;
              this.model.set("pageSize", pageSize);

              pageIndex = parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0;
              this.model.set("pageIndex", pageIndex);

              this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending"); // or paged

              this.model.isReady = true;
          },

          afterRender: function () {
              if (this.model.get("autoRefresh") === true) {
                  this.refresh();
              }
          },

          refresh: function () {
              this.model.refresh();
          },

          next: function () {
              this.model.next();
          }
      }
    );

    Sitecore.Speak.Factories.createComponent("CustomSearchDataSource", model, view, ".sc-CustomSearchDataSource");
});