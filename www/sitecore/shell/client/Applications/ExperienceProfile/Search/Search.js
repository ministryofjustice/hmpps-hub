define(["sitecore", "../Common/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var textProperty = "text";
  var isVisibleProperty = "isVisible";
  
  var contactsPath = "/contacts";
  var baseUrl = "/sitecore/api/ao/v1" + contactsPath + "/";

  var app = sc.Definitions.App.extend({
    initialized: function()
    {
      var searchTable = "search";

      providerHelper.setupHeaders([
        { urlKey: contactsPath + "/" + searchTable + "?", headerValue: "default" }
      ]);

      providerHelper.initProvider(this.SearchDataProvider, "ContactSearchResults", baseUrl + searchTable, this.SearchMessageBar);
      providerHelper.subscribeAccordionHeader(this.SearchDataProvider, this.ResultsAccordion); 
      providerHelper.subscribeSorting(this.SearchDataProvider, this.SearchResults);
      providerHelper.setDefaultSorting(this.SearchDataProvider, "visitCount", true); ////// 

      var searchText = decodeURIComponent(cintelUtil.getQueryParam(textProperty));
      this.SearchTextBox.set(textProperty, searchText);
      this.findContacts();
      
      cintelUtil.removeBreadCrumbLastLink(this.Breadcrumb);
      this.SearchResults.on("change:items", cintelUtil.removeMailLink, this.SearchResults);
    },
    
    findContacts: function()
    {
      var match = this.SearchTextBox.get(textProperty) || "*";

      if (!this.ResultsBorder.get(isVisibleProperty))
      {
        this.ResultsBorder.viewModel.show();
      }

      history.pushState(null, null, "search?text=" + encodeURIComponent(match));

      providerHelper.addQueryParameter(this.SearchDataProvider, "match", encodeURIComponent(match));
      providerHelper.getListData(this.SearchDataProvider);
    }

  });
  return app;
});