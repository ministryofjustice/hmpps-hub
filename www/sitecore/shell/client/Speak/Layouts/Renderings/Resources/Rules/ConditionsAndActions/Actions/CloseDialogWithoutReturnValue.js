define([], function () {
  var action = function (context, args) {
    context.app.closeDialog(null);
  };

  return action;
});
