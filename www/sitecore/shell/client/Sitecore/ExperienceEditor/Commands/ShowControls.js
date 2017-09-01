define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.ShowControls =
  {
    commandContext: null,
    isEnabled: false,
    reEvaluate: function () {
      this.canExecute(Sitecore.Commands.ShowControls.commandContext);
      if (Sitecore.Commands.ShowControls.commandContext) {
        Sitecore.Commands.ShowControls.commandContext.button.set("isEnabled", this.isEnabled);
      }
    },
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit")
        || !context
        || !context.button
        || context.currentContext.isFallback) {
        return false;
      }

      var isAllowed = ExperienceEditor.isEditingAndDesigningAllowed();

      ExperienceEditorProxy.changeShowControls(context.button.get("isChecked") == "1" && isAllowed);
      if (!Sitecore.Commands.ShowControls.commandContext) {
        Sitecore.Commands.ShowControls.commandContext = ExperienceEditor.getContext().instance.clone(context);
      }

      this.isEnabled = isAllowed;
      return this.isEnabled;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        ExperienceEditorProxy.changeShowControls(response.context.button.get("isChecked") == "1");
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});