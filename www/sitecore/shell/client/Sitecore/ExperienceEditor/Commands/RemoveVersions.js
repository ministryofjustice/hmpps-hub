define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.RemoveVersions =
  {
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      if (!context.button) {
        return context.app.canExecute("ExperienceEditor.RemoveVersions.CanRemoveVersion", context.currentContext);
      }

      return true;
    },
    execute: function (context) {
      context.currentContext.value = context.currentContext.argument;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.RemoveVersions.GetCommand", function (response) {
        if (response.responseValue.value == "item:deleteversion") {
          ExperienceEditor.PipelinesUtil.executePipeline(context.app.RemoveItemVersionsPipeline, function () {
            ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.RemoveItemVersions, context);
          });
        }
        else if (response.responseValue.value == "item:removelanguage") {
          ExperienceEditor.PipelinesUtil.executePipeline(context.app.RemoveLanguagePipeline, function () {
            ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.RemoveLanguage, context);
          });
        }
        
      }).execute(context);
    }
  };
});