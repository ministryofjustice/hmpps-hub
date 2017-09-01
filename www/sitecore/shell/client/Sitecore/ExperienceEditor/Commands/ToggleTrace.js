define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.ToggleTrace =
  {
    canExecute: function (context) {
      var pressed = ExperienceEditor.isDebugging() && ExperienceEditor.Web.getUrlQueryStringValue("sc_trace") == "1";
      context.button.set({ isPressed: pressed });
      return ExperienceEditor.canToggleDebug();
    },
    execute: function (context) {
      context.currentContext.value = encodeURIComponent(ExperienceEditor.getPageEditingWindow().location);
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleDebugRequests.ExecuteToggleTrace", function (response) {
        ExperienceEditor.getPageEditingWindow().location = response.responseValue.value;
      }).execute(context);
    }
  };
});