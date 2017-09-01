require.config({
  paths: {
    "loadingImage": "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "loadingImage", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, loadingImage, ExperienceEditor) {
  Sitecore.Commands.Personalization =
  {
    canExecute: function (context, sourceControl) {
      // TODO: SKYNET:
      var canExecute = false;
      canExecute = context.app.canExecute("ContentTesting.PersonalizationGallery.CanExecute", context.currentContext);
     
      return canExecute;
    },

    execute: function (context) {
      var sourceNode = $("[data-sc-id='" + context.button.viewModel.$el.attr("data-sc-id") + "']")[0];
      if (!sourceNode) {
        return;
      }
      
      var dialogPath = "/sitecore/client/Applications/ContentTesting/Pages/Rules.aspx?"
        + "id=" + context.app.currentContext.itemId
        + "&la=" + context.app.currentContext.language
        + "&vs=" + context.app.currentContext.version;

      var dialogFeatures = "dialogHeight: 800px;dialogWidth: 1000px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }
      });

      // Show the loading image until dialog doesn't appeared
      loadingImage.showElement();
      loadingImage.waitLoadingDialog("jqueryModalDialogsFrame", { height: 870, minWidth: 1000 });

     }
    };
});