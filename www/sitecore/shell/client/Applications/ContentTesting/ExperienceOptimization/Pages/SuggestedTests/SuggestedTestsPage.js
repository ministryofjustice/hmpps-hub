require.config({
  paths: {
    suggestedTestsListMod: "/-/speak/v1/contenttesting/SuggestedTestsList",
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "suggestedTestsListMod", "loadingImage"], function (_sc, suggestedTestsListMod, loadingImage) {
  var SuggestedTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.suggestedTestsList = new suggestedTestsListMod.SuggestedTestsList({ host: this });

      this.TestsDataSource.set("currentPage", this);

      $(document).ready(function () {
        loadingImage.hideElement();
      });
    }
  });

  loadingImage.showElement();
  return SuggestedTests;
});