define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function(sc, providerHelper, cintelUtil)
{
  var mainApp,
      cidParam = "cid",
      selectedItemIdProperty = "selectedItemId",
      textProperty = "text",
      isVisibleProperty = "isVisible",
      cintelTableNameProperty = "cintelTableName",
      selectedTabProperty = "selectedTab",

      intelPath = "/intel",
      visitsummaryTable = "visit-summary",
      visitPagesTable = "visit-pages",
      lateststatisticsTable = "latest-statistics",
      visitDialogApp,
      overviewPanelApp;

  var app = sc.Definitions.App.extend({
    initialized: function()
    {
      mainApp = this;

      //$('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0" />'); // workaround for responsive design

      var contactId = cintelUtil.getQueryParam(cidParam);
      if(!contactId) return;

      this.isSkinnyMode();

      sc.on("VisitDetailApp", function(subapp)
      {
        visitDialogApp = subapp;
        subapp.VisitDialogPhoto.viewModel.$el.off("click");
      }, this);

      this.TimelineToggleButton.set("isOpen", true);
      
      $(".sc-list").show();

      var baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      sc.Contact = {
        baseUrl: baseUrl,
        subscribeVisitDialog: function(listControl)
        {
          listControl.on("change:" + selectedItemIdProperty, function()
          {
            if(!listControl.get(selectedItemIdProperty)) return;
            this.openVisitDialog(listControl.get("selectedItem").get("VisitId"));
            listControl.set(selectedItemIdProperty, null);
          }, mainApp);
        }
      };

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + visitsummaryTable, headerValue: visitsummaryTable },
        { urlKey: intelPath + "/" + lateststatisticsTable + "?", headerValue: lateststatisticsTable },
        { urlKey: intelPath + "/" + visitPagesTable, headerValue: visitPagesTable }
      ]);

      $('.sc-progressindicator').first().show().hide(); // prefetch indicator background images

      this.processTabs();

      this.MainBorder.set(isVisibleProperty, true);

      sc.on("overviewPanelApp", function (application) {
        overviewPanelApp = application;
        this.openLatestVisit();
      }, this);

      this.JourneyLoadOnDemandPanel.viewModel.load();

      this.OverviewpanelLoadOnDemandPanel.off("change:isLoaded").on("change:isLoaded", function () {
        sc.trigger("contactApp", mainApp, baseUrl, contactId);
      });
      this.OverviewpanelLoadOnDemandPanel.viewModel.load();
      
      cintelUtil.removeBreadCrumbLastLink(this.Breadcrumb);
    },

    loadPanel: function(tabId)
    {
      //TODO: remove tabId from function

      var panelId = $("[data-sc-id='TabControl'] > .tab-content > .active .sc-load-on-demand-panel").data("sc-id");
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

    getTabIdFromUrl: function()
    {
      var tabName = cintelUtil.getQueryParam("tab");
      if(!tabName) return null;

      var tabIdControlId = tabName[0].toUpperCase() + tabName.toLowerCase().substring(1) + "TabId";
      var tabIdControl = this[tabIdControlId];
      if(!tabIdControl) return null;

      return tabIdControl.get(textProperty);
    },

    showDefaultTab: function()
    {
      var firstTabId = this.TabControl.get(selectedTabProperty);
      var urlTabId = this.getTabIdFromUrl();

      if(urlTabId && urlTabId != firstTabId)
      {
        this.TabControl.set(selectedTabProperty, urlTabId);
      } else
      {
        this.loadPanel(firstTabId);
      }
    },

    processTabs: function()
    {
      this.TabControl.on("change:" + selectedTabProperty, function(tabControl, selectedTab)
      {
        this.loadPanel(selectedTab);
      }, this);

      this.showDefaultTab();
    },

    refreshPanel: function()
    {
      var idPanel = this.TabControl.viewModel.$el.find(".sc-tabcontrol-tab:visible .sc-load-on-demand-panel").data("sc-id"),
          panel = this[idPanel];
      
      this.RefreshButton.set("isEnabled", false);

      panel.set("isLoaded", false);
      panel.off("change:isLoaded");
      panel.refresh();
      panel.set("isBusy", true);

      panel.on("change:isLoaded", function()
      {
        if(panel.get("isLoaded"))
        {
          panel.set("isBusy", false);
          this.RefreshButton.set("isEnabled", true);
        }
      }, this);
    },

    openLatestVisit: function()
    {
      var tableName = overviewPanelApp.InfoDataProvider.get(cintelTableNameProperty),
          data = overviewPanelApp.InfoDataProvider.get("data");
      if(!data) return;

      var visitId = data.dataSet[tableName][0].LatestVisitId;
      this.openVisitDialog(visitId);
    },

    openVisitDialog: function(visitId){
      var panel = this.LoadOnDemandPanel;

      panel.set("isLoaded", false);
      panel.refresh();
      
      panel.set("isBusy", true);
      this.VisitDialog.show();
      
      panel.on("change:isLoaded", function () {
        panel.off("change:isLoaded");
        panel.set("isBusy", false);
        visitDialogApp.open(visitDialogApp, visitId);
      }, this);
    },
    
    isSkinnyMode: function()
    {
      var skinnyMode = cintelUtil.getQueryParam("skinnymode");

      if(skinnyMode != 1) return;
      $("header").remove();
      this.BackButton.set("isVisible", false);
      this.RefreshButton.viewModel.$el.addClass("skinnymode-refresh");
    },

    toggleJourney: function () {
      var self = this;
      
      this.JourneyLoadOnDemandPanel.viewModel.$el.slideToggle(400, function () {
        self.JourneyLoadOnDemandPanel.set("isVisible", !self.JourneyLoadOnDemandPanel.get("isVisible"));
      });
    }
    
  });
  return app;
});