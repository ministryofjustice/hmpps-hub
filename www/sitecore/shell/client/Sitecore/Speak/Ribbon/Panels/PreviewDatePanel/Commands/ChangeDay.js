define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.ChangeDay =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      console.log(context.button.get("direction"));
      context.currentContext.value = context.button.get("addDays");
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.PreviewDate.AddDays", function () {
        ExperienceEditor.getPageEditingWindow().location.reload();
      }).execute(context);
    }
  };
});