define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.MovePage =
  {
    canExecute: function (context) {
      if (context.currentContext.isHome || !ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Move.CanMove", context.currentContext);
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      ExperienceEditor.PipelinesUtil.executePipeline(context.app.MovePagePipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.MoveItem, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});