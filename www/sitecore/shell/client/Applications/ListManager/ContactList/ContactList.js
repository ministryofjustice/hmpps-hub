(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/ContactListDefinition.js"]
    : ["sitecore", "./ContactListDefinition"];
  define(dependencies, function (sitecore, contactListDefinition) {
    return sitecore.Definitions.App.extend(contactListDefinition);
  });
})();