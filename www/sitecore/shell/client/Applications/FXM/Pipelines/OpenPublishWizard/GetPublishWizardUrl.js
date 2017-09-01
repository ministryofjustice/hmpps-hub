define([
    "sitecore",
    "/-/speak/v1/assets/q.js",
    "/-/speak/v1/FXM/ParamUtils.js"
], function (_sc, Q, _paramUtils) {

    var publishUrl = "/sitecore/shell/Applications/Publish.aspx";

    return {
        execute: function (context) {

            var itemId = context.id ? context.id : _paramUtils.getIdFromContext(context, true).id;

            var dialogPath = publishUrl;
            if (itemId) {
                dialogPath = publishUrl + "?id=" + itemId;
            }

            context.promise = Q(dialogPath);
        }
    };
});