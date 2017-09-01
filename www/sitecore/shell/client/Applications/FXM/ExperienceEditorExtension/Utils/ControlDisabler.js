define(["sitecore"], function(_sc) {

    var ctor = function (context) {

        var lastHandled = [];
        var lastEnabled = null;

        function processList(whitelist, enable) {
            whitelist = jQuery.makeArray(whitelist);

            var blacklist = _.reject(context.Controls, function (b) {
                return _.some(whitelist, function (w) {
                    return w === b.name;
                });
            });
            
            _.each(blacklist, function (control) {
                if (control.model.viewModel.isEnabled && control.model.viewModel.isEnabled() != enable) {
                    lastHandled.push(control);
                    control.model.viewModel.isEnabled(enable);
                }
            });
            lastEnabled = enable;
        }


        this.disable = function(whitelist) {
            processList(whitelist, false);
        }

        this.enable = function (whitelist, state) {
            if (state === null || state === undefined) {
                state = true;
            }

            processList(whitelist, state);
        }
        
        this.revert = function () {

            var handler;

            if (lastEnabled) {
                handler = function(control) {
                    control.model.viewModel.disable();
                }
            } else {
                handler = function (control) {
                    control.model.viewModel.enable();
                }
            }

            _.each(lastEnabled, handler);
            lastEnabled = null;
            lastHandled = [];
        }
    }

    return ctor;
});