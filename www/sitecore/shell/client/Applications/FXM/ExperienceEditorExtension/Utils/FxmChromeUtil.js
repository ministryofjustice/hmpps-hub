define([
"/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
"/-/speak/v1/ExperienceEditor/ExperienceEditor.js"
], function (fxm, experienceEditor) {
  return {
    openEditClientActionPropertiesDialog: function (chrome) {
      var id = chrome.element.attr('data-sc-id');
      var dialogPath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/CaptureClientAction/?id=" + encodeURIComponent(id);
      var dialogFeatures = "dialogHeight:500;dialogWidth:700;ignoreSpeakSizes:true";

      experienceEditor.Dialogs.showModalDialog(dialogPath, null, dialogFeatures, null, function (data) {
        if (!data) {
          return;
        }

        fxm.updateClientAction(data, true);
      });
    }
  };
});