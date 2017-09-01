define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SetDateAndTime =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.PreviewDate.GetPreviewDateUrl", function (response) {
        ExperienceEditor.Dialogs.showModalDialog(response.responseValue.value, '', '', null, function (result) {
          if (!result) {
            return;
          }

          context.currentContext.value = result;
          ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.PreviewDate.SetDateValue", function () {
            ExperienceEditor.modifiedHandling(null, function(isOk) {
              window.top.location.reload();
            });
          }).execute(context);
        });
      }).execute(context);
    }
  };
});