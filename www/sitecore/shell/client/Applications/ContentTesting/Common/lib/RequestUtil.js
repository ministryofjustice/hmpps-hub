define([
    "sitecore"
  ], function (Sitecore) {
  return {
    performRequest: function(options) {
      var token = Sitecore.Helpers.antiForgery.getAntiForgeryToken();
      
      if (options.headers == undefined) {
        options.headers = { };
      }
      
      options.headers[token.headerKey] = token.value;

      $.ajax(options);
    },

    postData: function (url, callback, errorCallback, callbackContext) {
      var ajaxOptions = {
        type: "POST",
        cache: false,
        url: url,
        context: this,
        success: function (data) {
          callback.call(callbackContext, data);
        },
        error: function (req, status, error) {
          console.log("Ajax call failed");
          console.log(status);
          console.log(error);
          console.log(req);

          if (errorCallback) {
            errorCallback.call(callbackContext);
          }
        }
      };

      this.performRequest(ajaxOptions);
    }
  };
});