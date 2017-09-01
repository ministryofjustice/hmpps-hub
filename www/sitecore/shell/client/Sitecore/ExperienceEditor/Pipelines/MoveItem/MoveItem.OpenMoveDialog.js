define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    return ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return "/sitecore/shell/Applications/Dialogs/Move to.aspx?fo=" + context.currentContext.itemId + "& sc_content=" + context.currentContext.database; },
        features: "dialogHeight: 700px;dialogWidth: 800px;",
        onSuccess: function (context, targetItemId) {
            context.currentContext.targetItemId = targetItemId;
        }
    });
});