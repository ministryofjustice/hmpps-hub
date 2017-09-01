define([], function () {
  var action = function (context, args) {
  
   var targetControl = context.app[args.targetId],
    sourceControl = context.app[args.sourceControlId],
    targetProperty = args.targetProperty,
    selectedItemsPropertyName = "selectedNode",
    sourceProperty = args.sourceProperty,
      sourceValue;
    
    if (!targetControl) {
      console.debug("Target element not found");
      return;
    }
    if (!targetProperty) {
      console.debug("Target element not found");
      return;
    }
    if (!sourceProperty) {
      console.debug("Source property not found");
      return;
    }
	
    if ("rawItem" in sourceControl.get(selectedItemsPropertyName) &&
        typeof sourceControl.get(selectedItemsPropertyName).rawItem !== 'undefined' &&
		sourceProperty in sourceControl.get(selectedItemsPropertyName).rawItem) {
		
      sourceValue = sourceControl.get(selectedItemsPropertyName).rawItem[sourceProperty];
    }
    else{
		return;
	}
    targetControl.set(targetProperty, sourceValue);
  };

  return action;
});
