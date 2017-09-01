define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"], function (Sitecore, ExperienceEditor, ExperienceEditorContext) {
  Sitecore.Factories.createBaseComponent({
    name: "CommandDependency",

    base: "ControlBase",

    selector: ".sc-commandDependency",

    attributes: [
        { name: "ID", value: "$el.data:sc-id" }
    ],

    initialize: function () {
      this._super();

      this.model.set("command", this.$el.data("sc-command"));
      this.model.set("dependantCommands", this.$el.data("sc-dependantcommands"));
    },

    runDependenciesCanExecute: function(context) {
      var that = this;
      var dependantCommands = this.model.get("dependantCommands").split('|');

      var allControls = [];
      var pageCodes = ["sitecore"];

      for (var i = 0; i < dependantCommands.length; i++) {
        var controls = ExperienceEditor.CommandsUtil.getControlsByCommand(ExperienceEditorContext.instance, dependantCommands[i]);
        for (var j = 0; j < controls.length; j++) {
          var control = controls[j];
          if (!control
          || control.get === undefined
          || control.get("command") === undefined
          || control.componentName === undefined
          || control.componentName === "Command"
          || control.componentName === "CommandDependency") {
            continue;
          }

          var pageCodeScriptUrl = ExperienceEditorContext.instance.getPageCodeScriptFileUrl(control);
          if (!pageCodeScriptUrl || pageCodeScriptUrl == "") {
            continue;
          }

          allControls.push(control);
          pageCodes.push(pageCodeScriptUrl);
        }
      }

      if (pageCodes.length < 1) {
        return;
      }

      pageCodes = pageCodes.filter(function(item, position) {
        return pageCodes.indexOf(item) == position;
      });

      require(pageCodes, function () {
        ExperienceEditorContext.instance.disableButtonClickEvents();
        jQuery.each(allControls, function() {
          var commandName = this.get("command");
          if (!commandName && commandName == "") {
            return;
          }

          var commandInstance = Sitecore.Commands[commandName];
          if (!commandInstance) {
            return;
          }

          context.button = this;
          this.set({
            isEnabled: commandInstance.canExecute(context, {
              command: commandInstance,
              initiator: this
            })
          });
        });
        ExperienceEditorContext.instance.enableButtonClickEvents();
      });
    }
  });
});