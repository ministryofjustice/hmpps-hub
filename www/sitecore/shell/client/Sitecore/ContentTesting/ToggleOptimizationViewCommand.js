require.config({
  paths: {
    activeTestState: "/sitecore/shell/client/Sitecore/ContentTesting/ActiveTestState"
  }
});

define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "activeTestState"], function (Sitecore, ExperienceEditor, ActiveTestState) {
  Sitecore.Commands.ToggleOptimizationView =
  {
    registryKey: "/Current_User/Page Editor/Show/Optimization",

    canExecute: function (context, sourceControl) {
      var button = context.button;
      var hasTest = ActiveTestState && ActiveTestState.hasActiveTest(context);
      var self = this;
      
      ExperienceEditor.PipelinesUtil.generateRequestProcessor(
        "ExperienceEditor.ToggleRegistryKey.Get",
        function (response) {
          if (hasTest) {
            if (response.responseValue.value !== undefined && response.responseValue.value) {
              button.set("isPressed", true);
            }
            else if (Sitecore.Helpers.url.getQueryParameters(window.top.location.href)["sc_optimize"] == "true") {
              self.execute(context);
            }
          }
        },
        { value: this.registryKey }).execute(context);
        
      
      return hasTest;
    },

    execute: function (context) {
      var isTurnOn = false;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor(
        "ExperienceEditor.ToggleRegistryKey.Toggle",
        function (response) {
          response.context.button.set("isPressed", response.responseValue.value);
          isTurnOn = response.responseValue.value;
        },
        { value: this.registryKey }
      ).execute(context);

      context.currentContext.value = isTurnOn + "|" + encodeURIComponent(window.top.location.href);
      
      ExperienceEditor.PipelinesUtil.generateRequestProcessor(
        "OptimizationView.Toogle.GetUrl",
        function (response) {
          window.top.location.href = response.responseValue.value;
        }
      ).execute(context);
    }
  };
});