define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  var confirmDialog = Sitecore.Definitions.App.extend({
    initialized: function () {
      var messageBody = $(this.MessageBody.viewModel.$el[0]);
      messageBody.html(ExperienceEditor.Web.getUrlQueryStringValue("message"));
      var okButtonText = ExperienceEditor.Web.getUrlQueryStringValue("okButtonText");
      if (okButtonText != "") {
        this.OkButton.set("text", okButtonText);
      }

      var messageWidth = ExperienceEditor.Web.getUrlQueryStringValue("messageWidth");
      if (messageWidth != "") {
        messageBody.css("maxWidth", messageWidth);
      }

      var messageHeight = ExperienceEditor.Web.getUrlQueryStringValue("messageHeight");
      if (messageHeight != "") {
        messageBody.css("maxHeight", messageHeight);
      }

      var cancelButtonText = ExperienceEditor.Web.getUrlQueryStringValue("cancelButtonText");
      if (cancelButtonText != "") {
        this.CancelButton.set("text", cancelButtonText);
      }

      var dialogHeader = ExperienceEditor.Web.getUrlQueryStringValue("dialogHeader");
      if (dialogHeader != "") {
        this.DialogHeader.set("text", dialogHeader);
      }

      this.setOkButtonClick();
      this.setCancelButtonClick();
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(false);
      }, this);
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        this.closeDialog(true);
      }, this);
    },
  });
  return confirmDialog;
});