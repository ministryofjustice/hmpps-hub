(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/commonListPagesDefinition.js"]
    : ["sitecore", "../commonListPagesDefinition"];
  define(dependencies, function (sitecore, commonListPagesDefinition) {
    return sitecore.Definitions.App.extend(commonListPagesDefinition);
  });
})();