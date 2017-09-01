(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/selectcontactlistdialogdefinition.js"]
    : ["sitecore", "./SelectContactListDialogDefinition"];
  define(dependencies, function (sitecore, selectContactListDialogDefinition) {
    return sitecore.Definitions.App.extend(selectContactListDialogDefinition);
  });
})();

