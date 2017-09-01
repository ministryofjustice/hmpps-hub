define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.ShowDataSources =
  {
    commandContext: null,

    reEvaluate: function () {
      return this.canExecute(this.commandContext);
    },

    canExecute: function (context) {
      var that = this;

      if (!ExperienceEditor.isInMode("edit")
        || !context
        || !context.button
        || context.currentContext.isFallback) {
        return false;
      }

      var isAllowed = ExperienceEditor.isEditingAndDesigningAllowed();
      ExperienceEditor.on("onChromeUpdated", function () {
        that.setHighlightState(context);
      });

      context.button.set("isEnabled", isAllowed);
      this.setHighlightState(context);
      if (!this.commandContext) {
       this.commandContext = ExperienceEditor.getContext().instance.clone(context);
      }

      if (context.app
        && isAllowed
        && context.button.get("isChecked") === "1") {
        context.app.publishAffectedPagesNotification(context);
      }

      return isAllowed;
    },

    execute: function (context) {
      var that = this;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        that.setHighlightState(response.context);
      }, { value: context.button.get("registryKey") }).execute(context);
    },

    setHighlightState: function (context) {
      var className = "chromeWithDatasource";
      ExperienceEditor.ShowDataSources = ExperienceEditor.ShowDataSources || {};
      var isChecked = context.button.get("isChecked") !== "0" && context.button.get("isChecked") && context.button.get("isEnabled");
      isChecked = isChecked == null ? ExperienceEditor.ShowDataSources.isChecked : isChecked;
      ExperienceEditor.ShowDataSources.isChecked = isChecked || ExperienceEditor.ShowDataSources.isChecked;
      if (isChecked === "1" || isChecked === true) {
        var renderingsWithDatasources = ExperienceEditor.getPageEditingWindow().Sitecore.LayoutDefinition.getRenderingsWithDatasources();
        ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.ChromeManager.setClass(renderingsWithDatasources, className);
      } else {
        ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.ChromeManager.removeClass(className);
      }
    }
  };
});