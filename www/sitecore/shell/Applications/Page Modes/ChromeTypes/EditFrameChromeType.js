Sitecore.PageModes.ChromeTypes.EditFrame = Sitecore.PageModes.ChromeTypes.ChromeType.extend({
  constructor: function() {
    this.base();
    this._editFrameUpdating = false;
    this.fieldsChangedDuringFrameUpdate = false;
  },
  
  handleMessage: function(message, params) {
    switch (message) {
      case "chrome:editframe:updatestart":
        this.updateStart();
        break;
      case "chrome:editframe:updateend":
        this.updateEnd();
        break;
    }
  },

  isEnabled: function() {
    return $sc.inArray(Sitecore.PageModes.Capabilities.edit, Sitecore.PageModes.PageEditor.getCapabilities()) > -1 && this.base();
  },

  key: function() {
    return "editframe";
  },

  load: function() {
  },

  updateStart: function() {  
    this._editFrameUpdating = true;
    this.fieldsChangedDuringFrameUpdate = false;    
  },

  updateEnd: function() {
    if (this.fieldsChangedDuringFrameUpdate) {
      this.chrome.element.addClass("scWebEditFrameModified");      
    }

    this._editFrameUpdating = false;
    this.fieldsChangedDuringFrameUpdate = false;
  }
});