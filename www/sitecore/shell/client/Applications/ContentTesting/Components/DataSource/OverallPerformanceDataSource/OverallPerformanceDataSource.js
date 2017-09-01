define(["sitecore", "/-/speak/v1/contenttesting/OptimizationBaseDataSource.js"], function (Sitecore, optimizationBaseDataSource) {
  Sitecore.Factories.createBaseComponent({
    name: "OverallPerformanceDataSource",
    base: "OptimizationBaseDataSource",
    selector: "script[type = 'x-sitecore-overallperformancedatasource']",
    attributes: [
      { name: "actionUrl", value: "/sitecore/shell/api/ct/TestOutcomes/AverageForDateRange" },
      { name: "actionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/AverageForDateRangeWithComparison" },
      { name: "compareStart", defaultValue: null },
      { name: "compareEnd", defaultValue: null },
      { name: "score", defaultValue: 0 },
      { name: "guess", defaultValue: 0 },
      { name: "effect", defaultValue: 0 },
      { name: "activity", defaultValue: 0 }
    ],

    initialize: function () {
      this._super();

      var compareStart = new Date(this.$el.attr("data-sc-compare-start"));
      var compareEnd = new Date(this.$el.attr("data-sc-compare-end"));

      this.model.set({
        "compareStart": isNaN(compareStart.getDate()) ? null : compareStart,
        "compareEnd": isNaN(compareEnd.getDate()) ? null : compareEnd
      });

      this.model.refresh();

      this.model.on("change:compareStart change:compareEnd", this.model.refresh, this.model);
    },

    extendModel: {
      setData: function (data) {
        if (data && data.Average) {
          this.set({
            score: data.Average.Score,
            guess: data.Average.Guess,
            effect: data.Average.Effect,
            activity: data.Average.Activity
          });
        } else {
          this.set({
            score: 0,
            guess: 0,
            effect: 0,
            activity: 0
          });
        }
      },

      getUrl: function () {
        var url =
          "?start=" + (this.get("start").toJSON ? this.get("start").toJSON() : this.get("start")) +
          "&end=" + (this.get("end").toJSON ? this.get("end").toJSON() : this.get("end"));

        if (this.get("compareStart") && this.get("compareEnd")) {
          url = this.get("actionUrlForCompare") + url +
            "&compareStart=" + (this.get("compareStart").toJSON ? this.get("compareStart").toJSON() : this.get("compareStart")) +
            "&compareEnd=" + (this.get("compareEnd").toJSON ? this.get("compareEnd").toJSON() : this.get("compareEnd"));
        } else {
          url = this.get("actionUrl") + url;
        }

        return url;
      }
    }
  });
});