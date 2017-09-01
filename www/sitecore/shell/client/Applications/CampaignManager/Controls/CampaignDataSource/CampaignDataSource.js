define(["sitecore", "jquery", "underscore", "/-/speak/v1/campaignmanager/antiForgeryUtils.js", "/-/speak/v1/controls/searchdatasource.js"], function (sitecore, $, _, antiForgeryUtils) {
  "use strict";
  var searchDataSourceModel = sitecore.Definitions.Models.SearchDataSource,
      searchDataSourceView = sitecore.Definitions.Views.SearchDataSource;

  var model = searchDataSourceModel.extend({
    initialize: function () {
      this._super();

      this.set("url", null);
      this.set("name", null);
      this.set("startDate", null);
      this.set("endDate", null);
      this.set("classifications", null);
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

      var settings = antiForgeryUtils.getSettings(),
          url = this.get("url"),
          options = this.getOptions();

      if (_.isNull(url) || _.isUndefined(url) || url === "") {
        return;
      }

      settings.url = url;
      settings.data = options;
      settings.success = function(items) { self.completed(items, self); };

      this.pendingRequests++;
      this.set("isBusy", true);

      var self = this;
      $.ajax(settings);
    },

    getOptions: function () {
      var options = this._super();

      options.name = this.get("name") || "";
      options.startDate = this.get("startDate") || "";
      options.endDate = this.get("endDate") || "";
      options.classifications = this.get("classifications") || "";
      options.sc_lang = this.get("language") || "";

      if (this.get("formatting") !== "") {
        options.formatting = this.get("formatting");
      }

      if (this.get("sorting") !== "") {
        options.sorting = this.get("sorting");
      }

      return options;
    },

    completed: function (items, context) {
      var item = _.first(items),
          totalCount = items.length;
      if (!_.isUndefined(item) && _.has(item, "Count")) {
        totalCount = item.Count;
      }

      //TODO: Remove when SPEAK templating engine will be able to encode html
      items.forEach(function (value) {
        value.EncodedName = $('<div/>').text(value.Name).html();
      });

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
    initialize: function () {
      this._super();

      this.model.set("url", this.$el.attr("data-sc-url") || "");

      this.model.set("name", this.$el.attr("data-sc-name") || "");
      this.model.set("startDate", this.$el.attr("data-sc-start") || "");
      this.model.set("endDate", this.$el.attr("data-sc-end") || "");
      this.model.set("classifications", this.$el.attr("data-sc-classifications") || "");

      this.model.isReady = true;
    },
  });

  return sitecore.Factories.createComponent("CampaignDataSource", model, view, ".sc-CampaignDataSource");
});
