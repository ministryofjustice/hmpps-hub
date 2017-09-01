(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/dialogs/importwizarddialog/importwizarddialogdefinition.js"]
    : ["sitecore", "./Dialogs/ImportWizardDialog/ImportWizardDialogDefinition"];

  define(dependencies, function (sitecore, importWizardDialog) {
    return sitecore.Definitions.App.extend(importWizardDialog);
  });
})();