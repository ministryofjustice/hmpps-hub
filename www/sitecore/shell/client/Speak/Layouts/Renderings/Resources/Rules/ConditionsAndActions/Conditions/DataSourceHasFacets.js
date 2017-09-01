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

    var facets = control.get("facets");
    if (facets == null || !_.isArray(facets)) {

      return false;
    }

    return facets.length > 0;
  };

  return condition;
});
