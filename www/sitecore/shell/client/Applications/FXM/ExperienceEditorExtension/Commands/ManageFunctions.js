define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    Sitecore.Commands.ManageFunctions =
    {
        canExecute: function (context) {
            return true;
        },
        execute: function (context) {

            var dialogPath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/ManageFunctions";
            var dialogFeatures = "dialogHeight:450;dialogWidth:700;ignoreSpeakSizes:true";

            ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function(result) {
                if (result) {
                    window.top.location.reload();
                }
            });
        }
    };
});