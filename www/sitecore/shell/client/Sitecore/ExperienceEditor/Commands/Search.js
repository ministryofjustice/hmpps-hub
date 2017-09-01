define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.Search =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      context.currentContext.value = "/sitecore/shell/Applications/Dialogs/Web%20Edit%20Search.aspx?";
      context.app.disableButtonClickEvents();
      ExperienceEditor.PipelinesUtil.executePipeline(context.app.SearchPipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.Search, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});