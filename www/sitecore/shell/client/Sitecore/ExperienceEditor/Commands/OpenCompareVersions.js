define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.OpenCompareVersions =
  {
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.CompareVersions.CanCompareVersions", context.currentContext);
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.CompareVersions.GetDialogUrl", function (response) {
        ExperienceEditor.Dialogs.showModalDialog("/sitecore/shell/default.aspx?" + response.responseValue.value);
      }).execute(context);
    }
  };
});