define(["/-/speak/v1/contenttesting/RequestUtil.js"], function(requestUtil) {
  var startTestActionUrl = "/sitecore/shell/api/ct/CreateTestDialog/StartTest";

  return {
    startTest: function(data, successCallback) {
      var ajaxOptions = {
        type: "POST",
        url: startTestActionUrl,
        context: this,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data),
        success: successCallback,
        error: function (request, status, error) {
          console.log("Ajax call failed");
          console.log(status);
          console.log(error);
          console.log(request);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  };
});