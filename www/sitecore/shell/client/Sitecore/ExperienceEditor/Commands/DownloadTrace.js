define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.DownloadTrace =
  {
    canExecute: function (context) {
      var isTracing = ExperienceEditor.isDebugging() && ExperienceEditor.Web.getUrlQueryStringValue("sc_trace") == "1";
      return ExperienceEditor.canToggleDebug() && isTracing;
    },
    execute: function (context) {
      context.currentContext.value = ExperienceEditor.Web.getUrlQueryStringValue("sc_trf");
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.DownloadDebugRequests.ExecuteDownloadTrace", function (response) {
        ExperienceEditor.Web.downloadFile(response.responseValue.value);
      }).execute(context);
    }
  };
});