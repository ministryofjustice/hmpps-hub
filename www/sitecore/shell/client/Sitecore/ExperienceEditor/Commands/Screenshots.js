define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.Screenshots =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.GetScreenShotUrl", function (response) {
        ExperienceEditor.Dialogs.showModalDialog(response.responseValue.value);
      }).execute(context);
    }
  };
});