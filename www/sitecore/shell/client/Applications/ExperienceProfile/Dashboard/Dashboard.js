define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var app = sc.Definitions.App.extend({
	 /*
     * This is only for frontend handling of the page size scrolling. 
     */
	_pageSize: 0,
    initialized: function ()
    {
	  this._pageSize = this.VisitorsDataProvider.get('pageSize');
      var aggregatesPath = "/aggregates";
      var latestVisitorsTable = "latest-visitors";

      providerHelper.setupHeaders([
        { urlKey: aggregatesPath + "/" + latestVisitorsTable + "?", headerValue: latestVisitorsTable }
      ]);

      var url = "/sitecore/api/ao/v1" + aggregatesPath + "/" + latestVisitorsTable;
      providerHelper.initProvider(this.VisitorsDataProvider, latestVisitorsTable, url, this.DashboardMessageBar);
      providerHelper.subscribeSorting(this.VisitorsDataProvider, this.VisitorsList);

      providerHelper.setDefaultSorting(this.VisitorsDataProvider, "ValuePerVisit", true);
      providerHelper.getListData(this.VisitorsDataProvider);
      
      this.VisitorsList.on("change:items", cintelUtil.removeMailLink, this.VisitorsList);
	   // Setup eventlistener for the ScrollMoreData on the ListControl.
      this.on('getMoreData', this.getMoreData, this); // the 'this' in the end is for scope
    },

    findContact: function () {
      window.location.assign('search?text=' + encodeURIComponent(this.SearchTextBox.get('text') || "*"));
    },
	getMoreData: function() {
	  providerHelper.getMoreListData(this.VisitorsDataProvider,this._pageSize);
    }
  });

  return app;
});