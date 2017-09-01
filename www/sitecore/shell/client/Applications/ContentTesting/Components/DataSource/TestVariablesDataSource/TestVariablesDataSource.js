define(["sitecore", "/-/speak/v1/contenttesting/RequestUtil.js"], function (Sitecore, requestUtil) {
  var actionUrl = "/sitecore/shell/api/ct/TestVariables/GetTestVariables";
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);

      var uri = params.uri;
      var device = params.device;

      this.set({
        itemuri: uri,
        multipleDevices: false,
        items: null,
        device: device
      });

      this.getTestVariables();
    },

    getTestVariables: function () {
      var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
        itemdatauri: this.get("itemuri"),
        deviceId: this.get("device")
      });

      var ajaxOptions = {
        url: url,
        context: this,
        cache: false,
        success: function (data) {
          if (data) {
            if (data.MultipleDevices) {
              this.set({
                multipleDevices: data.MultipleDevices,
                items: null
              });
            }
            else {
              this.set("items", data);
            }
          }
        }
      };
        
      requestUtil.performRequest(ajaxOptions);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  Sitecore.Factories.createComponent("TestVariablesDataSource", model, view, ".sc-TestVariablesDataSource");
});
