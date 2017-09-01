define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  return {
    priority: 1,
    execute: function (context) {
      var buttons = [];
      var registryKeys = "";
      $.each(context.app, function () {
        if (this.attributes === undefined
            || this.componentName !== "SmallCheckButton"
            || this.get("registryKey") === null
            || this.get("registryKey") === "")
          return;

        buttons.push(this);
        registryKeys += this.get("registryKey") + ",";
      });

      if (registryKeys == ""
        || buttons.length == 0) {
        return;
      }

      var checkBoxCommandProcessors = new Object();
      checkBoxCommandProcessors["EnableEditing"] = function(isChecked) {
         ExperienceEditorProxy.changeCapability("edit", isChecked);
      };
      checkBoxCommandProcessors["EnableDesigning"] = function(isChecked) {
         ExperienceEditorProxy.changeCapability("design", isChecked);
      };
      checkBoxCommandProcessors["ShowControlBar"] = function (isChecked) {
        scControlBar = isChecked;
        ExperienceEditorProxy.controlBarStateChange();
      };

      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKeys.Get", function (response) {
        var results = response.responseValue.value.split(",");
        for (var i = 0; i < results.length; i++) {
          if (!buttons[i]) continue;
          buttons[i].set("isChecked", results[i] == "True" ? "1" : "0");
          var commandProcessor = checkBoxCommandProcessors[buttons[i].get("command")];
          if (commandProcessor) {
            commandProcessor(results[i] == "True");
          }
        }
      }, { value: registryKeys.substring(0, registryKeys.length - 1) }).execute(context);
    }
  };
});