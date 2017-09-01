require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics",
    experienceAnalyticsBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/experienceAnalyticsBase"
  }
});

define(["sitecore", "experienceAnalytics", "experienceAnalyticsBase"], function (Sitecore, ExperienceAnalytics, ExperienceAnalyticsBase) {
  Sitecore.Factories.createBaseComponent({
    name: "SubsiteFilter",
    base: "ExperienceAnalyticsBase",
    selector: ".sc-SubsiteFilter",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsBase.prototype._scAttrs.concat([
      { name: "selectedSubsiteValue", defaultValue: null },
      { name: "selectedSubsiteName", defaultValue: null },
      { name: "errorTexts", value: "$el.data:sc-errortexts" }
    ]),

    extendModel: {
      selectSubsiteValue: function (value) {
        this.set("selectedSubsiteValue", value);
        ExperienceAnalytics.setSubsite(value);
      }
    },

    initialize: function() {
      this._super();

      $(window).off("hashchange." + this.model.get("name"));
      $(window).on("hashchange." + this.model.get("name"), _.bind(this.onHashChange, this));
    },

    afterRender: function() {
      var appName = this.model.get("name"),
        submitButton = this.app[appName + "SubmitButton"],
        resetButton = this.app[appName + "ResetButton"],
        subsiteComboBox = this.app[appName + "SubsiteComboBox"];

      submitButton.on("click", this.setSelectedSubsite, this);
      resetButton.on("click", this.resetSelectedSubsite, this);

      this.model.on("change:selectedSubsiteValue", function (model, value) {
        subsiteComboBox.set("selectedValue", value ? value : subsiteComboBox.get("items")[0].itemId);
        var displayFieldName = subsiteComboBox.get("selectedItem") ? 
          subsiteComboBox.viewModel.getDisplayFieldName(subsiteComboBox.get("selectedItem")):
          null;

        this.model.set("selectedSubsiteName", displayFieldName);
      }, this);

      this.setSelectedSubsite(ExperienceAnalytics.getSubsite());
    },

    resetSelectedSubsite: function() {
      this.setSelectedSubsite("all");
      this.closeToggleButtons();
    },

    setSelectedSubsite: function (value) {
      var appName = this.model.get("name"),
        subsiteComboBox = this.app[appName + "SubsiteComboBox"],
        subsite = value || subsiteComboBox.get("selectedValue"),
        items = subsiteComboBox.get("items");

      if (items.length === 1 && subsite === "all") {
        subsite = items[0].itemId;
      }

      if (_.contains(_.pluck(items, 'itemId'), subsite)) {
        this.model.selectSubsiteValue(subsite);
      } else {
        this.showMessage("notification", this.model.get("errorTexts").InvalidSubsite, { WEBSITE: ExperienceAnalytics.getSubsite() });
        this.resetSelectedSubsite();
      }

      this.closeToggleButtons();
    },

    onHashChange: function() {
      var subsiteFromUrl = ExperienceAnalytics.getSubsiteFromUrl();

      if (this.model.get("selectedSubsiteValue") && this.model.get("selectedSubsiteValue") !== subsiteFromUrl) {
        this.model.set("selectedSubsiteValue", subsiteFromUrl);
        this.setSelectedSubsite(ExperienceAnalytics.getSubsite());
      }
    },

    closeToggleButtons: function () {
      var filtersModel = this.app[this.model.get("name").replace(this.model.componentName, "")];

      if (filtersModel) {
        filtersModel.viewModel.closeToggleButtons();
      }
    }
  });
});