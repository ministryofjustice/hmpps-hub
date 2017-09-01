define(["sitecore"
], function (_sc) {
    return _sc.Definitions.App.extend({
        initialized: function () {

            this.on("button:ok", function () {
                this.closeDialog(1);
            });

            this.on("button:cancel", function () {
                this.closeDialog(-1);
            });
        }
    });
});