define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ], function (Sitecore, ExperienceEditor, TranslationUtil) {
  return {
    priority: 1,
    execute: function (context) {
      ExperienceEditor.Dialogs.prompt(TranslationUtil.translateText(TranslationUtil.keys.Enter_a_new_display_name_for_the_item), context.currentContext.value, function (newDisplayName) {
        if (newDisplayName == null) {
          context.aborted = true;
          return;
        }

        context.currentContext.value = newDisplayName;
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ChangeDisplayName", function (response) {
          response.context.app.refreshOnItem(response.context.currentContext);
        }).execute(context);
      });
    }
  };
});