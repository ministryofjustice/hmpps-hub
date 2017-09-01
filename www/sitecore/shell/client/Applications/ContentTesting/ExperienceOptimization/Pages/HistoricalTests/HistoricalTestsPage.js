require.config({
  paths: {
    executedTestsListMod: "/-/speak/v1/contenttesting/ExecutedTestsList",
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "executedTestsListMod", "loadingImage"], function (_sc, executedTestsListMod, loadingImage) {
  var HistoricalTests = _sc.Definitions.App.extend({
    initialized: function () {
        this.historicalTestsList = new executedTestsListMod.ExecutedTestsList({ host: this, enableClickEvent: false});

      this.TestsDataSource.set("currentPage", this);

      $(document).ready(function () {
        loadingImage.hideElement();
      });
    }

  });

  loadingImage.showElement();
  return HistoricalTests;
});