define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.AspNetTrace =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.AspNetTrace.CanOpen", context.currentContext) && ExperienceEditor.canToggleDebug();
    },
    execute: function (context) {
      window.open('/trace.axd', '_blank', 'location=0,menubar=0,status=0,toolbar=1,resizable=1,scrollbars=yes');
    }
  };
});
