if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Represents context fro rendering personalization controls
*/
Sitecore.PageModes.Personalization.ControlsContext = Sitecore.PageModes.Controls.Context.extend({
  /**
  * @constructor
  */
  constructor: function (chrome, chromeControls, command) {
    this.base(chrome, chromeControls, command);  
    if (this.chrome.type.getConditions) {
      this.conditions = chrome.type.getConditions();
    }
    else {
      this.conditions = [];
    }
  },

  /**
  * @description Get the currenty active condition
  * @return {Object} The object containing the condition and its position (1-based) in the condition list
  */
  getActiveCondition: function() {
    var idx = -1;
    var selectedCondition = $sc.first(this.conditions, function(i) { if (this.isActive) { idx = i; return true;}});
    return {condition: selectedCondition, position: idx + 1};
  },

  items: function() {
    return this.conditions;  
  },

  activeItem: function() {
    var activeCondition = this.getActiveCondition();
    return activeCondition.condition;
  }
});