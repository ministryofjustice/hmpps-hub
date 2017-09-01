define(["sitecore", "/-/speak/v1/FXM/ParamUtils.js"], function (_sc, _paramUtils) {
    _sc.Commands.OpenDomainMatcher =
    {
        domainMatcherUrl: "/sitecore/client/Applications/FXM/DomainDashboard/DomainMatcher",

        canExecute: function (context) {
            return true; 
        },
        execute: function (context) {
            var id = _paramUtils.getIdFromContext(context, true);
            var qsParams = {};

            if (id.valid) {
                qsParams.itemId = id.id;
            }

            qsParams.edit = true;
            if (context && (typeof context.edit) === "boolean") {
                qsParams.edit = context.edit;
            }

            window.location = _sc.Helpers.url.addQueryParameters(this.domainMatcherUrl, qsParams);
        }
    };
});