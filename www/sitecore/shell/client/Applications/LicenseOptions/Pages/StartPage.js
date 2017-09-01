define(["sitecore"], function (Sitecore) {
  var StartPage = Sitecore.Definitions.App.extend({
    initialized: function () {
      this.ExitButton.viewModel.$el.click(function() {
        $(".logout").click();
      });
    }
  });

  return StartPage;
});