if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* @class Represents an overlay for chrome during it's update via Ajax
*/
Sitecore.PageModes.ChromeOverlay = new function() {
  this.overlay = null;
  this.animationStartDelay = 0;
  this.opacity = 0.5;
  this.animationDuration = 100;
  this.overlayVisibleDuration = 150;     
  /**
  * @description Show the overlay  
  * @param {Sitecore.PageModes.Chrome} currentChrome The chrome to show the overlay for. @see Sitecore.PageModes.Chrome
  */
  this.showOverlay = function (currentChrome) {
    var chrome = currentChrome;
    if (!chrome || !chrome.position) {
      return;
    }

    // When condition activation is initiated form a chrome the containing rendering should be overlayed
    if (chrome.key() == "field") {
       var r = chrome.type.parentRendering();
       if (!r) {
          return;
       }

       chrome = r;
    }

    var dimensions = chrome.position.dimensions();
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      return;
    } 

    var offset = chrome.position.offset();    
    if (!this.overlay) {
      this.overlay = $sc("<div class='scChromeOverlay'></div>")
                    .click(function(e) {e.stop();})
                    .hide()
                    .appendTo(document.body);
    }

    this.overlay.stop(true);    
    this.overlay.css(
    {
      top: offset.top + "px",
      left: offset.left + "px",
      height: dimensions.height + "px",
      width: dimensions.width + "px",
      opacity: 0.0
    });
        
    this.overlay.show()
                .delay(this.animationStartDelay)
                .fadeTo(this.animationDuration, this.opacity)
                .delay(this.overlayVisibleDuration);        
  };

  /**
  * @description Hides the overlay
  */
  this.hideOverlay = function() {
    var overlay = this.overlay;
    if (overlay) {
      this.overlay.fadeTo(this.animationDuration, 0.0, function() {overlay.hide();});
    }
  };
  
  /**
   @description Gets the time need for voerlay to bw shown
   @returns {Number} Time in ms
  */
  this.getShowingDuration = function() {
    return this.animationStartDelay + this.animationDuration + this.overlayVisibleDuration;
  };  
};