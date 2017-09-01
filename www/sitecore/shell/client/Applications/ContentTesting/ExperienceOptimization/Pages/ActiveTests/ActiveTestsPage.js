require.config({
  paths: {
    executedTestsListMod: "/-/speak/v1/contenttesting/ExecutedTestsList",
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "executedTestsListMod", "loadingImage"], function (_sc, executedTestsListMod, loadingImage) {
  var ActiveTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.activeTestsList = new executedTestsListMod.ExecutedTestsList({ host: this });

      this.TestsDataSource.set("currentPage", this);

      $(document).ready(function () {
        loadingImage.hideElement();
      });
    }
  });

  loadingImage.showElement();
  return ActiveTests;
});