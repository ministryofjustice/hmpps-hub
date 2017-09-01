define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"], function (Sitecore, ExperienceEditor, ExperienceEditorContext) {
  Sitecore.Commands.MoreLanguages =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      var dialogPath = "/sitecore/shell/~/xaml/Sitecore.Shell.Applications.Globalization.SelectLanguage.aspx?la=" + context.currentContext.language;
      var dialogFeatures = "dialogHeight: 615px;dialogWidth: 500px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }

        var changeLanguageCommand = Sitecore.Commands.ChangeLanguage;
        if (!changeLanguageCommand) {
          return;
        }

        ExperienceEditorContext.instance.executeCommand("ChangeLanguage", result);
      });
    }
  };
});