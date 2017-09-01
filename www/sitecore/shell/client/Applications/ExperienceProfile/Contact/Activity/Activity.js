define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {

  var selectedTabProperty = "selectedTab";
  var textProperty = "text";

  var app = sc.Definitions.App.extend({
    initialized: function () {
      this.processTabs();
      sc.trigger("ActivityApp", this);
    },

    loadPanel: function()
    {
      //TODO: remove tabId from function

      var panelId = $("[data-sc-id='ActivityTabControl'] > .tab-content > .active .sc-load-on-demand-panel").data("sc-id");
      var panel = this[panelId];

      if(panel && !panel.get("isLoaded"))
      {
        panel.on("change:isLoaded", function()
        {
          panel.set("isBusy", false);
        });

        panel.set("isBusy", true);
        panel.load();
      }
    },

    showDefaultTab: function () {
      var firstTabId = this.ActivityTabControl.get(selectedTabProperty);
      var urlTabId = this.getTabIdFromUrl();

      if (urlTabId && urlTabId != firstTabId) {
        this.ActivityTabControl.set(selectedTabProperty, urlTabId);
      } else {
        this.loadPanel();
      }
    },

    processTabs: function () {
      this.ActivityTabControl.on("change:" + selectedTabProperty, function (tabControl, selectedTab) {
        this.loadPanel();
      }, this);

      this.showDefaultTab();
    },

    getTabIdFromUrl: function() {
      var tabName = cintelUtil.getQueryParam("subtab");
      if (!tabName) return null;

      var tabIdControlId = tabName[0].toUpperCase() + tabName.toLowerCase().substring(1) + "TabId";
      var tabIdControl = this[tabIdControlId];
      if (!tabIdControl) return null;

      return tabIdControl.get(textProperty);
    }

  });
  return app;
});