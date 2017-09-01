define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js",
  "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"
], function (Sitecore, dataUtil, requestUtil, PageEditorProxy) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("items", []);
      this.on("change:ruleSetId change:ruleId", this.getRule, this);
    },
    
    getRule: function () {
      if (this.get("isSilent"))
        return;

      var app = this;
      var deviceId = PageEditorProxy.deviceId();
      var ruleId = this.get("ruleId");
      var ruleSetId = this.get("ruleSetId");
      var uri = dataUtil.composeUri(this);
      var ajaxOptions = {
        cache: false,
        url: "/sitecore/shell/api/ct/Personalization/GetRuleData?" +
          "itemDataUri=" + encodeURIComponent(uri) +
          "&ruleSetId=" + ruleSetId +
          "&ruleId=" + ruleId +
          "&deviceId=" + deviceId,
        context: this,
        success: function(data) {
          app.set({ "conditions": data.Conditions });
          app.set({ "ruleOrigin": data.RuleOrigin });
          app.set({ "isInCurrentTest": data.IsInCurrentTest });
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });


  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      // Set initial settings
      this.model.set("itemId", this.$el.attr("data-sc-itemid") || null);
      this.model.set("language", this.$el.attr("data-sc-language") || "");
      this.model.set("version", this.$el.attr("data-sc-version") || 0);
    }
  });

  Sitecore.Factories.createComponent("PersonalizationRuleDataSource", model, view, ".sc-PersonalizationRuleDataSource");
});
