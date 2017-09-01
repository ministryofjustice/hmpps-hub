define(["sitecore", "/-/speak/v1/contenttesting/OptimizationEntriesBaseDataSource.js"], function (Sitecore, optimizationEntriesBaseDataSource) {
  kpiOptions = {
      all: "all",
      guess: "guess",
      effect: "effect",
      activity: "activity"
  };

  Sitecore.Factories.createBaseComponent({
    name: "TestOutcomesDataSource",
    base: "OptimizationEntriesBaseDataSource",
    selector: "script[type='x-sitecore-testoutcomesdatasource']",

    attributes: [
      { name: "actionUrl", value: "/sitecore/shell/api/ct/TestOutcomes/AllForDateRange" },
      { name: "actionUrlForCompare", value: "/sitecore/shell/api/ct/TestOutcomes/AllForDateRangeWithComparisonForUser" },
      { name: "separateAverage", defaultValue: false },
      { name: "kpi", defaultValue: "$el.data:sc-kpi" },
      { name: "guessActionUrl", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/GuessForDateRange" },
      { name: "guessActionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/GuessForDateRangeWithComparisonForUser" },
      { name: "effectActionUrl", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/EffectForDateRange" },
      { name: "effectActionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/EffectForDateRangeWithComparisonForUser" },
      { name: "activityActionUrl", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/ActivityForDateRange" },
      { name: "activityActionUrlForCompare", defaultValue: "/sitecore/shell/api/ct/TestOutcomes/ActivityForDateRangeWithComparisonForUser" },
    ],

    initialize: function () {
      this._super();

      this.model.set("separateAverage", this.$el.attr("data-sc-separateaverage") === "true");
      this.model.on("change:kpi", this.model.refresh, this.model);
    },

    extendModel: {
      getUrl: function () {
        var actionUrl = this.get("actionUrl");

        switch(this.get("kpi")){
          case kpiOptions.guess:
            actionUrl = this.get("guessActionUrl");
            break;
          case kpiOptions.effect:
            actionUrl = this.get("effectActionUrl");
            break;
          case kpiOptions.activity:
            actionUrl = this.get("activityActionUrl");
            break;
          default:
            actionUrl = this.get("actionUrl");
        }

        var url = Sitecore.Helpers.url.addQueryParameters("", {
          start: this.get("start").toJSON ? this.get("start").toJSON() : this.get("start"),
          end: this.get("end").toJSON ? this.get("end").toJSON() : this.get("end"),
          username: this.get("user"),
          maxCount: this.get("maxCount"),
          normalize: this.get("normalizeData"),
          includeAverage: this.get("includeAverage"),
          separateAverage: this.get("separateAverage")
        });

        if (this.get("compareStart") && this.get("compareEnd")) {
          actionUrl = this.get("actionUrlForCompare");

          switch (this.get("kpi")) {
            case kpiOptions.guess:
              actionUrl = this.get("guessActionUrlForCompare");
              break;
            case kpiOptions.effect:
              actionUrl = this.get("effectActionUrlForCompare");
              break;
            case kpiOptions.activity:
              actionUrl = this.get("activityActionUrlForCompare");
              break;
            default:
              actionUrl = this.get("actionUrlForCompare");
          }

          url = Sitecore.Helpers.url.addQueryParameters(url, {
            compareStart: this.get("compareStart").toJSON ? this.get("compareStart").toJSON() : this.get("compareStart"),
            compareEnd: this.get("compareEnd").toJSON ? this.get("compareEnd").toJSON() : this.get("compareEnd")
          });
        }

        return actionUrl + url;
      }
    }
  });
});