define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"],
    function (Sitecore, ExperienceEditor, TranslationUtil) {
      return {
        priority: 3,
        execute: function (context) {
          context.suspend();
          ExperienceEditor.Dialogs.prompt(TranslationUtil.translateText(TranslationUtil.keys.Enter_the_filename_where_to_save_the_trace), context.currentContext.value, function (newName) {
            if (newName == null) {
              context.aborted = true;
              return;
            }

            context.currentContext.value = ExperienceEditor.Web.getUrlQueryStringValue("sc_trf") + "|" + newName;
            context.resume();
          });
        }
      };
    });