define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
      var estimationModes = {
          unified: "unified",
          page: "page"
      };

      var model = Sitecore.Definitions.Models.ControlModel.extend({
          initialize: function (options) {
              this._super();

              var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);

              this.set({
                  actionUrl: "/sitecore/shell/api/ct/TestVariables/GetExpectedTestDuration",
                  actionUrlForPageTest: "/sitecore/shell/api/ct/TestVariables/GetExpectedTestDurationForPageTest",
                  isBusy: false,
                  invalidated: false,
                  itemUri: null,
                  device: params.device || null,
                  additionalPageCount: null,
                  trafficAllocation: 0,
                  confidence: 0,
                  disabledVariables: [],
                  disabledVariations: [],
                  variableCount: null,
                  valueCount: null,
                  experienceCount: null,
                  viewsPerDay: null,
                  requiredVisits: null,
                  expectedDays: null,
                  isEstimated: false,
                  ignoreRunningTests: false,
                  measureByGoal: false,
                  estimationMode: estimationModes.unified,
                  isPaused: false
              });

              this.on("change:itemUri change:additionalPageCount change:trafficAllocation change:disabledVariables change:disabledVariations change:confidence change:measureByGoal", this.refresh, this);
          },

          composeUri: function () {
              var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
              return this.get("itemUri") || params.uri;
          },

          refresh: function () {
              if (this.get("isPaused")) {
                  return false;
              }

              var hostUri = this.composeUri();
              if (!hostUri) {
                  return false;
              }

              var url = "";

              if (this.get("estimationMode") === estimationModes.page) {
                  var additionalPageCount = this.get("additionalPageCount") || 0;
                  url = Sitecore.Helpers.url.addQueryParameters(this.get("actionUrlForPageTest"), {
                      additionalPageCount: additionalPageCount
                  });
                  if (additionalPageCount <= 0) {
                      return false;
                  }
              }
              else {

                  var accumulator = function (acc, curr) { return acc + curr.UId + "|"; };

                  var disabledVariants = _.reduce(this.get("disabledVariables"), accumulator, "");
                  var disabledVariations = _.reduce(this.get("disabledVariations"), accumulator, "");

                  url = Sitecore.Helpers.url.addQueryParameters(this.get("actionUrl"), {
                      disabledVariants: disabledVariants,
                      disabledVariations: disabledVariations
                  });
              }

              url = Sitecore.Helpers.url.addQueryParameters(url, {
                  itemdatauri: hostUri,
                  trafficAllocationPercentage: this.get("trafficAllocation") || "",
                  confidencePercentage: this.get("confidence") || "",
                  deviceId: this.get("device") || "",
                  ignoreRunningTests: this.get("ignoreRunningTests"),
                  measurement: this.get("measureByGoal") ? "GoalConversion" : "TrailingValue"
              });

              if (this.prevUrl === url) {
                  return false;
              }

              if (this.get("isBusy")) {
                  this.set("invalidated", true);
                  return false;
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
                      var useData = true;
                      if (this.get("invalidated")) {
                          useData = !this.refresh();
                      }

                      if(useData) {
                          this.set({
                              variableCount: data.VariableCount,
                              valueCount: data.ValueCount,
                              experienceCount: data.ExperienceCount,
                              viewsPerDay: data.ViewsPerDay,
                              expectedDays: data.ExpectedDays,
                              isEstimated: data.IsEstimated,
                              requiredVisits: data.RequiredVisits
                          });
                      }
                  }
              };

              requestUtil.performRequest(ajaxOptions);
              return true;
          }
      });

      var view = Sitecore.Definitions.Views.ControlView.extend({
          initialize: function (options) {
              this._super();

              // stop refreshing while initial settings are read
              this.model.set("isBusy", true);

              this.model.set({
                  itemUri: this.$el.attr("data-sc-itemuri") || null,
                  trafficAllocation: this.$el.attr("data-sc-trafficallocation") || 100,
                  confidence: this.$el.attr("data-sc-confidence") || 95,
                  disabledVariables: this.$el.attr("data-sc-disabledvariables") || [],
                  ignoreRunningTests: this.$el.attr("data-sc-ignorerunningtests") || false,
                  estimationMode: this.$el.attr("data-sc-estimationmode") || estimationModes.unified,
                  isPaused: this.$el.attr("data-sc-ispaused") || false
              });

              // settings have completed reading. Resume
              this.model.set("isBusy", false);
          }
      });

      Sitecore.Factories.createComponent("TestDurationDataSource", model, view, "script[type='x-sitecore-testdurationdatasource']");
  });
