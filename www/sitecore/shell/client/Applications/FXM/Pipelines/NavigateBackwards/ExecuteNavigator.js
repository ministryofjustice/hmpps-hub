define(["sitecore"], function (_sc) {
    return {
        execute: function (context) {
            if (!context.navigator) {
                return;
            }

            context.navigator();
        }
    };
});