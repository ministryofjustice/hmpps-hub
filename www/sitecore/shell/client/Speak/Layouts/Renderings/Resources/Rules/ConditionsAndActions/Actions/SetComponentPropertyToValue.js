define([], function () {
  var action = function (context, args) {

    var targetControl = context.app[args.targetControlId], targetProperty = args.propertyName, targetValue = args.value;

    if (targetControl == null) {
      throw "targetControl not found";
    }
    if (!targetProperty) {
      throw "targetProperty is not set";
    }

    switch (targetValue) {
      case "''":
        targetValue = "";
        break;
      case "[]":
        targetValue = [];
        break; 
	case "true":
        targetValue = true;
        break;
	case "false":
        targetValue = false;
        break;
    }
	//console.log("set component:"+args.targetControlId +"     property:"+targetProperty+"     to value:"+targetValue);
    targetControl.set(targetProperty, targetValue);
  };

  return action;
});
