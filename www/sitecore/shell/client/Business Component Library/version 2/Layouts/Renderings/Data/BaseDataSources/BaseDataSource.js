(function (speak) {

  define([], function () {
    return {
      name: "BaseDataSource",

      loadData: function () {
        this.handleError({ name: "Error", message: "LoadData is not overridden" });
      },

      successHandler: function () {
        this.handleError({ name: "Error", message: "SuccessHandler is not overridden" });
      },

      performRequest: function (serverRequestUrl, providerItemProperties, serverRequestParameters, serverRequestOnSuccess) {
        "use strict";

        var self = this;
        this.IsBusy = true;

        if (this.QueryParameters) {
          serverRequestUrl += (serverRequestUrl.match(/\?/) ? '&' : '?') + this.QueryParameters;
        }

        var ajaxOptions = {
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          headers: {},
          data: this.getRequestDataString(providerItemProperties, serverRequestParameters),
          url: serverRequestUrl,
          success: function (data) {
            self.baseSuccessHandler(data, serverRequestOnSuccess);
          },
          error: function (response) {
            self.IsBusy = false;
            self.handleError({ name: "Error", message: "Server returned" + ": " + response.status + " (" + response.statusText + ")", response: response });
          }
        };

        var token = speak.utils.security.antiForgery.getAntiForgeryToken();
        ajaxOptions.headers[token.headerKey] = token.value;

        $.ajax(ajaxOptions);
      },

      baseSuccessHandler: function (data, serverRequestOnSuccess) {
        var jsonData = data;

        this.DynamicData = jsonData;

        if (jsonData.Messages) {
          this.Messages = jsonData.Messages;
        }

        this.successHandler(jsonData);

        this.IsBusy = false;

        if (jsonData.hasOwnProperty("Data")) {
          this.HasData = (jsonData.Data !== null);
          this.HasNoData = (jsonData.Data === null);
        }

        if (serverRequestOnSuccess) {
          serverRequestOnSuccess(jsonData);
        }
      },

      getRequestDataString: function (providerRequestData, serverRequestParameters) {
        var requestObject = {};

        requestObject = _.extend(providerRequestData, serverRequestParameters);

        _.each(requestObject, function (value, key, object) {
          if (typeof (value) === "object")
            object[key] = JSON.stringify(value);
          if (value === "") {
            delete object[key];
          }
        });

        return (requestObject);
      },

      removeNotUsedParameters: function (parameters) {
        return parameters.replace(/&?[^&?]+=(?=(?:&|$))/g, '');
      },

      handleError: function (errorObject) {
        this.HasData = false;
        this.HasNoData = true;
        this.trigger("error", errorObject);
      }
    };
  });
})(Sitecore.Speak);
