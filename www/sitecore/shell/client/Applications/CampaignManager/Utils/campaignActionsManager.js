define([], function () {
  "use strict";
  var dashboardMode = "dashboard",
      campaignMode = "campaign";
  return {
    _goToCampaignActivity: ["37C3B57C8B4C4DA7B2EDEB5D5F9A6CE8"],
    _goToExperienceAnalytics: ["44D0308F773A461287766AD627A65734", "7126B12430794D02B377E7131C6A7DDC"],
    _deleteCampaign: ["386AA0C4E50440CCB6781CBCAF3FB3E0", "FB02006ECD52442983DB8077846266E7"],
    _exportCampaigns: ["AEBF3BB601C34EA280D34658D8B5060A"],

    addBaseStructure: function (baseStructure) {
      var mode = baseStructure.mode;
      if (typeof mode !== "undefined" && mode !== null && mode.toLowerCase() === dashboardMode) {
        baseStructure.control.on("change:selectedItem", function() {
          this.setAvailableActions(baseStructure);
        }, this);
        baseStructure.dataSource.on("change:items", function() {
          baseStructure.control.set("selectedItem", "");
          baseStructure.control.set("selectedItemId", "");
          this.setAvailableActions(baseStructure);
        }, this);
      }
      this.setAvailableActions(baseStructure);
    },

    setAvailableActions: function (baseStructure) {
      var alwaysAvaliableActions = [];
      var availableActions = [];
      var checkAnalytics = false;

      var mode = baseStructure.mode;
      if (typeof mode === "undefined" || mode === null) {
        return;
      }

      if (mode.toLowerCase() === dashboardMode) {
        var selectedItem = baseStructure.control.get("selectedItem");
        var items = baseStructure.dataSource.get("items");
        if (items && items.length > 0) {
          alwaysAvaliableActions = this._exportCampaigns;
        }
        if (typeof selectedItem === "undefined" || selectedItem === null || selectedItem === "") {
          availableActions = alwaysAvaliableActions;
        } else {
          availableActions = alwaysAvaliableActions.concat(this._goToCampaignActivity, this._deleteCampaign);
          checkAnalytics = true;
        }
      }

      if (mode.toLowerCase() === campaignMode) {
        availableActions = alwaysAvaliableActions.concat(this._deleteCampaign);
        checkAnalytics = true;
      }

      if (checkAnalytics) {
        if (baseStructure.isAnalyticsDisabled === false) {
          availableActions = availableActions.concat(this._goToExperienceAnalytics);
        }
      }

      Array.prototype.forEach.call(baseStructure.actionControl.viewModel.actions(), function (el) {
        if (availableActions.indexOf(el.id()) < 0) {
          el.disable();
        } else {
          el.enable();
        }
      });
    }
  };
});