define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SelectProfileCard =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.SelectProfileCardDialog.Url", function (response) {
        var responseParts = response.responseValue.value.split('|');
        if (responseParts.length != 2) {
          return;
        }

        var isMultiple = responseParts[0];
        var dialogUrl = responseParts[1];

        var dialogWidth = "805px;";
        var dialogHeight = "650px;";
        if (isMultiple) {
          dialogWidth = "1024px;";
        }

        var dialogFeatures = "dialogHeight: " + dialogHeight + "dialogWidth: " + dialogWidth;
        ExperienceEditor.Dialogs.showModalDialog(dialogUrl, "", dialogFeatures, null, function (result) {
          if (result == null) {
            return;
          }

          if (result == "refresh") {
            window.setTimeout(function () {
              response.context.app.refreshOnItem(context.currentContext);
            }, 20);
          }
        });
      }).execute(context);
    }
  };
});