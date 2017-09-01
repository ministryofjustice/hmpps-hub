define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ], function (Sitecore, ExperienceEditor, TranslationUtil) {
  return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Insert", function (response) {
    var itemId = !response.responseValue.value ? null : response.responseValue.value.itemId;
    if (itemId == null || itemId.length <= 0) {
      ExperienceEditor.Dialogs.alert(TranslationUtil.translateText(TranslationUtil.keys.Could_not_create_item));
      response.context.aborted = true;
      return;
    }

    response.context.currentContext.itemId = itemId;
    response.context.app.refreshOnItem(response.context.currentContext, true, false, true);
  });
});