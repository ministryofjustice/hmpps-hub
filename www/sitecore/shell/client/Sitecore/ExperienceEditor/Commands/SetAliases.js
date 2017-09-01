define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SetAliases =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.SetAliases.CanSetAliases", context.currentContext);
    },

    execute: function (context) {
      var dialogFeatures = "dialogHeight: 615;dialogWidth: 500px;";
      var dialogUrl = "/sitecore/shell/default.aspx?xmlcontrol=Aliases";
      dialogUrl += "&id=" + context.currentContext.itemId;
      dialogUrl += "&la=" + context.currentContext.language;
      dialogUrl += "&vs=" + context.currentContext.version;

      ExperienceEditor.Dialogs.showModalDialog(dialogUrl, "", dialogFeatures, null);
    }
  };
});