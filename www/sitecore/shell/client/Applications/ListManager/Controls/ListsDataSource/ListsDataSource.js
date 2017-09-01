define(["sitecore", "jquery", "underscore", "/-/speak/v1/controls/searchdatasource.js"], function (Sitecore, $, _) {
  "use strict";
  var searchDataSourceModel = Sitecore.Definitions.Models.SearchDataSource,
      searchDataSourceView = Sitecore.Definitions.Views.SearchDataSource;

  var model = searchDataSourceModel.extend({
    initialize: function (options) {
      this._super();

      this.set("url", null);
      this.set("methodName", null);
      this.set("rootId", null);
      this.set("filter", null);
      this.set("searchExpression", null);

      this.set("topFolderName", null);
      this.set("folderType", null);
      this.set("contactListType", null);
      this.set("segmentedListType", null);
      this.set("folderIcon", null);
      this.set("contactListPagePattern", null);
      this.set("segmentedListPagePattern", null);

      this.ancestorIds = [""];
      
      Sitecore.on("listManager:listCreated", this.refreshAfterListCreated, this);

      this.subscribeOnSelectListOrFolder();
    },
    selectListOrFolder: function (selectedItemId, type, name) {
      var typeToCheck = type.toString().toLowerCase();
      switch (typeToCheck) {
        case this.get("folderType").toLowerCase():
          this.enterFolder(selectedItemId, name);
          break;
        case this.get("contactListType").toLowerCase():
          location.href = this.get("contactListPagePattern") + selectedItemId;
          break;
        case this.get("segmentedListType").toLowerCase():
          location.href = this.get("segmentedListPagePattern") + selectedItemId;
          break;
        default:
          break;
      }
    },
    selectListOrFolderCombined: function (input) {
      var obj = $(input);
      this.selectListOrFolder(obj.attr("data-id"), obj.attr("data-type"), obj.attr("data-name"));
    },
    subscribeOnSelectListOrFolder: function() {
      Sitecore.on("select:listOrFolder", this.selectListOrFolder, this);
      Sitecore.on("select:listOrFolder:combined", this.selectListOrFolderCombined, this);
    },
    unsubscribeFromSelectListOrFolder: function() {
      Sitecore.off("select:listOrFolder", this.selectListOrFolder, this);
      Sitecore.off("select:listOrFolder:combined", this.selectListOrFolderCombined, this);
    },
    refreshAfterListCreated: function () {
      var self = this;
      setTimeout(function () {
        self.refresh();
      }, 500);
    },
    enterFolder: function (selectedItemId, name) {
      if (name === this.get("topFolderName")) {
        this.ancestorIds.pop();
      } else {
        this.ancestorIds.push(selectedItemId);
      }
      this.set("rootId", selectedItemId);
      this.refresh();
      this.trigger("folderSelected", selectedItemId, name);
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

      this.pendingRequests++;
      this.set("isBusy", true);

      var self = this;
      $.get(url, options, function (items) { self.completed(items, self); });
    },
    getOptions: function () {
      var options = this._super();

      options.rootId = this.get("rootId") || "";
      options.filter = this.get("filter") || "";
      options.searchExpression = this.get("searchExpression") || "";
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

      // Initialize top row
      if (context.ancestorIds.length > 1) {
        var id = context.ancestorIds[context.ancestorIds.length - 2],
            topRow = {
              Id: id, itemId: id, Name: context.get("topFolderName"),
              NameFormatted: context.get("topFolderName"),
              Type: context.get("folderType"), Icon: context.get("folderIcon")
            };
        items = Array.prototype.concat.call(topRow, items);
      }

      // encode provided data
      items.forEach(this.htmlEncode);

      context.set("items", items, { force: true });

      context.pendingRequests--;
      if (context.pendingRequests <= 0) {
        context.set("isBusy", false);
        context.pendingRequests = 0;
      }

      context.trigger("itemsChanged");
    },

    htmlEncode: function(el) {
      var helpElem = $("<div/>");
      el.Name = helpElem.text(el.Name).html();
    }
  });

  var view = searchDataSourceView.extend({
    initialize: function (options) {
      this._super();

      this.model.set("url", this.$el.attr("data-sc-url") || "");
      this.model.set("methodName", this.$el.attr("data-sc-methodname") || "");
      this.model.set("rootId", this.$el.attr("data-sc-rootid") || "");
      this.model.set("filter", this.$el.attr("data-sc-filter") || "");
      this.model.set("searchExpression", this.$el.attr("data-sc-searchexpression") || "");

      this.model.set("topFolderName", this.$el.attr("data-sc-topfoldername") || "");
      this.model.set("folderIcon", this.$el.attr("data-sc-foldericon") || "");
      this.model.set("folderType", this.$el.attr("data-sc-foldertype") || "");
      this.model.set("contactListType", this.$el.attr("data-sc-contactlisttype") || "");
      this.model.set("segmentedListType", this.$el.attr("data-sc-segmentedlisttype") || "");
      this.model.set("contactListPagePattern", this.$el.attr("data-sc-contactlistpagepattern") || "");
      this.model.set("segmentedListPagePattern", this.$el.attr("data-sc-segmentedlistpagepattern") || "");

      this.model.on("change:url change:methodName change:rootId change:filter change:searchExpression", this.model.refresh, this.model);
      this.model.isReady = true;

      if (this.$el.attr("data-sc-skipinitialize") !== "true") {
        this.model.refresh();
      }
    }
  });

  return Sitecore.Factories.createComponent("ListsDataSource", model, view, ".sc-ListsDataSource");
});
