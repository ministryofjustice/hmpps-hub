define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ], function (Sitecore, ExperienceEditor, TranslationUtil) {
  Sitecore.Commands.SelectVersion =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      var version = context.currentContext.argument;
      if (!version || version == '') {
        return;
      }

      context.currentContext.value = context.currentContext.itemId;
      context.currentContext.version = version;

      var url = ExperienceEditor.Web.setQueryStringValue(ExperienceEditor.getPageEditingWindow().location.href, "sc_version", version);
      url = ExperienceEditor.Web.setQueryStringValue(url, "sc_itemid", context.currentContext.itemId);
      var hasPresentation = context.app.canExecute("ExperienceEditor.Item.HasPresentation", context.currentContext);

      if (hasPresentation) {
        ExperienceEditor.navigateToUrl(url);
        return;
      }

      ExperienceEditor.Dialogs.confirm(TranslationUtil.translateTextByServer(TranslationUtil.keys.This_version_does_not_have_a_layout_assigned_Do_you_want_to_open_the_version), function (isOk) {
        if (!isOk) {
          return;
        }

        ExperienceEditor.navigateToUrl(url);
      });
    }
  };
});