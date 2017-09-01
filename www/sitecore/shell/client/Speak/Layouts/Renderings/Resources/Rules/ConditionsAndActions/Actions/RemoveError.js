define([], function () {
  var action = function (context, args) {
   
    var targetControl = context.app[args.controlId], error=context.args[0], errorForMessageBar;
	
    if (targetControl == null) {
      throw "targetControl not found";
    }
    targetControl.removeMessage(function (e) {
                  var result =  (e.id === error.id);
                  return result;
              });
  };

  return action;
});
