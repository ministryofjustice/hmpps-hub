define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
  var actionUrl = "/sitecore/shell/api/ct/Query/GetItems";

  Sitecore.Factories.createBaseComponent({
    name: "SitecoreQueryDataSource",
    base: "ControlBase",
    selector: "script[type='x-sitecorequery-datasource']",
    attributes: [
      { name: "items", defaultValue: [] },
      { name: "hasItems", defaultValue: false },
      { name: "invalidated", defaultValue: false },
      { name: "isBusy", defaultValue: false },
      { name: "query", value: "$el.data:sc-query" },
      { name: "root", value: "$el.data:sc-root" },
      { name: "database", value: "$el.data:sc-database" },
    ],

    extendModel: {
      refresh: function () {
        if (!this.get("query") || !this.get("database")) {
          return;
        }

        if (this.get("isBusy")) {
          this.set("invalidated", true);
          return;
        }

        var ajaxOptions = {
          cache: false,
          url: Sitecore.Helpers.url.addQueryParameters(actionUrl, { query: this.get("query"), database: this.get("database"), root: this.get("root") }),
          context: this,
          success: function(data) {
            this.set("isBusy", false);
            if (this.get("invalidated")) {
              this.refresh();
            } else {
              var items = _.map(data.Items, function(itemData) {
                return new _sc.Definitions.Data.Item(itemData);
              });
              this.set({
                items: items,
                hasItems: items.length > 0
              });
            }
          },
          error: function(req, status, error) {
            console.log("Ajax call failed");
            console.log(status);
            console.log(error);
            console.log(req);
          }
        };

        requestUtil.performRequest(ajaxOptions);
      }
    },

    initialize: function () {
      this.model.on("change:query change:database change:root", this.model.refresh, this.model);
      this.model.refresh();
    }
  });
});
