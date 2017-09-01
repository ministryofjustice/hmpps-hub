(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/DashboardDefinition.js"]
    : ["sitecore", "./DashboardDefinition"];
  define(dependencies, function (sitecore, dashboardDefinition) {
    return sitecore.Definitions.App.extend(dashboardDefinition);
  });
})();