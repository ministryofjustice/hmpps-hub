define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ], function (Sitecore, ExperienceEditor, TranslationUtil) {
  return {
    priority: 4,
    execute: function (context) {
      context.suspend();
      ExperienceEditor.Dialogs.prompt(TranslationUtil.translateText(TranslationUtil.keys.Enter_a_new_name_for_the_item), context.currentContext.itemName.trim(), function (newName) {
        if (newName == null) {
          context.aborted = true;
          return;
        }

        context.currentContext.value = newName;
        context.resume();
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Rename.ValidateNewName").execute(context);
      });
    }
  };
});