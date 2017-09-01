define([], function () {
  var action = function (context, args) {
    var control = context.app;

    var parts = args.name.split('.');
    for (var n = 0; n < parts.length; n++) {
      control = control[parts[n]];

      if (control == null) {
        break;
      }
    }

    if (control == null) {
      throw "Control '" + name + "' not found";
    }

    control.set("isVisible", args.value.toLowerCase() != "false");
  };

  return action;
});
