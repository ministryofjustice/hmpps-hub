define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
      url: function(context) { return "/sitecore/client/Applications/ExperienceEditor/Dialogs/InsertPage/?itemId=" + context.currentContext.itemId; },
      features: "dialogHeight: 600px;dialogWidth: 800px; ignoreSpeakSizes: true;",
      onSuccess: function (context, dialogResponse) {
        var responseArray = dialogResponse.split(',');
        if (responseArray.length != 2) {
          context.aborted = true;
          return;
        }
        context.currentContext.templateItemId = responseArray[0];
        context.currentContext.name = responseArray[1];
      }
    });
});