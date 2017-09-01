define(["sitecore", "/-/speak/v1/contenttesting/OptimizationBaseDataSource.js"], function (Sitecore, datasourceBase) {

  Sitecore.Factories.createBaseComponent({
    name: "OptimizationEntriesBaseDataSource",
    base: "OptimizationBaseDataSource",
    selector: "script[type = 'x-sitecore-optimizationentriesbasedatasource']",
    
    attributes: [
      { name: "actionUrlForCompare", defaultValue: null },
      { name: "compareStart", defaultValue: null },
      { name: "compareEnd", defaultValue: null },
      { name: "user", defaultValue: "" },
      { name: "maxCount", defaultValue: "" },
      { name: "items", defaultValue: [] },
      { name: "hasItems", defaultValue: false },
      { name: "hasNoItems", defaultValue: true },
      { name: "normalizeData", defaultValue: false },
      { name: "includeAverage", defaultValue: false },
      { name: "hasItemsBefore", defaultValue: false },
      { name: "hasItemsAfter", defaultValue: false }
    ],

    initialize: function () {
      this.model.set("isBusy", true);

      var compareStart = new Date(this.$el.attr("data-sc-compare-start"));
      var compareEnd = new Date(this.$el.attr("data-sc-compare-end"));

      this.model.set({
        "compareStart": isNaN(compareStart.getDate()) ? null : compareStart,
        "compareEnd": isNaN(compareEnd.getDate()) ? null : compareEnd,
        "user": this.$el.attr("data-sc-user") || "",
        "maxCount": parseInt(this.$el.attr("data-sc-maxcount"), 10) || "",
        "normalizeData": this.$el.attr("data-sc-normalize") === "true",
        "includeAverage": this.$el.attr("data-sc-include-average") || false
      });

      this.model.set("isBusy", false);
      this.model.refresh();

      this.model.on("change:compareStart change:compareEnd change:user change:maxCount change:includeAverage", this.model.refresh, this.model);
      this.model.on("change:items", this.model.setItemProperties, this.model);
    },

    extendModel: {
      setData: function (data) {
        var items = data.Items || data;
        var avg = data.Average;

        this.set("items", items);

        if (avg) {
          this.set("averageItem", avg);
        }

        if (data.HasItemsBefore != undefined) {
          this.set("hasItemsBefore", data.HasItemsBefore);
        }

        if (data.HasItemsAfter != undefined) {
          this.set("hasItemsAfter", data.HasItemsAfter);
        }
      },

      setItemProperties: function(){
        var items = this.get("items");

        this.set("hasItems", items && items.length > 0);
        this.set("hasNoItems", !this.get("hasItems"));
      },

      getUrl: function () {
        var actionUrl = this.get("actionUrl");

        var url =
          "?start=" + (this.get("start").toJSON ? this.get("start").toJSON() : this.get("start")) +
          "&end=" + (this.get("end").toJSON ? this.get("end").toJSON() : this.get("end")) +
          "&username=" + this.get("user") +
          "&maxCount=" + this.get("maxCount") +
          "&normalize=" + this.get("normalizeData") +
          "&includeAverage=" + this.get("includeAverage");

        if (this.get("compareStart") && this.get("compareEnd")) {
          actionUrl = this.get("actionUrlForCompare");
          url = url +
            "&compareStart=" + (this.get("compareStart").toJSON ? this.get("compareStart").toJSON() : this.get("compareStart")) +
            "&compareEnd=" + (this.get("compareEnd").toJSON ? this.get("compareEnd").toJSON() : this.get("compareEnd"));
        }        

        return actionUrl + url;
      }
    }
  });
});