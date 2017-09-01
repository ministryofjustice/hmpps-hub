require.config({
  paths: {
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage",
    activeTestState: "/sitecore/shell/client/Sitecore/ContentTesting/ActiveTestState"
  }
});

define(["sitecore", "loadingImage", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "activeTestState"], function (Sitecore, loadingImage, ExperienceEditor, ActiveTestState) {
  Sitecore.Commands.CreatePageTest =
  {
    canExecute: function(context, sourceControl) {
	  var versioncount = 0;
	  ExperienceEditor.PipelinesUtil.generateRequestProcessor("Optimization.ItemVersions.Count", function (response) {
        versioncount = response.responseValue.value;
      }, context.currentContext).execute(context);
	  
	  return !(ActiveTestState && ActiveTestState.hasActiveTest(context)) && versioncount > 0;
    },

    execute: function(context) {
      var dialogPath = Sitecore.Helpers.url.addQueryParameters("/sitecore/client/Applications/ContentTesting/Pages/CreatePageTest.aspx", {
        id: context.app.currentContext.itemId,
        la: context.app.currentContext.language,
        vs: context.app.currentContext.version
      });

      var dialogFeatures = "dialogHeight: 800px;dialogWidth: 1000px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }
      });

      // Show the loading image until dialog doesn't appeared
      if (loadingImage) {
        loadingImage.showElement();
        loadingImage.waitLoadingDialog("jqueryModalDialogsFrame", { height: 760, minWidth: 1000 });
      }
    }
  };
});