define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
], function (_sc, _legacy, $sc, ExperienceEditor, TranslationUtil) {
    var pagePath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/CreateElementReplacer";
    _sc.Commands.CreateReplacer =
    {
        canExecute: function (context) {
            // TODO: validate is allowed
            return true; 
        },
        execute: function (context) {

            // context should have callback

            var data = {
                selector: context.selector,
                position: context.position
            }

            var dialogPath = _sc.Helpers.url.addQueryParameters(pagePath, data);
            var dialogFeatures = "dialogHeight:500;dialogWidth:700;ignoreSpeakSizes:true";

            ExperienceEditor.Dialogs.showModalDialog(dialogPath, null, dialogFeatures, null, function (data) {
                if (context.callback) {
                    context.callback(data);

                    if (data != null) {
                        _legacy.PageModes.PageEditor.setModified(true);
                        ExperienceEditor.getContext().isModified = true;

                        var message = TranslationUtil.translateTextByServer("The FXM function you have placed on this page has been saved.");
                        var actionMessage = "";
                        var actionClick = "";

                        _sc.ExperienceEditor.Context.instance.NotificationBar.addMessage("notification", {
                            text: message,
                            closable: false,
                            actions: [{
                                text: actionMessage,
                                action: actionClick
                            }]
                        });

                        _sc.ExperienceEditor.Context.instance.setHeight();
                    }
                }
            });
        }
    };
});