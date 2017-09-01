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
      this.getRules();
    },
    
    getRules: function () {
      var deviceId = PageEditorProxy.deviceId();
      var uri = dataUtil.composeUri(this);
      var ajaxOptions = {
        cache: false,
        url: "/sitecore/shell/api/ct/Personalization/GetRules?itemDataUri=" + encodeURIComponent(uri) + "&deviceId=" + deviceId,
        context: this,
        success: function(data) {
          this.set({ "items": data.Items, "RulesCount": data.RulesCount, "ComponentCount": data.ComponentCount });
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

  Sitecore.Factories.createComponent("RulesDataSource", model, view, ".sc-RulesDataSource");
});
