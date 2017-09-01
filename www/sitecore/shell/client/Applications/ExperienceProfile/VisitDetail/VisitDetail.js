define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var cidParam = "cid",
      interactionIdParam = "interactionid",
      isVisibleProperty = "isVisible",
      intelPath = "/intel",    
      visitsummaryTable = "visit-summary",
      visitPagesTable = "visit-pages",
      lateststatisticsTable = "latest-statistics",
      visitInternalSearchesTable = "visit-internal-searches",
      visitGoalsTable = "visit-goals",
      visitSummaryTable = "visit-summary",
      offlineChannelTypeId = "3648772f-0cb9-4b90-9e65-a97b2c729008";

  var baseUrl;

  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      sc.trigger("VisitDetailApp", this);
      var interactionId = cintelUtil.getQueryParam(interactionIdParam),
          contactId = cintelUtil.getQueryParam(cidParam);

      if (!contactId) return;
      $(".sc-list").show();

      this.VisitDialogPhoto.viewModel.$el.on("click", function () {
        window.location.assign("contact?cid=" + contactId);
      });
      
      baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + visitsummaryTable, headerValue: visitsummaryTable },
        { urlKey: intelPath + "/" + lateststatisticsTable + "?", headerValue: lateststatisticsTable },
        { urlKey: intelPath + "/" + visitPagesTable, headerValue: visitPagesTable },
        { urlKey: intelPath + "/" + visitInternalSearchesTable, headerValue: visitInternalSearchesTable }
      ]);

      $('.sc-progressindicator').first().show().hide(); // prefetch indicator background images

      this.MainBorder.set(isVisibleProperty, true);

      providerHelper.initProvider(this.PagesInVisitDataProvider, visitPagesTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.InternalSearchDataProvider, visitInternalSearchesTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.DialogGoalsDataProvider, visitGoalsTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.DialogVisitSummaryProvider, visitSummaryTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.ContactDetailsDataProvider, "", baseUrl, this.ContactTabMessageBar);
      
      this.open(this, interactionId);
      
      this.DialogGoalsList.on("change:items", cintelUtil.changeUrlToDefault, this.DialogGoalsList);
      this.InternalSearchList.on("change:items", cintelUtil.changeUrlToDefault, this.InternalSearchList);
      this.PagesInVisitList.on("change:items", cintelUtil.changeUrlToDefault, this.PagesInVisitList);
    },
    
    open: function (application, interactionId) {
      if (!interactionId) return;

      var dataUrlProperty = "dataUrl",
          intelBaseUrl = baseUrl + "/intel/";
      
      application.PagesInVisitDataProvider.set(dataUrlProperty, intelBaseUrl + visitPagesTable + "/" + interactionId);
      application.InternalSearchDataProvider.set(dataUrlProperty, intelBaseUrl + visitInternalSearchesTable + "/" + interactionId);
      application.DialogGoalsDataProvider.set(dataUrlProperty, intelBaseUrl + visitGoalsTable + "/" + interactionId);
      application.DialogVisitSummaryProvider.set(dataUrlProperty, intelBaseUrl + visitSummaryTable + "/" + interactionId);

      application.VisitDialogMessageBar.removeMessages("error");
      application.VisitDialogMessageBar.removeMessages("warning");
      application.VisitDialogMessageBar.removeMessages("notification");

      providerHelper.getData(
        application.ContactDetailsDataProvider,
        $.proxy(function (jsonData) {
          cintelUtil.setText(this.VisitDialogContactName, cintelUtil.getFullName(jsonData), true);
          this.VisitDialogPhoto.set("imageUrl", baseUrl + "/image?w=72&h=72");
          cintelUtil.setText(this.VisitDialogTotalVisits, jsonData.visitCount, true);
          var infoEmailLink = jsonData.preferredEmailAddress.Key ?
            jsonData.preferredEmailAddress.Value.SmtpAddress :
            jsonData.emailAddresses.length ? jsonData.emailAddresses[0].Value.SmtpAddress : null;

          cintelUtil.setText(this.VisitDialogContactEmail, infoEmailLink, true);
          cintelUtil.setText(this.VisitDialogContactProfession, jsonData.jobTitle, true);
          this.VisitDialogContactEmail.viewModel.$el.attr("href", "mailto:" + infoEmailLink);

          cintelUtil.setTitle(this.VisitDialogContactName, cintelUtil.getFullName(jsonData));
          cintelUtil.setTitle(this.VisitDialogContactProfession, jsonData.jobTitle);
          cintelUtil.setTitle(this.VisitDialogContactEmail, infoEmailLink);
        }, application)
      );

      providerHelper.getData(
        application.DialogVisitSummaryProvider,
        $.proxy(function () {
          var data = this.DialogVisitSummaryProvider.get("data").dataSet[visitSummaryTable][0];

          if (data.ChannelTypeDefinitionId == offlineChannelTypeId) {
            this.InternalSearchAccordion.set("isVisible", false);
            this.ExternalKeywordBorder.set("isVisible", false);
            this.ExternalKeywordImage.set("isVisible", false);
            this.DialogGoalsList.set("isVisible", false);
            this.PagesInVisitList.set("isVisible", false);
            this.VisitDialogPageviewsTitle.set("isVisible", false);
            this.PagesInVisitAccordion.set("header", this.TouchpointsInVisitHeader.get("text"));

            providerHelper.getListData(this.DialogGoalsDataProvider, this.DialogGoalsOfflineList);
            providerHelper.getListData(this.PagesInVisitDataProvider, this.TouchpointsInVisitList);
            
            providerHelper.subscribeSorting(this.PagesInVisitDataProvider, this.TouchpointsInVisitList);
            providerHelper.subscribeSorting(this.DialogGoalsDataProvider, this.DialogGoalsOfflineList);
          } else {
            this.DialogGoalsOfflineList.set("isVisible", false);
            this.TouchpointsInVisitList.set("isVisible", false);
            this.VisitDialogTouchpointViewsTitle.set("isVisible", false);
            
            cintelUtil.setText(this.ExternalKeyword, data.ExternalKeyword, false);

            providerHelper.getListData(this.InternalSearchDataProvider, this.InternalSearchList);
            providerHelper.getListData(this.DialogGoalsDataProvider, this.DialogGoalsList);
            providerHelper.getListData(this.PagesInVisitDataProvider, this.PagesInVisitList);

            providerHelper.subscribeSorting(this.InternalSearchDataProvider, this.InternalSearchList);
            providerHelper.subscribeSorting(this.DialogGoalsDataProvider, this.DialogGoalsList);
            providerHelper.subscribeSorting(this.PagesInVisitDataProvider, this.PagesInVisitList);
            providerHelper.subscribeAccordionHeader(this.InternalSearchDataProvider, this.InternalSearchAccordion);
          }

          providerHelper.subscribeAccordionHeader(this.DialogGoalsDataProvider, this.DialogGoalsAccordion);
          providerHelper.subscribeAccordionHeader(this.PagesInVisitDataProvider, this.PagesInVisitAccordion);

          cintelUtil.setText(this.VisitDialogTime, data.FormattedVisitStartDateTime, true);
          cintelUtil.setText(this.VisitDialogLocation, data.LocationDisplayName, true);
          cintelUtil.setText(this.VisitDialogCurrentVisit, data.VisitIndex, true);
          cintelUtil.setText(this.VisitDialogPageviews, data.VisitPageViewCount, true);
          cintelUtil.setText(this.VisitDialogVisitTime, data.VisitTime, true);
          cintelUtil.setText(this.VisitDialogValue, data.VisitValue, true);
          cintelUtil.setText(this.TrafficChannel, data.ChannelDisplayName, true);
          cintelUtil.setText(this.Campaign, data.CampaignDisplayName, false);
          
        }, application)
      );
    }
  
  });
  return app;
});