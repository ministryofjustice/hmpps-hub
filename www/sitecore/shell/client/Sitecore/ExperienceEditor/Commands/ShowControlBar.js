define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.ShowControlBar =
  {
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      var isVisible = context.button.get("isChecked") == "1";
      scControlBar = isVisible;
      ExperienceEditorProxy.controlBarStateChange();
      return context.app.canExecute("ExperienceEditor.ControlBar.CanEnable", context.currentContext);
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        scControlBar = response.responseValue.value;
        ExperienceEditorProxy.controlBarStateChange();
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});