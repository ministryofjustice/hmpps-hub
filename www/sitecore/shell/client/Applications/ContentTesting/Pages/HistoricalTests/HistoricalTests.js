require.config({
  paths: {
    executedTestsListMod: "/-/speak/v1/contenttesting/ExecutedTestsList"
  }
});

define(["sitecore", "executedTestsListMod"], function (_sc, executedTestsListMod) {
  var HistoricalTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.historicalTestsList = new executedTestsListMod.ExecutedTestsList({ host: this, enableClickEvent: false });

      // no need to bind these as ItemFromQueryString won't change after load
      this.TestsDataSource.set({
        hostItemId: this.ItemFromQueryString.get("itemId"),
        language: this.ItemFromQueryString.get("language")
      });
    },
      
    close: function() {
      var frame = window.frameElement;
      $(frame).hide();
    }
  });

  return HistoricalTests;
});