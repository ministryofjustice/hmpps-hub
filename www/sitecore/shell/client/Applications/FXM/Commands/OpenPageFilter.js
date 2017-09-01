define(["sitecore", "/-/speak/v1/FXM/ParamUtils.js"], function (_sc, _paramUtils) {
    _sc.Commands.OpenPageFilter =
    {
        pageMatcherUrl: "/sitecore/client/Applications/FXM/PageFilter",

        canExecute: function (context) {
            return true; 
        },
        execute: function (context) {
            var id = _paramUtils.getIdFromContext(context, false);
            var parentId = _paramUtils.getParentIdFromContext(context, false);

            var qsParams = {};

            if (id.valid) {
                qsParams.itemId = id.id;
            }

            if (parentId.valid) {
                qsParams.parentId = parentId.id;
            }

            var owner = !!context['owner'] ? context.owner : window;

            var newPage = _sc.Helpers.url.addQueryParameters(this.pageMatcherUrl, qsParams);

            var returnUrl = _sc.Helpers.url.getQueryParameters(window.location.href)['returnUrl'] || owner.location.href;
            newPage = _sc.Helpers.url.addQueryParameters(newPage, {returnUrl:returnUrl});

            owner.location = newPage;
        }
    };
});