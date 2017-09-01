(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/ImportWizardDialog.js"]
    : ["sitecore", "./Dialogs/ImportWizardDialog/ImportWizardDialog"];
  define(dependencies, function (sitecore) {
    return {
      init: function (app) {
        this.App = app;
        app.insertRendering("{664BD429-0733-4E60-A41C-1D1F434DC96B}", { $el: $("body") }, function (showImportWizardDialog) {
          this["showImportWizardDialog"] = showImportWizardDialog;
        });
      },
      ImportWizardToXDB: function (mode, callback) {
        var completed = null;
        if (callback) {
          completed = function (listId) {
            if (callback) {
              callback(listId);
            }
          };
        }
        sitecore.trigger("import:wizard:dialog:show", mode, completed);
      }
    };
  });
})();