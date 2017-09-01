define(["/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (ExperienceEditor) {
  return ExperienceEditor.PipelinesUtil.generateRequestProcessor(
    "ExperienceEditor.Social.SocialCenter.GetDialogUrl",
    function (response) {
      response.context.currentContext.value = response.responseValue.value;
    });
});