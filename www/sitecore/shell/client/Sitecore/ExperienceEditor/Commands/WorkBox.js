define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"], function (Sitecore, ExperienceEditor, EContext) {
    Sitecore.Commands.WorkBox =
    {
        canExecute: function(context) {
            return true;
        },
        execute: function (context) {
          var workboxDialogTitle = context.app.canExecute("ExperienceEditor.Workbox.GetDialogTitle", context.currentContext);
          var dialogPath = "/sitecore/shell/Applications/Workbox/default.aspx?fo=" + context.currentContext.itemId + "&la=" + context.currentContext.language + "&vs=" + context.currentContext.version + "&pa=2&mo=media";
          var dialogFeatures = "dialogHeight:700px;dialogWidth:1200px;header:" + workboxDialogTitle + ";";
          ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures);
        }
    };
});