define(["sitecore"], function (_sc) {

  var TestSummaryDialog = _sc.Definitions.App.extend({

    initialized: function () {
      this.configureTextTemplates();
    },

    configureTextTemplates: function() {
      this.WinnerText.resume();
      this.ValueImprovedText.resume();
      this.ValueDeclineText.resume();
      this.ScoreText.resume();
      this.TestOutcomeCorrectText.resume();
      this.TestOutcomeIncorrectText.resume();
    }
  });

  return TestSummaryDialog;
});