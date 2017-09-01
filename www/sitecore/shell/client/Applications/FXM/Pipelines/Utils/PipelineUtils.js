define([
    "sitecore",
    "/-/speak/v1/assets/q.js",
    "/-/speak/v1/FXM/Utils/ClassicDialogUtil.js"
], function (_sc, Q, _dialogUtil) {

  var handler = function (url, data, success, fail) {
        var token = $('input[name="__RequestVerificationToken"]').val();
        jQuery.ajax({
            url: url,
            data: {
              data: decodeURIComponent(decodeURIComponent(JSON.stringify(data))),
              __RequestVerificationToken: token
            },
            type: "POST",
            success: function(resp) {
                if (resp.error) {
                    fail(resp.errorMessage);
                } else {
                    success(resp.responseValue.value);
                }
            },
            error: fail
        });
    }

    return {
        serverPromiseProcessor: function(url, context, data, success, fail) {
            if (context.promise) {
                context.promise.then(function() {
                    handler(url, data, success, fail);
                });
            } else {
                var deferred = Q.defer();

                handler(url, data, function(resp) {
                    deferred.resolve(resp);
                    if (success) {
                        success(resp);
                    }
                }, function(resp) {
                    deferred.reject(resp);
                    if (fail) {
                        fail(resp);
                    }
                });

                context.promise = deferred.promise;
            }
        },

        dialogPromiseProcessor: function (context, features) {
            context.promise.then(function(url) {
                _dialogUtil.showModalDialog(url, '', features, null, window, context.complete);
            });
        }
    }
});