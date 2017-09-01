define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Move.RepairLinks", function (response) {
        response.context.app.refreshOnItem(response.context.currentContext);
    });
});