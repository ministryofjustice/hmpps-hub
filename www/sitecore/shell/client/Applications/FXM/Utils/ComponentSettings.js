var fxmComponentSettings;
define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (sitecore, experienceEditor) {
  if (fxmComponentSettings == null) {
    experienceEditor.Web.postServerRequest("ExperienceEditor.FXM.GetComponentSettings", {}, function (response) {
      fxmComponentSettings = response.responseValue.value;
    });
  }

  return fxmComponentSettings;
});