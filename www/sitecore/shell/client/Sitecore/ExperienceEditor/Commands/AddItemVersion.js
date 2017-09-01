define(["sitecore",
  "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
  "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"],
  function (Sitecore, ExperienceEditor, ExperienceEditorContext) {
  Sitecore.Commands.AddItemVersion =
  {
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.AddVersion.CanAddVersion", context.currentContext);
    },
    execute: function (context) {
      ExperienceEditor.modifiedHandling(true, function (isOk) {
        if (!ExperienceEditorContext.isModified || isOk) {
          ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.AddVersion.Execute", function(response) {
            var url = ExperienceEditor.Web.removeQueryStringParameter(ExperienceEditor.getPageEditingWindow().location.href, "sc_version");
            ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.Utility.removeCookie(response.responseValue.value);
            ExperienceEditor.navigateToUrl(url);
          }).execute(context);
        }
      });
    }
  };
});