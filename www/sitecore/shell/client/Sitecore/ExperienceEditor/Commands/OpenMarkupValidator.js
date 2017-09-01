define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.OpenMarkupValidator =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Proofing.Markup", function (response) {
        window.open(response.responseValue.value, "_blank");
      }).execute(ExperienceEditor.generatePageContext(context, ExperienceEditor.getPageEditingWindow().document));
    }
  };
});