if (typeof(Sitecore.PageModes) == "undefined") Sitecore.PageModes = new Object();

Sitecore.PageModes.ChromeHighlightManager = new function() {
  this.interval = 1000;
  this._intervalID = null;
  this._shouldHighlightChromes = false;
  this._updatePlanned = false;
  
  this.activate = function() {
    this._shouldHighlightChromes = true;
    this._updatePlanned = true;
    this._stopped = false;
    this._intervalID = setInterval($sc.proxy(this._process, this), this.interval);
  };

  this.deactivate = function() {
    this._shouldHighlightChromes = false;
    this.highlightChromes();
    if (this._intervalID != null) {
      clearInterval(this.intervalID);
    }

    this._intervalID = null;
  }; 
  
  this.highlightChromes = function() {   
    var updated = true;
    var length = Sitecore.PageModes.ChromeManager.chromes().length;
    for (var i = 0; i < length; i++) {   
      if (this._stopped) {
        updated = false;
        return;
      }

      var chrome = Sitecore.PageModes.ChromeManager.chromes()[i];
      if (this.isHighlightActive(chrome)) {
        chrome.showHighlight();
      }
      else {
        chrome.hideHighlight();
      }
    }
    
    if (updated) {
      this._updatePlanned = false;  
    }
  };
  
  // Defines if the specified chrome should be highlighted.
  this.isHighlightActive = function(chrome) {
    return this._shouldHighlightChromes && chrome.isEnabled() && !chrome.isFake();
  };

  this.planUpdate = function() {
    this._updatePlanned = true;
  };

  this.resume = function() {
    this._stopped = false;
    this._process();
  };
  
  this.stop = function() {
     this._stopped = true;
  };
  
  this._process = function() {    
    if (this._updatePlanned && !this._stopped) {      
      this.highlightChromes();      
    }
  };    
};