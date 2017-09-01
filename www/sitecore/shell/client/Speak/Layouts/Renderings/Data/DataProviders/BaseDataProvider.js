define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "BaseDataProvider",
    base: "ControlBase",
    selector: "script[type='text/x-sitecore-basedataprovider']",
    attributes: [
        { name: "data", defaultValue: null },
        { name: "messages", defaultValue: null },
        { name: "dataUrl", defaultValue: null},
        { name: "queryParameters", defaultValue: null },
        { name: "hasData", value: false },
        { name: "hasNoData", defaultValue: false },
        { name: "isBusy", defaultValue: false }
    ],

    initialize: function () {
    },

    getData: function () {
      this.handleError({ name: "Error", message: "GetData is not overridden" });
    },
    
    successHandler: function() {
      this.handleError({ name: "Error", message: "SuccessHandler is not overridden" });
    },    

    performRequest: function (serverRequestUrl, providerItemProperties, serverRequestParameters, serverRequestOnSuccess) {
      "use strict";

      var self = this;
      this.model.set("isBusy", true);

      var ajaxOptions = {
        dataType: "json",

        headers: {},
        data: this.getRequestDataString(providerItemProperties, serverRequestParameters, this.model.get("queryParameters")),
        url: serverRequestUrl,
        success: function(data) {
          self.baseSuccessHandler(data, serverRequestOnSuccess);
        },
        error: function(response) {
          self.handleError({ name: "Error", message: self.$el.data("sc-serverreturn") + ": " + response.status + " (" + response.statusText + ")", response: response });
        }
      };

      var token = _sc.Helpers.antiForgery.getAntiForgeryToken();
      ajaxOptions.headers[token.headerKey] = token.value;

      $.ajax(ajaxOptions);
    },

    baseSuccessHandler: function (data, serverRequestOnSuccess) {
      var jsonData = data;

      this.model.set("data", jsonData.data);

      if (jsonData.messages) {
        this.model.set("messages", jsonData.messages);
      }
      
      this.successHandler(jsonData);
      
      this.model.set("isBusy", false);
      this.model.set("hasData", jsonData.data !== null);
      this.model.set("hasNoData", jsonData.data === null);

      if (serverRequestOnSuccess) {
        serverRequestOnSuccess(jsonData);
      }
    },
    
    getRequestDataString: function (providerRequestData, serverRequestParameters, queryParameters) {
      var requestString = "",
        queryParametersString = queryParameters || "";

      requestString = this.removeNotUsedParameters($.param(providerRequestData));

      if (serverRequestParameters) {
        var serverRequestParametersString = this.removeNotUsedParameters($.param(serverRequestParameters));
        
        if (serverRequestParametersString.substr(0, 1) !== "&") {
          serverRequestParametersString = "&" + serverRequestParametersString;
        }

        requestString = requestString + serverRequestParametersString;
      }
      
      if (queryParameters) {
        requestString = requestString + "&" + queryParametersString;
      }
      
      return (requestString);
    },
    
    removeNotUsedParameters: function(parameters) {
      return parameters.replace(/&?[^&?]+=(?=(?:&|$))/g, '');
    },
    
    handleError: function (errorObject) {
      this.model.set("hasData", false);
      this.model.set("hasNoData", true);
      this.model.trigger("error", errorObject);
    }
  });
});