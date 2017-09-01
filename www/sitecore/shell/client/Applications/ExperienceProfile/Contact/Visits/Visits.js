define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {

  var intelPath = "/intel";
  var intelBaseUrl;


  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      //var intelPath = "/intel";
      intelBaseUrl = sc.Contact.baseUrl +intelPath + "/";

      this.loadInteractions(intelBaseUrl);
      this.loadEvents(intelBaseUrl);

      providerHelper.subscribeAccordionHeader(this.VisitsDataProvider, this.VisitsAccordion);
      providerHelper.subscribeAccordionHeader(this.EventsDataProvider, this.EventsAccordion);

      sc.Contact.subscribeVisitDialog(this.VisitsList);
      
      this.EventsList.on("change:items", cintelUtil.changeUrlToDefault, this.EventsList);
    },

    loadInteractions: function () {

      var visitsTable = "visits";

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + visitsTable + "?", headerValue: visitsTable }
      ]);

      providerHelper.initProvider(this.VisitsDataProvider, visitsTable, intelBaseUrl + visitsTable, this.VisitTabMessageBar);
      providerHelper.subscribeSorting(this.VisitsDataProvider, this.VisitsList);
      providerHelper.setDefaultSorting(this.VisitsDataProvider, "VisitStartDateTime", true);
      providerHelper.getListData(this.VisitsDataProvider);

    },

    loadEvents: function () {
      
      var eventsTable = "events";

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + eventsTable + "?", headerValue: eventsTable }
      ]);

      providerHelper.initProvider(this.EventsDataProvider, eventsTable, intelBaseUrl + eventsTable, this.VisitTabMessageBar);
      providerHelper.subscribeSorting(this.EventsDataProvider, this.EventsList);
      providerHelper.setDefaultSorting(this.EventsDataProvider, "EventDateTime", true);
      providerHelper.getListData(this.EventsDataProvider);
    }
    
  });
  return app;
});