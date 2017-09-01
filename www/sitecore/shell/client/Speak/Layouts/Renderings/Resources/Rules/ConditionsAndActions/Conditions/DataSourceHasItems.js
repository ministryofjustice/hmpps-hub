define([], function () {
  var condition = function (context, args) {
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

    var items = control.get("items");
    if (items == null || !_.isArray(items)) {
      return false;
    }

    return items.length > 0;
  };

  return condition;
});
