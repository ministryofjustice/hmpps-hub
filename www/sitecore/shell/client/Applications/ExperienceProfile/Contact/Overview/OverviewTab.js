define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var intelPath = "/intel",
      overviewTable = "latest-statistics",
      latestEventsTable = "latest-events",
      recentCampaignsTable = "recent-campaigns",
      bestPatternMatchesTable = "best-pattern-matches",
      pageAddedEvent = "pageAdded",
      textProperty = "text",
      imageUrlProperty = "imageUrl";

  var app = sc.Definitions.App.extend({
    
    initialized: function ()
    {
      var transformers = $.map(
        [
          overviewTable,
          latestEventsTable,
          recentCampaignsTable,
          bestPatternMatchesTable
        ], function (tableName)
        {
          return { urlKey: intelPath + "/" + tableName + "?", headerValue: tableName };
        });
 
      providerHelper.setupHeaders(transformers);

      var intelBaseUrl = sc.Contact.baseUrl + intelPath;
      var analyticsBaseUrl = "/sitecore/api/ao/v1/analytics/";

      this.setupLatestEvents(intelBaseUrl, analyticsBaseUrl);
      this.setupBestPatternMatches(intelBaseUrl, analyticsBaseUrl);
      this.setupRecentCampaigns(intelBaseUrl);
    },

    
    setupLatestEvents: function (intelBaseUrl, analyticsBaseUrl)
    {
      providerHelper.initProvider(this.LatestEventsProvider, latestEventsTable, intelBaseUrl + "/" + latestEventsTable, this.OverviewTabMessageBar);

      var fillTemplate = function (args)
      {
        var data = args.data,
            subapp = args.app;

        subapp.EventIcon.set(imageUrlProperty, data.ImageUrl + "?w=16&h=16");
        cintelUtil.setText(subapp.EventDisplayName, data.EventDisplayName, true);
        cintelUtil.setText(subapp.Title, data.EventSubjectText, true);
        cintelUtil.setText(subapp.Time, data.FormattedEventDateTime, true);
        cintelUtil.setText(subapp.LocationDisplayName, data.LatestVisitLocationDisplayName, true);
        cintelUtil.setText(subapp.Url, data.Url != "/" ? data.Url : document.domain, true);
        subapp.Url.set("navigateUrl", data.Url);
        subapp.Url.viewModel.$el.attr("target", "_blank");
      };
      
      this.LatestEventsLeftDataRepeater.on("subAppLoaded", fillTemplate, this);
      this.LatestEventsRightDataRepeater.on("subAppLoaded", fillTemplate, this);

      this.LatestEventsProvider.on(pageAddedEvent, function (newData)
      {
        var centerIndex = Math.ceil(newData.length / 2);
        this.LatestEventsLeftDataRepeater.viewModel.addData(newData.slice(0, centerIndex));
        this.LatestEventsRightDataRepeater.viewModel.addData(newData.slice(centerIndex));
      }, this);

      providerHelper.getListData(this.LatestEventsProvider);
    },

    setupBestPatternMatches: function (intelBaseUrl, analyticsBaseUrl)
    {
      providerHelper.initProvider(this.BestPatternMatchesProvider, bestPatternMatchesTable, intelBaseUrl + "/" + bestPatternMatchesTable, this.OverviewTabMessageBar);
      providerHelper.setupDataRepeater(this.BestPatternMatchesProvider, this.BestPatternMatchesDataRepeater);

      this.BestPatternMatchesProvider.on(pageAddedEvent, function (newData)
      {
        if (!newData) return;

        var linkTextControl;
        switch (newData.length)
        {
          case 1:
            linkTextControl = this.OneMatchLinkText;
            break;
          case 2:
            linkTextControl = this.TwoMatchesLinkText;
            break;
          default:
            linkTextControl = this.ThreeMatchesLinkText;
        }

        cintelUtil.setText(this.AllMatchesHyperlinkButton, linkTextControl.get(textProperty), true);
      }, this);

      this.BestPatternMatchesDataRepeater.on("subAppLoaded", function (args)
      {
        var data = args.data,
            subapp = args.app;

        subapp.MatchImage.set(imageUrlProperty, analyticsBaseUrl + "patterncards/" + data.BestMatchedPatternId + "/image?w=32&h=32");
        cintelUtil.setText(subapp.MatchName, data.BestMatchedPatternDisplayName, true);
        cintelUtil.setText(subapp.VisitsAgo, data.LatestVisitIndex, true);
        cintelUtil.setText(subapp.Recency, data.Recency, true);
      }, this);

      providerHelper.getListData(this.BestPatternMatchesProvider);
    },

    setupRecentCampaigns: function (intelBaseUrl)
    {
      providerHelper.initProvider(this.RecentCampaignsProvider, recentCampaignsTable, intelBaseUrl + "/" + recentCampaignsTable, this.OverviewTabMessageBar);
      providerHelper.setupDataRepeater(this.RecentCampaignsProvider, this.RecentCampaignsDataRepeater);

      this.RecentCampaignsDataRepeater.on("subAppLoaded", function (args)
      {
        var data = args.data,
            subapp = args.app;

        cintelUtil.setText(subapp.CampaignName, data.CampaignDisplayName, true);
        cintelUtil.setText(subapp.CampaignChannel, data.ChannelDisplayName, true);
        cintelUtil.setText(subapp.VisitsAgo, data.VisitIndex, true);
        cintelUtil.setText(subapp.Recency, data.Recency, true);
      }, this);

      providerHelper.getListData(this.RecentCampaignsProvider);
    },
    
    goToCampaigns: function () {
      var activityId = "{EE5CE13E-6619-4BF6-9550-DF29ED6AC0ED}",
          campaignsId = "{3DC10FB3-23F4-431E-A569-B01EA282A5A1}";

      $("li[data-tab-id='" + activityId + "']").click();
      $(window).scrollTop(0);

      $("li[data-tab-id='" + campaignsId + "']").size() ?
        $("li[data-tab-id='" + campaignsId + "']").click() : 
        sc.on("ActivityApp", function (subapp) {
          subapp.CampaignsLoadOnDemandPanel.on("change:isLoaded", function () {
            this.get("isLoaded") ? $("li[data-tab-id='" + campaignsId + "']").click() : $.noop();
          });
        }, this);
    }
  });

  return app;
});