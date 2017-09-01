if (typeof(Sitecore.PageModes.Controls) == "undefined") {
  Sitecore.PageModes.Controls = {};
}

/**
* @class Represents context for rich controls
*/
Sitecore.PageModes.Controls.Context = Base.extend({
  /**
  * @constructor
  */
  constructor: function (chrome, chromeControls, command) {
    this.chrome = chrome;
    this.chromeControls = chromeControls;
    this.command = command;       
  },
  
  items: function () 
  {
    return [];
  },

  activeItem: function()
  {
    return null;
  }
});