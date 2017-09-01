define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Rename.GetCurrentName", function (response) {
        response.context.currentContext.itemName = response.responseValue.value;
    });
});