define(['sitecore'], function (sitecore) {
  "use strict";
  return sitecore.Definitions.App.extend({
    initialized: function () {
      if (typeof this.CampaignExecutionPlanEditor !== "undefined") {
        this.CampaignExecutionPlanEditor.on("change:value", function () {
          sitecore.trigger('cm:execution:plan:changed');
        }, this);
        this.CampaignExecutionPlanEditor.on("change:friendlyValue", function (control, friendlyValue) {
          this.CampaignExecutionPlanValue.set("text", friendlyValue);
        }, this);
      }
      this.on("treeListExEditor:close", function () {
        this.CampaignExecutionPlanEditLink.viewModel.$el.click();
      }, this);

      this.disableActions();
      this.CampaignExecutionCodeValue.viewModel.$el.css("opacity", 1);
      sitecore.trigger('cm:execution:initialized');
    },
    enableActions: function () {
      var reportUrl = this.getReportUrl();
      if (typeof reportUrl !== "undefined" && reportUrl !== null && reportUrl !== "") {
        this.CampaignExecutionReportButton.viewModel.enable();
      }
      if (typeof this.CampaignExecutionPlanValue.viewModel.enable === "function") {
        this.CampaignExecutionPlanValue.viewModel.enable();
      }
      if (typeof this.CampaignExecutionPlanEditLink !== "undefined") {
        this.CampaignExecutionPlanEditLink.viewModel.enable();
        this.CampaignExecutionPlanEditLink.viewModel.show();
      }
    },
    disableActions: function() {
      this.disableAnalyticsActions();
      if (typeof this.CampaignExecutionPlanValue.viewModel.disable === "function") {
        this.CampaignExecutionPlanValue.viewModel.disable();
      }
      if (typeof this.CampaignExecutionPlanEditLink !== "undefined") {
        this.CampaignExecutionPlanEditLink.viewModel.disable();
        this.CampaignExecutionPlanEditLink.viewModel.hide();
      }
    },
    disableAnalyticsActions: function() {
      this.CampaignExecutionReportButton.viewModel.disable();
    },
    getCode: function () {
      return this.CampaignExecutionCodeValue.get('text');
    },
    setCode: function(value) {
      this.CampaignExecutionCodeValue.set('text', value);
    },
    getEngagementPlan: function() {
      return { Id: this.CampaignExecutionPlanEditor.get('value') };
    },
    setEngagementPlan: function (value) {
      if (typeof this.CampaignExecutionPlanEditor === "undefined") {
        this.CampaignExecutionPlanValue.set("text", typeof value !== "undefined" && value !== null ? value.Title : '');
      } else {
        this.CampaignExecutionPlanEditor.set('value', typeof value !== "undefined" && value !== null ? value.Id : '');
        this.CampaignExecutionPlanEditor.set('friendlyValue', typeof value !== "undefined" && value !== null ? value.Title : '');
        sitecore.trigger('cm:execution:plan:changed');
      }
    },
    getReportUrl: function() {
      return this.CampaignExecutionReportButton.get('navigateUrl');
    },
    setReportUrl: function(value) {
      this.CampaignExecutionReportButton.set('navigateUrl', value);
      if (typeof value === "undefined" || value === null || value === "") {
        this.CampaignExecutionReportButton.viewModel.disable();
      }
    },
    gotoExperienceAnalytics: function() {
      window.open(this.getReportUrl(), "_blank");
    }
  });
});