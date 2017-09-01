require.config({
  paths: {
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage",
    activeTestState: "/sitecore/shell/client/Sitecore/ContentTesting/ActiveTestState"
  }
});

define(["sitecore", "loadingImage", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "activeTestState"], function (Sitecore, loadingImage, ExperienceEditor, ActiveTestState) {
  Sitecore.Commands.Results =
  {
    canExecute: function (context, sourceControl) {
      return ActiveTestState && ActiveTestState.hasActiveTest(context);
    },

    execute: function (context) {
      var dialogPath = "/sitecore/client/Applications/ContentTesting/Pages/TestResults.aspx?"
        + "id=" + context.app.currentContext.itemId
        + "&la=" + context.app.currentContext.language
        + "&vs=" + context.app.currentContext.version
        + "&deviceId=" + context.app.currentContext.deviceId;

      var dialogFeatures = "dialogHeight: 800px;dialogWidth: 1100px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, "", dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }
      });


      // Show the loading image until dialog doesn't appeared
      if (loadingImage) {
        loadingImage.showElement();
        loadingImage.waitLoadingDialog("jqueryModalDialogsFrame", { height: 860, minWidth: 1100 });
      }
    }
  };
});