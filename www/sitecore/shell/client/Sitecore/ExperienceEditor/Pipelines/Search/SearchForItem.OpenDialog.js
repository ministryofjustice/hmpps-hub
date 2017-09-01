define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return context.currentContext.value; },
        features: "dialogHeight: 700px;dialogWidth: 1300px;",
        onSuccess: function (context, itemId) {
            context.currentContext.value = itemId;
        }
    });
});