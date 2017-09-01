define(["sitecore"], function (_sc) {
    return {
        execute: function (context) {
            if (context.navigator) {
                return;
            }

            if (!context.urlParam) {
                context.urlParam = 'returnUrl';
            }

            var location = _sc.Helpers.url.getQueryParameters(window.location.href)[context.urlParam];

            if (location) {
                context.navigator = function() {
                    window.location = location;
                };
            }
        }
    };
});