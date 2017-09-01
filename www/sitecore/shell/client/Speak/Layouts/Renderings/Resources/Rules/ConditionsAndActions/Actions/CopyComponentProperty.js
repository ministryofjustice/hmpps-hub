define([], function () {
  var action = function (context, args) {
    var targetControl = context.app[args.targetId],
        sourceControl = context.app[args.sourceId];
    
    if (!targetControl) {
      console.debug("Target element not found");
      return;
    }
    if (!sourceControl) {
      console.debug("Source element not found");
      return;
    }
    

    targetControl.set(args.targetProperty, sourceControl.get(args.sourceProperty));
  };

  return action;
});
