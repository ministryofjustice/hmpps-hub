define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    Sitecore.Commands.SetDeviceSimulator =
    {
        canExecute: function (context) {
            return ExperienceEditor.isInMode("preview");
        },

        execute: function (context) {
            var deviceSimulatorId = context.currentContext.argument;
            if (deviceSimulatorId === undefined | deviceSimulatorId.length <= 0) {
                return;
            }

            var simulatorCookie = "sc_simulator_id=" + deviceSimulatorId + "; path=/";
            window.document.cookie = simulatorCookie;
            ExperienceEditor.getPageEditingWindow().document.cookie = simulatorCookie;

            context.app.refreshOnItem(context.currentContext);
        }
    };
});
