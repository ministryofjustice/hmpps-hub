define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore , ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.AddComponent =
  {
    canExecute: function (context, parent) {
      $(ExperienceEditor.getPageEditingWindow().document).find(".scInsertionHandle").hide();
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        if (parent.initiator.componentName == 'QuickbarButton') {
          parent.initiator.set({ isVisible: false });
        } else {
          parent.initiator.set({ isEnabled: false });
        }

        return false;
      }

      return context.app.canExecute("ExperienceEditor.CanAddComponent", context.currentContext);
    },

    execute: function (context) {
      ExperienceEditorProxy.showRenderingTargets();
    }
  };
});