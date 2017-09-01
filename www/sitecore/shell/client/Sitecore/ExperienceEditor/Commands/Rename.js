define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.Rename =
  {
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Rename.CanRename", context.currentContext);
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      ExperienceEditor.PipelinesUtil.executePipeline(context.app.RenamePipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.RenameItem, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});