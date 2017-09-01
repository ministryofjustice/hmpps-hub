require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics",
    experienceAnalyticsBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/experienceAnalyticsBase"
  }
});

define(["sitecore", "experienceAnalytics", "experienceAnalyticsBase"], function (Sitecore, ExperienceAnalytics) {
  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsFilters",
    base: "ExperienceAnalyticsBase",
    selector: ".sc-ExperienceAnalyticsFilters",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsBase.prototype._scAttrs.concat([
    ]),

    events: {
      "click .sc-togglebutton[data-sc-id*='DateRangeToggleButton']": "toggleComponents",
      "click .sc-togglebutton[data-sc-id*='FilterToggleButton']": "toggleComponents"
    },

    initialize: function() {
      var renderingId = this.model.get("name"),
        dateRangeFilter = this.app[renderingId + "DateRangeFilter"],
        dateRangeToggleButton = this.app[renderingId + "DateRangeToggleButton"],
        subsiteFilter = this.app[renderingId + "SubsiteFilter"],
        filterToggleButton = this.app[renderingId + "FilterToggleButton"],
        subsiteComboBox = this.app[renderingId + "SubsiteFilterSubsiteComboBox"];

      this.setFilterButtonState(filterToggleButton, subsiteComboBox);

      this.bindComponentVisibility(filterToggleButton, subsiteFilter);
      this.bindComponentVisibility(dateRangeToggleButton, dateRangeFilter);

      ExperienceAnalytics.on("change:dateRange", function (m, dateRange) {
        dateRangeToggleButton.set("text", dateRange.dateFrom + " - " + dateRange.dateTo);
      });

      ExperienceAnalytics.on("change:subsite", function (model, value) {
        subsiteFilter.set("selectedSubsiteValue", value);
      });
    },

    setFilterButtonState: function (toggleButton, comboBox) {
      toggleButton.set("isEnabled", comboBox.get("items").length > 1);
    },

    bindComponentVisibility: function (button, component) {
      button.on("change:isOpen", function () {
        component.set("isVisible", this.get("isOpen"));
      });
    },

    toggleComponents: function (event) {
      var renderingId = this.model.get("name"),
        buttonClickedId = $(event.currentTarget).attr("data-sc-id"),
        buttons = ["DateRangeToggleButton", "FilterToggleButton"];

      for (var i = 0; i < buttons.length; i++) {
        var button = this.app[renderingId + buttons[i]];

        if (button.get("name") !== buttonClickedId) {
          button.viewModel.close();
        }
      }
    },

    closeToggleButtons: function() {
      var renderingId = this.model.get("name"),
        dateRangeToggleButton = this.app[renderingId + "DateRangeToggleButton"],
        filterToggleButton = this.app[renderingId + "FilterToggleButton"];

      dateRangeToggleButton.viewModel.close();
      filterToggleButton.viewModel.close();
    }

  });
});