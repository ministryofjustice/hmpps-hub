define(["sitecore"], function(_sc) {

    return {
        execute: function(context) {

            var buttons = ['NewAssignFXMAttributesButton', 'NewClientActionButton', 'NewPlaceholderButton'];
            _.each(buttons, function(b) {
                var reg = new RegExp(b + "_-[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}-");
                var control = _.find(context.app.Controls, function(c) {
                    return c.name.match(reg);
                });
                if (control) {
                    var cmd = _sc.Commands[control.model.attributes.command];
                    if (cmd && cmd.initialize) {
                        cmd.initialize(context.app, control.model);
                    }
                }
            });
        }
    }
});