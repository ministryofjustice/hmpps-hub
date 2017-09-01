define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  var promptDialog = Sitecore.Definitions.App.extend({
    initialized: function () {
      $(this.MessageBody.viewModel.$el[0]).text(ExperienceEditor.Web.getUrlQueryStringValue("message"));
      this.InputTextBox.viewModel.$el[0].value = ExperienceEditor.Web.getUrlQueryStringValue("defaultValue");
      this.setOkButtonClick();
      this.setCancelButtonClick();
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        this.closeDialog(this.InputTextBox.viewModel.$el[0].value);
      }, this);
    },
  });
  return promptDialog;
});