define
  (
    [
      "sitecore",
      "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
      "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"
    ], function (Sitecore, ExperienceEditor, ExperienceEditorContext) {
  return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LockItem", function (response) {
    if (response.context.currentContext.version != response.responseValue.value.Version) {
      response.context.app.refreshOnItem(response.context.currentContext, true);
    }

    var locked = response.responseValue.value.Locked;

    Sitecore.Commands.Lock.setButtonTitle(ExperienceEditorContext.instance, locked);
    ExperienceEditorContext.instance.currentContext.isLocked = locked;
    if (locked) {
      ExperienceEditorContext.instance.currentContext.isLockedByCurrentUser = true;
    }
  });
});