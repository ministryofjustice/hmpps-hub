define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "DeployMarketingDefinition",
    base: "ControlBase",
    selector: ".sc-DeployMarketingDefinition",
    attributes: [
      { name: "isBusy", defaultValue: true },
      { name: "deploymentComplete", defaultValue: false },
      { name: "deploymentError", defaultValue: false }
    ],

    extendModel: {
    },

    initialize: function () {
    },

    afterRender: function () {
      this.deployDefinition();
    },

    deployDefinition: function () {
      var self = this;

      var definitionId = Sitecore.Helpers.url.getQueryParameters(window.location.href)['id'];
      if (!Sitecore.Helpers.id.isId(definitionId))
        return;

      var language = Sitecore.Helpers.url.getQueryParameters(window.location.href)['la'];

      jQuery.ajax({
        type: "POST",

        url: "/api/sitecore/DeployMarketingDefinition/DeployDefinition",
        data: { "definitionId": definitionId, "language": language },
        beforeSend: function () {
          self.model.set("isBusy", true);
        },
        success: function (success) {
          if (success) {
            self.model.set("deploymentComplete", true);
          } else {
            self.model.set("deploymentError", true);
          }
        },
        error: function () {
          self.model.set("deploymentError", true);
        },
        complete: function () {
          self.model.set("isBusy", false);
        }
      });
    }
  });
});