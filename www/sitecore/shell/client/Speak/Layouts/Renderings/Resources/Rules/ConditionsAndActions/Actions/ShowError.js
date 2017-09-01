define([], function () {
  var action = function (context, args) {
   
    var targetControl = context.app[args.controlId], errors=context.args[0],errorForMessageBar;


    if (targetControl == null) {
      throw "targetControl not found";
    }
    
	_.each(errors, function(error){
		errorForMessageBar = {
						  text: error.Message,
						  id: error.id,
						  actions: [],
						  closable: false
					  };
		targetControl.addMessage("error", errorForMessageBar);
	});
  };

  return action;
});
