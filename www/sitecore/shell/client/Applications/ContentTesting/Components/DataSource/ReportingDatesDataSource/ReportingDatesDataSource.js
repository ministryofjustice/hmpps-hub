define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
      var model = Sitecore.Definitions.Models.ControlModel.extend({
          initialize: function (options) {
              this._super();

              this.set({
                  isBusy: false,
                  invalidated: false,
                  actionUrl: "/sitecore/shell/api/ct/Date/AdjustDate",
                  periodType: "month",
                  previousStart: null,
                  previousEnd: null,
                  previousTitle: null,
                  currentStart: null,
                  currentEnd: null,
                  currentTitle: null,
                  today: null,
                  tomorrow: null
              });

              this.on("change:periodType", this.refresh, this);
          },

          nextPeriod: function () {
              this.refresh(1);
          },

          previousPeriod: function () {
              this.refresh(-1);
          },

          refresh: function (increment) {
              // ensure increment is a valid integer
              if (parseInt(increment, 10) !== increment) {
                  increment = 0;
              }

              var date = this.get("currentStart");
              var periodType = this.get("periodType");

              if (!date || !periodType) {
                  return;
              }

              this.set("isBusy", true);
              this.set("invalidated", false);

              var url = Sitecore.Helpers.url.addQueryParameters(this.get("actionUrl"), {
                  date: date,
                  periodType: periodType,
                  increment: increment
              });

              if (this.prevUrl === url) {
                  return;
              }

              if (this.get("isBusy")) {
                  this.set("invalidated", true);
                  return;
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
                      if (this.get("invalidated")) {
                          this.refresh();
                      } else {
                          if (data) {
                              var prevTitle = data.PreviousStartTitle === data.PreviousEndTitle ? data.PreviousStartTitle : data.PreviousStartTitle + " - " + data.PreviousEndTitle;
                              var currTitle = data.CurrentStartTitle === data.CurrentEndTitle ? data.CurrentStartTitle : data.CurrentStartTitle + " - " + data.CurrentEndTitle;

                              // Set attributes all at once so change event is fired once all updates are made.
                              this.set({
                                  previousStart: data.PreviousStartDate,
                                  previousEnd: data.PreviousEndDate,
                                  previousTitle: prevTitle,
                                  currentStart: data.CurrentStartDate,
                                  currentEnd: data.CurrentEndDate,
                                  currentTitle: currTitle,
                                  today: data.Today,
                                  tomorrow: data.Tomorrow
                              });
                          }
                      }
                  }
              };

              requestUtil.performRequest(ajaxOptions);
          }
      });

      var view = Sitecore.Definitions.Views.ControlView.extend({
          initialize: function (options) {
              this._super();

              // Set attributes all at once so change event is fired once all updates are made.
              this.model.set({
                  previousStart: this.$el.attr("data-sc-prev-start") || null,
                  previousEnd: this.$el.attr("data-sc-prev-end") || null,
                  previousTitle: this.$el.attr("data-sc-prev-title") || null,
                  currentStart: this.$el.attr("data-sc-current-start") || null,
                  currentEnd: this.$el.attr("data-sc-current-end") || null,
                  currentTitle: this.$el.attr("data-sc-current-title") || null,
                  today: this.$el.attr("data-sc-today") || null,
                  tomorrow: this.$el.attr("data-sc-tomorrow") || null
              });
          }
      });

      Sitecore.Factories.createComponent("ReportingDatesDataSource", model, view, "script[type='x-sitecore-reportingdatesdatasource']");
  });
