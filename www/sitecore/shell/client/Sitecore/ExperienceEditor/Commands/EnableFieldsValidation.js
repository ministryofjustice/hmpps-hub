define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/ValidateFieldsUtil.js"
  ], function (Sitecore, ExperienceEditor, ValidationUtil) {
  Sitecore.Commands.EnableFieldsValidation =
  {
    contextButton: null,

    isEnabled: false,

    reEvaluate: function(context) {
      var clonedContext = ExperienceEditor.getContext().instance.clone(context);
      clonedContext.button = this.contextButton ? this.contextButton : null;

      var canValidate = this.canExecute(clonedContext);

      if (!this.contextButton) {
        return;
      }

      this.contextButton.set("isEnabled", canValidate);

      if (!Sitecore.Commands.EnableEditing.isEnabled) {
        ValidationUtil.deactivateValidation();
        if (!canValidate) {
          this.contextButton.set("isChecked", "0");
        }
      }
    },

    canExecute: function (context) {
      this.contextButton = context.button;

      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      if (context.currentContext.isReadOnly) {
        return false;
      }

      var isEditingEnabled = Sitecore.Commands.EnableEditing && Sitecore.Commands.EnableEditing.isEnabled;
      if (isEditingEnabled) {
        return true;
      }

      var editingCheckControl = ExperienceEditor.CommandsUtil.getControlsByCommand(ExperienceEditor.getContext().instance.Controls, "EnableEditing")[0];
      if (!editingCheckControl) {
        return false;
      }

      return editingCheckControl.model.get("isChecked") == "1";
    },

    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        var result = response.responseValue.value;
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.Commands.EnableFieldsValidation.isEnabled = result;
        if (result) {
          ValidationUtil.validateFields(context);
        } else {
          ValidationUtil.deactivateValidation();
        }
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});