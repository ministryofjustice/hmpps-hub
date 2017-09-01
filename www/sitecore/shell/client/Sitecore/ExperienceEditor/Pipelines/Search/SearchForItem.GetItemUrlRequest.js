define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Search.GetItemUrlRequest", function (response) {
        if (!response.responseValue.value) {
            return;
        }

        window.top.location = response.responseValue.value;
    });
});