define([
  "sitecore",
  "/-/speak/v1/contenttesting/RequestUtil.js",
  "/-/speak/v1/contenttesting/DataUtil.js"],
  function (Sitecore, requestUtil, dataUtil) {
    var actionUrlGetDescription = "/sitecore/shell/api/ct/ContentTesting/GetExperienceDescription";

    return {
      getExperienceDescription: function (itemDataUri, deviceId, combination, callback) {

        if (!itemDataUri) {
          itemDataUri = dataUtil.composeUri();
          if (!itemDataUri) {
            return;
          }
        }

        if (!deviceId) {
          var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
          deviceId = params.deviceId;
        }

        var url = Sitecore.Helpers.url.addQueryParameters(actionUrlGetDescription, {
          itemDataUri: itemDataUri || "",
          deviceId: deviceId || "",
          combination: combination || ""
        });

        var ajaxOptions = {
          cache: true,
          url: url,
          context: this,
          success: function(data) {
            if (data) {
              callback(data);
            }
          }
        };

        requestUtil.performRequest(ajaxOptions);
      }
    };
  });