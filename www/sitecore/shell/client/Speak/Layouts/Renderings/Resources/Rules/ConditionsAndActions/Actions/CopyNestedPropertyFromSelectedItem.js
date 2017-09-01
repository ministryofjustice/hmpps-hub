define([], function () {
  var action = function (context, args) {
  
   var targetControl = context.app[args.targetId],
    sourceControl = context.app[args.sourceControlId],
    targetProperty = args.targetProperty,
    selectedItemsPropertyName = "selectedItem",
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
    
    if (sourceControl.get(selectedItemsPropertyName) &&
      "attributes" in sourceControl.get(selectedItemsPropertyName)) {
      sourceValue = sourceControl.get(selectedItemsPropertyName).attributes[sourceProperty];
    } else {
      console.debug("Unable to get the property to set");
      return;
    } 
    
    targetControl.set(targetProperty, sourceValue);
    
  };

  return action;
});
