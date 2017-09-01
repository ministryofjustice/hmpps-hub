define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return "/sitecore/shell/default.aspx?" + context.currentContext.value; },
        features: "dialogHeight: 600px;dialogWidth: 500px;",
        onSuccess: function (context, preset) {
            context.currentContext.value = preset;
        }
    });
});