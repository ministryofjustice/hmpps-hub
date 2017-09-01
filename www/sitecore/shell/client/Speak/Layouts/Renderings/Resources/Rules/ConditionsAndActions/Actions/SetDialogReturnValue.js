define([], function () {
  var action = function (context, args) {
   var targetControl = context.app[args.targetControl], 
	   targetProperty=args.targetProperty, resultValue;
	   
   if (!targetControl) {
		console.log("Target Control not found");
		return false;
	}  
	
	resultValue=targetControl.get(targetProperty);
	
	if(!resultValue){
		console.log("result value is null");
		return false;
	}
	
    context.app.closeDialog(resultValue);
  };

  return action;
});
