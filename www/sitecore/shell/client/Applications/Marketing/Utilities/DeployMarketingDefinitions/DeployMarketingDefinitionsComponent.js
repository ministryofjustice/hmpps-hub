define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "DeployMarketingDefinitions",
    base: "ControlBase",
    selector: ".sc-DeployMarketingDefinitions",
    attributes: [
      { name: "isBusy", defaultValue: false },
      { name: "deploymentComplete", defaultValue: false },
      { name: "deploymentError", defaultValue: false }
    ],

    extendModel: {
    },

    initialize: function () {
      var renderingId = this.model.get("name"),
        deployButton = this.app[renderingId + "btnDeploy"];

      deployButton.on("click", function () {
        this.deployDefinitions();
      }, this); 
    },

    afterRender: function () {
      
    },
    
    deployDefinitions: function () {
      var renderingId = this.model.get("name");
      var self = this;
      var definitionTypes = [];
      
      var campaigns = this.app[renderingId + "cbCampaigns"].get("isChecked");
      if (campaigns)
        definitionTypes.push("campaigns");

      var funnels = this.app[renderingId + "cbFunnels"].get("isChecked");
      if (funnels)
        definitionTypes.push("funnels");
      
      var goals = this.app[renderingId + "cbGoals"].get("isChecked"); 
      if (goals)
        definitionTypes.push("goals");
      
      var assets = this.app[renderingId + "cbMarketingAssets"].get("isChecked");
      if (assets)
        definitionTypes.push("marketingassets");
      
      var outcomes = this.app[renderingId + "cbOutcomes"].get("isChecked");
      if (outcomes)
        definitionTypes.push("outcomes");
      
      var publishTaxonomies = this.app[renderingId + "cbTaxonomies"].get("isChecked");
      
      jQuery.ajax({				
          type: "POST",
          url: "/api/sitecore/DeployMarketingDefinitions/DeployDefinitions",
          data: { "definitionTypes": JSON.stringify(definitionTypes), "publishTaxonomies": publishTaxonomies },
          beforeSend: function () {
              self.model.set("isBusy", true);
          },
          success: function (result) {
              if (result.success && result.jobName) {
                  deployRequestWithRetries(result.jobName);
              }
          },
          error: function () {
              self.model.set("deploymentError", true);
              self.model.set("isBusy", false);
          },
      });

      var deployRequestWithRetries = function (jobName) {
            jQuery.ajax({
                type: "POST",
                url: "/api/sitecore/DeployMarketingDefinitions/GetDeployDefinitionsJobStatus",
                data: { "jobName": jobName },
                success: function (result) {
                    if (result.completed === true) {
                        self.model.set("deploymentComplete", true);
                        self.model.set("isBusy", false);
                    } else {
                        self.model.set("isBusy", true);
                        setTimeout(function () { deployRequestWithRetries(jobName); }, 1000);
                    }
                },
                error: function() {
                    self.model.set("deploymentError", true);
                    self.model.set("isBusy", false);
                }
            });
        };
    }
  });
});