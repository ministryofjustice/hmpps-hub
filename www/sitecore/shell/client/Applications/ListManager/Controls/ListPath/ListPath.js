(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/ListPathDefinition.js"]
    : ["sitecore", "./ListPathDefinition"];
  define(dependencies, function (sitecore, listPathDefinition) {
    var model = sitecore.Definitions.Models.ControlModel.extend(listPathDefinition.model);
    var view = sitecore.Definitions.Views.ControlView.extend(listPathDefinition.view);
    sitecore.Factories.createComponent("ListPath", model, view, ".sc-ListPath");
  });
})();