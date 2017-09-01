define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.OpenValidationResults =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Proofing.Validation", function (response) {
        var dialogFeatures = "dialogMinWidth: 850px;";
        ExperienceEditor.Dialogs.showModalDialog(response.responseValue.value, "", dialogFeatures, null);
      }).execute(ExperienceEditor.generatePageContext(context, ExperienceEditor.getPageEditingWindow().document));
    }
  };
});