define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Factories.createBaseComponent({
    name: "PageEditBar",
    base: "ControlBase",
    selector: ".sc-pageeditbar",
    attributes: [
        { name: "itemId", defaultValue: "" },
        { name: "database", defaultValue: "" },
        { name: "deviceId", defaultValue: "" },
        { name: "isHome", defaultValue: "" },
        { name: "isLocked", defaultValue: "false" },
        { name: "isLockedByCurrentUser", defaultValue: "false" }
    ],
    initialize: function () {
      this._super();
      this.model.set("itemId", this.$el.data("sc-itemid"));
      this.model.set("deviceId", this.$el.data("sc-deviceid"));
      this.model.set("isHome", this.$el.data("sc-ishome"));
      this.model.set("database", this.$el.data("sc-database"));
      this.model.set("language", this.$el.data("sc-language"));
      this.model.set("version", this.$el.data("sc-version"));
      this.model.set("isFallback", this.$el.data("sc-isfallback"));
      this.model.set("isLocked", this.$el.data("sc-islocked"));
      this.model.set("isLockedByCurrentUser", this.$el.data("sc-islockedbycurrentuser"));
      this.model.set("url", this.$el.data("sc-url"));
      this.model.set("siteName", this.$el.data("sc-sitename"));
      this.model.set("isReadOnly", this.$el.data("sc-isreadonly"));
      this.model.set("analytisEnabled", this.$el.data("sc-analyticsenabled"));
      this.model.set("requireLockBeforeEdit", this.$el.data("sc-requirelockbeforeedit"));
      this.model.set("virtualFolder", this.$el.data("sc-virtualfolder"));
      this.model.set("isInFinalWorkflow", this.$el.data("sc-isinfinalworkflow"));
      this.generateTabs();

      ExperienceEditor.Common.addOneTimeEvent(function (that) {
        return ExperienceEditor.getContext().isFrameLoaded;
      }, function (that) {
        that.set({ isVisible: true });
       ExperienceEditor.getContext().isRibbonRendered = true;
       var loadingIndicator = ExperienceEditor.getPageEditingWindow().document.getElementById("ribbonPreLoadingIndicator");
        if (loadingIndicator) {
          loadingIndicator.style.display = "none";
        }
      }, 50, this);
    },
    generateTabs: function () {
      var strips = jQuery(".sc-ribbon-strips");
      var stripLabels = strips.find("h3");
      var tabs = "";
      stripLabels.each(function () {
        tabs += "<li><a>" + jQuery(this).text() + "</a></li>";
      });
      var quickbarList = jQuery(".sc-quickbar-button-list");
      quickbarList.append(tabs);
    }
  });
});