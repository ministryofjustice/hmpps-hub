define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  return {
    priority: 1,
    execute: function (context) {
      try {
        ExperienceEditor.Web.updateHtml5Cache();
      } catch (err) {}
    }
  };
});