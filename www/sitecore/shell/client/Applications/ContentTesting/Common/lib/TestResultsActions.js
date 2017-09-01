define([
    "sitecore",
    "/-/speak/v1/contenttesting/DataUtil.js",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function(Sitecore, dataUtil, requestUtil) {
    var stopActionUrl = "/sitecore/shell/api/ct/Action/StopTest";
    var cancelActionUrl = "/sitecore/shell/api/ct/Action/CancelTest";

    return {
      stopTest: function(combination, callback, errorCallback, callbackContext, rulesToKeep) {
        if (!combination) {
          return;
        }

        var uri = dataUtil.composeUri(null);
        if (!uri) {
          return;
        }

        

        if (_.isArray(rulesToKeep)) {
          rulesToKeep = rulesToKeep.join("|");
        }

        var device = this._getDevice();

        var url = Sitecore.Helpers.url.addQueryParameters(stopActionUrl, {
          itemdatauri: uri,
          combination: combination,
          rulesToKeep: rulesToKeep || "",
          deviceId: device || ""
      });

        requestUtil.postData(url, callback, errorCallback, callbackContext);
      },

      cancelTest: function(callback, errorCallback, callbackContext) {
        var uri = dataUtil.composeUri(null);
        if (!uri) {
          return;
        }

        var device = this._getDevice();

        var url = Sitecore.Helpers.url.addQueryParameters(cancelActionUrl, {
          itemdatauri: uri,
          deviceId: device || ""
        });

        requestUtil.postData(url, callback, errorCallback, callbackContext);
      },

      _getDevice: function() {
        var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
        return params.deviceId;
      }
    };
});