var itemCallMetricBaseDataSourcePath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  itemCallMetricBaseDataSourcePath = "/-/speak/v1/contenttesting/ItemCallMetricBaseDataSource.js";
}
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      itemCallMetricBaseDataSourcePath: contentTestingDir + "/Components/DataSource/ItemCallMetricBaseDataSource"
    }
  });
  itemCallMetricBaseDataSourcePath = "itemCallMetricBaseDataSourcePath";
}

define([
  "sitecore",
  itemCallMetricBaseDataSourcePath
], function (Sitecore, itemCallMetricBaseDataSource) {
  
  Sitecore.Factories.createBaseComponent({
    name: "TopMetricsBaseDataSource",
    base: "ItemCallMetricBaseDataSource",
    selector: "script[type='x-sitecore-topmetricsbasedatasource']",

    attributes: [
      { name: "count", defaultValue: 0 },
      { name: "totalItemsCount", defaultValue: 0 },
      { name: "defaultSize", defaultValue: 5 },
      { name: "hasMore", defaultValue: false },
      { name: "hasNoItems", defaultValue: true },
      { name: "items", defaultValue: [] }
    ],

    initialize: function () {
      //this._super();

      this.model.set({
        defaultSize: this.$el.attr("data-sc-defaultsize") || 5,
        pageSize: this.$el.attr("data-sc-pagesize") || 100
      });
    },

    extendModel: {
      _setData: function(data){
        var items = data.Items || data;
        this.set({
          items: items,
          count: items.length || 0,
          totalItemsCount: data.TotalResults,
          hasNoItems: items.length === data.TotalResults,
          hasMore: items.length < data.TotalResults
        });
      },

      _appendUrl: function(url) {
        this.getCount();
        var count = this.get("count");
        return url + "&count=" + count;
      },

      getCount: function () {
        var count = this.get("count");

        // If 'count' hasn't been initialized yet, use default size value
        if (count === undefined || count === 0) {
          this.set("count", this.get("defaultSize"));
          return;
        }

        // Increase number of items to retrieve to page size value
        count = count + parseInt(this.get("pageSize"), 10);
        this.set("count", count);
      }
    }
  });
});