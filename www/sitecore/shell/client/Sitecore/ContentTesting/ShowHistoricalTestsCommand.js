require.config({
  paths: {
    "loadingImage": "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "loadingImage", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, loadingImage, ExperienceEditor) {
  Sitecore.Commands.HistoricalTests =
  {
    canExecute: function (context) {
      var testCount = context.app.canExecute("Optimization.HistoricalTests.Count", context.currentContext);
      var outputEl = $("a[data-sc-id='Historical-Tests'] span");
      var counterSpan = "<span> (" + testCount + ")</span>";

      if (testCount === 0) {
        outputEl.children().remove();
      } else {
        if (outputEl.children().length === 0)
          outputEl.append(counterSpan);
        else
          outputEl.children().html(counterSpan);
      }
      return true;
    },

    execute: function (context) {
      var dialogPath = "/sitecore/client/Applications/ContentTesting/Pages/HistoricalTests";
      dialogPath = Sitecore.Helpers.url.addQueryParameters(dialogPath, {
        id: context.currentContext.itemId,
        vs: context.currentContext.version,
        la: context.currentContext.language
      });
      
      var dialogFeatures = "dialogHeight: 600px;dialogWidth: 500px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }
      });

      // Show the loading image until dialog doesn't appeared
      loadingImage.showElement();
      loadingImage.waitLoadingDialog("jqueryModalDialogsFrame");

    }
  };
});