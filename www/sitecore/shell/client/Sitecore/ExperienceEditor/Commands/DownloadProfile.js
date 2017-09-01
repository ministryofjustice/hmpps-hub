define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.DownloadProfile =
  {
    canExecute: function (context) {
      var isProfiling = ExperienceEditor.isDebugging() && ExperienceEditor.Web.getUrlQueryStringValue("sc_prof") == "1";
      return ExperienceEditor.canToggleDebug() && isProfiling;
    },
    execute: function (context) {
      context.currentContext.value = ExperienceEditor.Web.getUrlQueryStringValue("sc_prf");
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.DownloadDebugRequests.ExecuteDownloadProfile", function (response) {
        ExperienceEditor.Web.downloadFile(response.responseValue.value);
      }).execute(context);
    }
  };
});