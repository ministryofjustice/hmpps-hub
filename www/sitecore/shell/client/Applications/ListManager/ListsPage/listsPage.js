(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/listsPageDefinition.js"]
    : ["sitecore", "./listsPageDefinition"];
  define(dependencies, function (sitecore, listsPageDefinition) {
    return sitecore.Definitions.App.extend(listsPageDefinition);
  });
})();