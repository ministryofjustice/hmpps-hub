if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Represents context fro rendering personalization controls
*/
Sitecore.PageModes.Testing.ControlsContext = Sitecore.PageModes.Controls.Context.extend({
  /**
  * @constructor
  */
  constructor: function (chrome, chromeControls, command) {
    this.base(chrome, chromeControls, command);  
    if (this.chrome.type.getVariations) {
      this.variations = chrome.type.getVariations();
    }
    else {
      this.variations = [];
    }
  },
  
  items: function() {
    return this.variations;  
  },

  activeItem: function() {    
    return $sc.first(this.variations, function() { return this.isActive;});
  }
});