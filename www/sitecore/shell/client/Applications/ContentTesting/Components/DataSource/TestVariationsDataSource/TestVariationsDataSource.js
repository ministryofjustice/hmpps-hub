define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"
], function (Sitecore, requestUtil, PageEditorProxy) {
  var actionUrl = "/sitecore/shell/api/ct/TestVariables/GetTestVariableVariations";

  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var uri = params.uri;

      this.set({
        itemuri: uri,
        items: []
      });

      this.on("change:testid", this.getTestVariations, this);
    },

    getTestVariations: function () {
      var deviceId = PageEditorProxy.deviceId() || "";
      var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
        itemUri: this.get("itemuri"),
        deviceId: deviceId,
        testid: this.get("testid")
      });

      var ajaxOptions = {
        url: url,
        context: this,
        cache: false,
        success: function(data) {
          this.set("items", data);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
    }
  });

  Sitecore.Factories.createComponent("TestVariationsDataSource", model, view, ".sc-TestVariationsDataSource");
});
