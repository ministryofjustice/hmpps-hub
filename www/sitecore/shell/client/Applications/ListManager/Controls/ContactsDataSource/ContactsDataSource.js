define(["sitecore", "jquery", "underscore", "/-/speak/v1/controls/searchdatasource.js"], function (Sitecore, $, _) {
  "use strict";
  var searchDataSourceModel = Sitecore.Definitions.Models.SearchDataSource,
      searchDataSourceView = Sitecore.Definitions.Views.SearchDataSource;

  var model = searchDataSourceModel.extend({
    initialize: function (options) {
      this._super();

      this.set("url", null);
      this.set("methodName", null);
      this.set("listId", null);
      this.set("filter", null);
    },
    next: function () {
      if (this.get("hasMoreItems") === true) {
        this._super();
      }
    },
    getItems: function () {
      if (!this.isReady) {
        return;
      }

      var url = this.get("url"),
          methodName = this.get("methodName"),
          options = this.getOptions();

      if (_.isNull(url) || _.isUndefined(url) || url === "") {
        return;
      }

      if (!_.isNull(methodName) && !_.isUndefined(methodName) && methodName !== "") {
        url = url.concat("/", methodName);
      }

      if (_.isNull(options.listId) || _.isUndefined(options.listId) || options.listId === "") {
        return;
      }

      this.pendingRequests++;
      this.set("isBusy", true);

      var self = this;
      $.get(url, options, function (items) { self.completed(items, self); });
    },
    getOptions: function () {
      var options = this._super();

      options.listId = this.get("listId") || "";
      options.filter = this.get("filter") || "";
      options.sc_lang = this.get("language") || "";

      return options;
    },

    completed: function (items, context) {
      var item = _.first(items),
          totalCount = items.length;
      if (!_.isUndefined(item) && _.has(item, "Count")) {
        totalCount = item.Count;
      }
      if (context.get("pagingMode") === "appending" && context.lastPage > 0) {
        items = context.get("items").concat(items);
      }

      context.set("totalItemsCount", totalCount);
      context.set("hasItems", items && items.length > 0);
      context.set("hasNoItems", !items || items.length === 0);
      context.set("hasMoreItems", items.length < totalCount);

      context.set("items", items, { force: true });

      context.pendingRequests--;
      if (context.pendingRequests <= 0) {
        context.set("isBusy", false);
        context.pendingRequests = 0;
      }

      context.trigger("itemsChanged", items);
    }
  });

  var view = searchDataSourceView.extend({
    initialize: function (options) {
      this._super();

      this.model.set("url", this.$el.attr("data-sc-url") || "");
      this.model.set("methodName", this.$el.attr("data-sc-methodname") || "");
      this.model.set("listId", this.$el.attr("data-sc-listid") || "");
      this.model.set("filter", this.$el.attr("data-sc-filter") || "");

      this.model.on("change:url change:methodName change:listId change:filter", this.model.refresh, this.model);
      this.model.isReady = true;
      this.model.refresh();
    },
  });

  Sitecore.Factories.createComponent("ContactsDataSource", model, view, ".sc-ContactsDataSource");
});
