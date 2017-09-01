define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Save.CallServerSavePipeline", function () {
    ExperienceEditor.getContext().isModified = false;
    ExperienceEditor.getContext().isContentSaved = true;
    if (!ExperienceEditor.getContext().instance.disableRedirection) {
      ExperienceEditor.getPageEditingWindow().location.reload();
    }

    ExperienceEditor.getContext().instance.disableRedirection = false;
  });
});