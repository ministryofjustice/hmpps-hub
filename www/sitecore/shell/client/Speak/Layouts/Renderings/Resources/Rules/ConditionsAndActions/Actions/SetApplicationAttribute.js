define([], function () {
  var action = function (context, args) {
    context.app.set(args.name, args.value);
  };

  return action;
});
