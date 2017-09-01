define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var textProperty = "text";
  var isVisibleProperty = "isVisible";
  var selectedItemIdProperty = "selectedItemId";

  var intelPath = "/intel";
  var keywordSummaryPostfix = "-keyword-summary";
  var keywordDetailPostfix = "-keyword-detail";

  var externalType = "external";
  var internalType = "internal";
  var paidType = "paid";

  var pageEventIdParam = "pageEventId";
  var channelIdParam = "channelId";
  var sourceParam = "source";

  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var transformers = $.map(
        [
          externalType + keywordSummaryPostfix,
          internalType + keywordSummaryPostfix,
          paidType + keywordSummaryPostfix,
          externalType + keywordDetailPostfix,
          internalType + keywordDetailPostfix,
          paidType + keywordDetailPostfix
        ], function(tableName)
        {
          return { urlKey: intelPath + "/" + tableName, headerValue: tableName };
        });
      
      providerHelper.setupHeaders(transformers);

      var intelBaseUrl = sc.Contact.baseUrl + intelPath + "/";

      providerHelper.subscribeSorting(this.KeywordDetailProvider, this.KeywordDetailList);
      providerHelper.subscribeSorting(this.KeywordDetailProvider, this.InternalKeywordList);

      providerHelper.initProvider(this.ExternalKeywordsDataProvider, externalType + keywordSummaryPostfix, intelBaseUrl + externalType + keywordSummaryPostfix, this.KeywordsTabMessageBar);
      providerHelper.subscribeSorting(this.ExternalKeywordsDataProvider, this.ExternalListControl);
      providerHelper.subscribeAccordionHeader(this.ExternalKeywordsDataProvider, this.ExternalKeywords);
      providerHelper.setDefaultSorting(this.ExternalKeywordsDataProvider, "LatestVisitStartDateTime", true);
      providerHelper.getListData(this.ExternalKeywordsDataProvider);

      this.subscribenKeywordsDetailsDialog(this.ExternalListControl, externalType, intelBaseUrl);

      providerHelper.initProvider(this.InternalKeywordsDataProvider, internalType + keywordSummaryPostfix, intelBaseUrl + internalType + keywordSummaryPostfix, this.KeywordsTabMessageBar);
      providerHelper.subscribeSorting(this.InternalKeywordsDataProvider, this.InternalListControl);
      providerHelper.subscribeAccordionHeader(this.InternalKeywordsDataProvider, this.InternalKeywords);
      providerHelper.setDefaultSorting(this.InternalKeywordsDataProvider, "LatestEventDateTime", true);
      providerHelper.getListData(this.InternalKeywordsDataProvider);

      this.subscribenKeywordsDetailsDialog(this.InternalListControl, internalType, intelBaseUrl);

      providerHelper.initProvider(this.PaidKeywordsDataProvider, paidType + keywordSummaryPostfix, intelBaseUrl + paidType + keywordSummaryPostfix, this.KeywordsTabMessageBar);
      providerHelper.subscribeSorting(this.PaidKeywordsDataProvider, this.PaidListControl);
      providerHelper.subscribeAccordionHeader(this.PaidKeywordsDataProvider, this.PaidKeywords);
      providerHelper.setDefaultSorting(this.PaidKeywordsDataProvider, "LatestVisitStartDateTime", true);
      providerHelper.getListData(this.PaidKeywordsDataProvider);

      this.subscribenKeywordsDetailsDialog(this.PaidListControl, paidType, intelBaseUrl);
    },

    subscribenKeywordsDetailsDialog: function (listControl, keywordType, intelBaseUrl)
    {
      listControl.on("change:" + selectedItemIdProperty, function ()
      {
        if (!listControl.get(selectedItemIdProperty)) return;

        this.openKeywordsDetailsDialog(keywordType, listControl, intelBaseUrl);
        listControl.set(selectedItemIdProperty, null);
      }, this);
    },

    openKeywordsDetailsDialog: function (keywordType, listControl, intelBaseUrl)
    {
      var visibility = {
        internal: false,
        external: false,
        paid: false
      };

      visibility[keywordType] = true;
      this.InternalDialogHeader.set(isVisibleProperty, visibility.internal);
      this.ExternalDialogHeader.set(isVisibleProperty, visibility.external);
      this.PaidDialogHeader.set(isVisibleProperty, visibility.paid);
      this.InternalKeywordList.set(isVisibleProperty, visibility.internal);
      this.KeywordDetailList.set(isVisibleProperty, !visibility.internal);

      var selectedRow = listControl.get("selectedItem");
      var searchTerm = selectedRow.get("SearchTerm");
      var pageEventId = selectedRow.get("PageEventId");
      var channelId = selectedRow.get("ChannelId");
      var source = selectedRow.get("Source");

      if (!pageEventId) {
          pageEventId = "";
      }
       
      if (keywordType == internalType) {
          var searchTermDisplayText = selectedRow.get("SearchTermDisplayText");
          this.Keyword.set(textProperty, searchTermDisplayText);
      } else {
          this.Keyword.set(textProperty, searchTerm);
      }

      this.KeywordDetailProvider.set("data", null);

      this.KeywordDialogMessageBar.removeMessages("error");
      this.KeywordDialogMessageBar.removeMessages("warning");
      this.KeywordDialogMessageBar.removeMessages("notification");

      this.KeywordDialog.show();

      var tableName = keywordType + keywordDetailPostfix;

      providerHelper.initProvider(this.KeywordDetailProvider, tableName, intelBaseUrl + tableName + "/" + searchTerm, this.KeywordDialogMessageBar);

      if (keywordType == internalType) {
          providerHelper.addQueryParameter(this.KeywordDetailProvider, pageEventIdParam, pageEventId);
      } else {
          providerHelper.addQueryParameter(this.KeywordDetailProvider, channelIdParam, channelId);
          providerHelper.addQueryParameter(this.KeywordDetailProvider, sourceParam, encodeURIComponent(source));
      }

      var targetList = visibility.internal ? this.InternalKeywordList : this.KeywordDetailList;
      providerHelper.setDefaultSorting(this.KeywordDetailProvider, "VisitStartDateTime", true);
      providerHelper.updateSortingFromList(this.KeywordDetailProvider, targetList);

      providerHelper.getListData(this.KeywordDetailProvider);

      this.KeywordValue.set(textProperty, selectedRow.get("Value"));
      this.KeywordVisits.set(textProperty, selectedRow.get("VisitCount"));
      this.KeywordValuePerVisit.set(textProperty, selectedRow.get("AverageValuePerVisit"));
      this.KeywordPageviewsPerVisit.set(textProperty, selectedRow.get("AveragePageViewsPerVisit"));
    }
  });
  return app;
});