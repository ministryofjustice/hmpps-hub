require.config({
  paths: {
    suggestedTestsListMod: "/-/speak/v1/contenttesting/SuggestedTestsList"
  }
});

define(["sitecore", "suggestedTestsListMod"], function (_sc, suggestedTestsListMod) {
  var SuggestedTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.suggestedTestsList = new suggestedTestsListMod.SuggestedTestsList({ host: this });
    },
      
    close: function() {
      var frame = window.frameElement;
      $(frame).hide();
    }
  });

  return SuggestedTests;
});