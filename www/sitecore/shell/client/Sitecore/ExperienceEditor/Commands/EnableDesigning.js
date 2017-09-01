define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.EnableDesigning =
  {
    isEnabled: false,
    button: null,

    reEvaluate: function (context) {
      if (!Sitecore.Commands.EnableDesigning.button) {
        return;
      }

      context.button = Sitecore.Commands.EnableDesigning.button;
      Sitecore.Commands.EnableDesigning.button.set("isEnabled", Sitecore.Commands.EnableDesigning.canExecute(context));
      Sitecore.Commands.EnableDesigning.refreshAddComponentButtonState(context);
    },

    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      context.currentContext.value = context.button.get("registryKey");
      var canDesign = context.app.canExecute("ExperienceEditor.EnableDesigning.CanDesign", context.currentContext);
      var isChecked = context.button.get("isChecked") == "1";
      this.isEnabled = canDesign && isChecked;
      ExperienceEditorProxy.changeCapability("design", this.isEnabled);
      Sitecore.Commands.ShowControls.reEvaluate();
      Sitecore.Commands.ShowDataSources.reEvaluate();
      if (!Sitecore.Commands.EnableDesigning.button) {
        Sitecore.Commands.EnableDesigning.button = context.button;
      }

      return canDesign;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.Commands.EnableDesigning.isEnabled = response.responseValue.value == "1";
        ExperienceEditorProxy.changeCapability("design", response.context.button.get("isChecked") == "1");
        Sitecore.Commands.EnableDesigning.refreshAddComponentButtonState(response.context);
        Sitecore.Commands.ShowControls.reEvaluate();
        Sitecore.Commands.ShowDataSources.reEvaluate();
      }, { value: context.button.get("registryKey") }).execute(context);
    },

    refreshAddComponentButtonState: function(context) {
      if (Sitecore.Commands.AddComponent) {
        var addComponents = ExperienceEditor.CommandsUtil.getControlsByCommand(ExperienceEditor.getContext().instance.Controls, "AddComponent");
        var buttonEnabled = Sitecore.Commands.AddComponent.canExecute(context);
        $.each(addComponents, function () {
          this.model.set({ isEnabled: buttonEnabled });
        });
      }
    }
  };
});