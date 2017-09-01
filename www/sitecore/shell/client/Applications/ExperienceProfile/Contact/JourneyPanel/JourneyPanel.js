define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var previousItemId,
      currentItemId;

  var journeySubApp = sc.Definitions.App.extend({
    initialized: function () {
      this.loadDefaultJourneyView();
      sc.trigger("journeyPanelApp", this);
    },

    loadDefaultJourneyView: function () {
      var cidParam = "cid",
          contactId = cintelUtil.getQueryParam(cidParam),
          viewName = "journey",
          intelPath = "/sitecore/api/ao/v1/contacts/" + contactId + "/intel",
          intelBaseUrl = intelPath + "/";

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + viewName + "?", headerValue: viewName }
      ]);

      providerHelper.initProvider(this.JourneyDataProvider, viewName, intelBaseUrl + viewName, null);
     
      providerHelper.getData(
        this.JourneyDataProvider,
        $.proxy(function (jsonData) {
          this.JourneyTimeline.set("data", jsonData.data);
        }, this)
      );

      this.JourneyTimeline.on("change:selectedSegment", this.selectSegment, this); 
	  this.setDefaultOptions();
    },
	
	setDefaultOptions : function () {
		
     this.JourneyTimeline.timeline.options.zoomMin = 1000 * 60 * 60;  
	 this.JourneyTimeline.timeline.options.zoomMax = 1000 * 60 * 60 * 24 * 365 * 50; 
    },
	
    selectSegment: function () {
      currentItemId = this.JourneyTimeline.get("selectedSegment") != null ?
                      this.JourneyTimeline.get("selectedSegment").TimelineEventId : null;

      if (this.JourneyTimeline.get("selectedSegment") == null || previousItemId == currentItemId) {
        previousItemId = null;
        this.unselectSegment();
        return;
      }

      var hidePanel,
          showPanel,
          entityTypeText = this.JourneyTimeline.get("selectedSegment").EntityTypeText,
          timeLineEventId = this.JourneyTimeline.get("selectedSegment").TimelineEventId;

      if (!this.InfoBorder.get("isVisible")) {
        this.InfoBorder.viewModel.$el.slideDown(200);
        this.InfoBorder.set("isVisible", true);
      }

      switch (this.JourneyTimeline.get("selectedSegment").EntityTypeText) {
        case "OfflineInteraction":
          hidePanel = [this.OnlineLoadOnDemandPanel, this.OutcomeLoadOnDemandPanel],
          showPanel = this.OfflineLoadOnDemandPanel;
          this.triggerApp(hidePanel, showPanel, entityTypeText, timeLineEventId);
          break;

        case "OnlineInteraction":
          hidePanel = [this.OfflineLoadOnDemandPanel, this.OutcomeLoadOnDemandPanel],
          showPanel = this.OnlineLoadOnDemandPanel;
          this.triggerApp(hidePanel, showPanel, entityTypeText, timeLineEventId);
          break;

        case "Outcome":
          hidePanel = [this.OfflineLoadOnDemandPanel, this.OnlineLoadOnDemandPanel],
          showPanel = this.OutcomeLoadOnDemandPanel;
          this.triggerApp(hidePanel, showPanel, entityTypeText, timeLineEventId);
          break;
      }

      previousItemId = currentItemId;
    },

    triggerApp: function (hiddenPanel, shownPanel, trigger, timeLineEventId) {
      _.each(hiddenPanel, function (item) {
        item.set("isVisible", false);
      });

      var self = this;
      this.JourneyTimeline.viewModel.$el.find(".timeline-event").off("tap.journeypanel").on("tap.journeypanel", function (e) {
        if ($(e.currentTarget).hasClass("timeline-event-selected")) {
          self.closeInfo();
        }
      });
     
      shownPanel.set("isVisible", true);
      shownPanel.refresh();

      shownPanel.off("isLoaded").on("change:isLoaded", function () {
        shownPanel.off("change:isLoaded");
        shownPanel.set("isLoaded", true);
        sc.trigger("show" + trigger + "App", this, timeLineEventId);
      }, this);
    },

    closeInfo: function () {
      this.InfoBorder.viewModel.$el.hide(0);
      this.InfoBorder.set("isVisible", false);
      this.unselectSegment();
    },

    clickCloseButton: function () {
      previousItemId = null;
      this.closeInfo();
    },
    
    unselectSegment: function() {
      this.JourneyTimeline.off("change:selectedSegment");
      this.JourneyTimeline.set("selectedSegment", null);
      this.JourneyTimeline.on("change:selectedSegment", this.selectSegment, this);
      this.JourneyTimeline.timeline.unselectItem();
    }
  });

  return journeySubApp;
})