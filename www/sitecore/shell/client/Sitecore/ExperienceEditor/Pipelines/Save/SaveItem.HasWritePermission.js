// NOTE: This request is obsolete and will be removed in the next product version.

define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Save.HasWritePermission");
});