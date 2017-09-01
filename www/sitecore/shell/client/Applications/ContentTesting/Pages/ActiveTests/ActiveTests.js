require.config({
  paths: {
    executedTestsListMod: "/-/speak/v1/contenttesting/ExecutedTestsList"
  }
});

define(["sitecore", "executedTestsListMod"], function (_sc, executedTestsListMod) {
  var ActiveTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.activeTestsList = new executedTestsListMod.ExecutedTestsList({ host: this });
    },
      
    close: function() {
      var frame = window.frameElement;
      $(frame).hide();
    }
  });

  return ActiveTests;
});