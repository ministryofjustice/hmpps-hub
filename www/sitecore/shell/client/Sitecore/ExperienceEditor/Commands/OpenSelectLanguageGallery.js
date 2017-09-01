define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.OpenSelectLanguageGallery =
  {
    canExecute: function (context) {
      var queryString = "?itemId=" + context.currentContext.itemId +
        "&database=" + context.currentContext.database +
        "&la=" + context.currentContext.language +
        "&vs=" + context.currentContext.version;

      context.button.set("galleryUrlQueryString", queryString);

      return true;
    },

    execute: function (context) {
    }
  };
});
