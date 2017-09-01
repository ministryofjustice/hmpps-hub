define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.OpenResetFields =
  {
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.ResetFields.CanResetFields", context.currentContext);
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ResetFields.GetDialogUrl", function (response) {
        var dialogFeatures = "dialogMinWidth: 850px;";
        ExperienceEditor.Dialogs.showModalDialog("/sitecore/shell/default.aspx?" + response.responseValue.value, "", dialogFeatures, null, function (result) {
          if (result == "yes") {
            window.top.location.reload();
          }
        });
      }).execute(context);
    }
  };
});