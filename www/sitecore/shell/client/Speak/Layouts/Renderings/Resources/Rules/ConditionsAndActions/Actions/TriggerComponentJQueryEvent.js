define([], function () {
  var action = function (context, args) {

    var targetControl = context.app[args.targetControlId], eventName = args.eventName;

    if (targetControl == null) {
      throw "targetControl not found";
    }
    if (!eventName) {
      throw "eventName is not set";
    }

    console.log(eventName);
    targetControl.viewModel.$el.trigger(eventName);
  };

  return action;
});
