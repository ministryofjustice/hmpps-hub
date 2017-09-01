define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Delete.ExecuteRequest", function (response) {
        response.context.currentContext.itemId = response.responseValue.value;
        response.context.app.refreshOnItem(response.context.currentContext);
    });
});