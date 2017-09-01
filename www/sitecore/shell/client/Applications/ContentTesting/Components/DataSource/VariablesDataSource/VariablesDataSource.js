define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var singleActionUrl = "/sitecore/shell/api/ct/TestResults/GetVariable";
  var multipleActionUrl = "/sitecore/shell/api/ct/TestResults/GetVariables";

  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var device = params.deviceId;

      this.set({
        itemId: null,
        language: "",
        version: 0,
        device: device,
        items: []
      });

      this.on("change:itemId change:language change:version change:device", this.getVariables, this);
      this.getVariables();

      this.on("change:variableId", this.getVariable, this);
    },
    
    getVariable: function () {
      var variableId = this.get("variableId");
      var uri = dataUtil.composeUri(this);
      var url = Sitecore.Helpers.url.addQueryParameters(singleActionUrl, {
        itemdatauri: uri,
        variableId: variableId,
        deviceId: this.get("device")
      });

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          this.set("items", data.Items);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    },

    getVariables: function () {
      var uri = dataUtil.composeUri(this);
      var url = Sitecore.Helpers.url.addQueryParameters(multipleActionUrl, {
        itemdatauri: uri,
        deviceId: this.get("device")
      });

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          this.set("items", data.Items);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });


  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      // Set initial settings
      this.model.set({
        itemId: this.$el.attr("data-sc-itemid") || null,
        language: this.$el.attr("data-sc-language") || "",
        version: this.$el.attr("data-sc-version") || 0
      });
    }
  });

  Sitecore.Factories.createComponent("VariablesDataSource", model, view, ".sc-VariablesDataSource");
});
