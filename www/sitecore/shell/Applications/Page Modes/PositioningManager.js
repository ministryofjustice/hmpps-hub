if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

// Manages element's positioning inside an available viewport.
Sitecore.PageModes.PositioningManager = function() {
  this.instance = null;

  var getInstance = function() {
    if (!this.instance) {
      this.instance = createInstance();
    }
    return this.instance;
  };
    
  var createInstance = function() {    
    return {

      //Sets  available region inside which elements can be positioned 
      calculateViewportRegion: function() {
        if (!this.$document) {
          this.$document = $sc(document);          
        }

        if (!this.window){
          this.$window = $sc(window);
        }
         
        var dimensions = {width: this.$window.width(), height: this.$window.height()};
        var offset = {top: this.$document.scrollTop(), left: this.$document.scrollLeft()};               
        var ribbon = $sc("#scWebEditRibbon");
        var ribbonHeight = ribbon.hasClass("scFixedRibbon") ? ribbon.outerHeight() : 0;       
        this.viewportRegion = {left: offset.left, right: offset.left + dimensions.width, top: offset.top + ribbonHeight, bottom: offset.top + dimensions.height};
      },
      
      // Returns values indicating in what dimensions element overflows the viewport.
      getElementOverflow: function(top, left, element) {       
        this.calculateViewportRegion();       
        return this._getOverflow(top, left, element.outerWidth(), element.outerHeight());        
      },

      // Returns element's top and left values, that will make element appear inside the viewport
      getFixedElementPosition: function(top, left, element) {        
        var overflow = this.getElementOverflow(top, left, element);
        return { top: top + overflow.deltaY, left: left + overflow.deltaX };
      },

      // Returns element's top and left values, that will make element appear inside the viewport and docked to chrome's border if possible
      getFixedChromeRelativeElementPosition: function(dimensions, chrome) {        
        var bottomMargin = 2;
        var topMargin = -1;
        this.calculateViewportRegion();               
        var chromeOffset = chrome.position.offset();
        var chromeDimensions = chrome.position.dimensions();
        var top = chromeOffset.top - dimensions.height;
        var left = chromeOffset.left + 2;
        if (chrome.type.key() == "word field") {
          if ( this._getOverflow(chromeOffset.top, chromeOffset.left, chromeDimensions.width, chromeDimensions.height).isOutOfViewport) {
            return {top: chromeOffset.top + chromeDimensions.height + bottomMargin, left: -1000};
          }

          return {top: chromeOffset.top + chromeDimensions.height + bottomMargin, left: left};
        }
                
        if (chrome.type.key() == "field" && chrome.type.contentEditable()) {
          left--;
        }

        var overflow = this._getOverflow(top, left, dimensions.width, dimensions.height);
        if (!overflow.hasOverflow) {
          return {top: top, left: left};
        }
        
        var chromeOverflow = this._getOverflow(chromeOffset.top, chromeOffset.left, chromeDimensions.width, chromeDimensions.height);
        if (chromeOverflow.isOutOfViewport) {
          return {top: top, left: -1000};
        }

        var fixedLeft = left;
        var fixedTop = top;                
        //right overflow - dock element to the chrome's right border 
        if (overflow.deltaX < 0) {                                        
          fixedLeft = chromeOffset.left + chromeDimensions.width - dimensions.width;           
        }
        //left overflow - dock element to the chrome's left border
        if (overflow.deltaX > 0) {
          fixedLeft = chromeOffset.left;          
        }
        //top overflow - dock element to the chrome's bottom border
        if (overflow.deltaY > 0) {                    
          fixedTop = chromeOffset.top + chromeDimensions.height + bottomMargin;
        }
        //bottom overflow - dock element to the chrome's top border
        if (overflow.deltaY < 0) {          
          fixedTop = chromeOffset.top - dimensions.height + topMargin;
        }
        
        var fixedOverflow = this._getOverflow(fixedTop, fixedLeft, dimensions.width, dimensions.height);
        //Docking to one of the chrome's borders failed - just position element inside a viewport.
        if (fixedOverflow.hasOverflow) {
          var returnValue = new Object();
          returnValue.left = ( fixedOverflow.deltaX == 0 ) ? fixedLeft : left + overflow.deltaX;
          returnValue.top = ( fixedOverflow.deltaY == 0) ? fixedTop : top + overflow.deltaY;
          return returnValue;
        }

        return { top: fixedTop, left: fixedLeft };
      },
      
      scrollIntoView: function(chrome) {
        this.calculateViewportRegion();               
        var chromeOffset = chrome.position.offset();
        var chromeDimensions = chrome.position.dimensions();
        var overflow = this._getOverflow(chromeOffset.top, chromeOffset.left, chromeDimensions.width, chromeDimensions.height);
        if (!overflow.hasOverflow) {
          return;
        }

        var currentScrollTop = this.$document.scrollTop();
        var currentScrollLeft = this.$document.scrollLeft();
        this.$window.scrollTop(currentScrollTop - overflow.deltaY).scrollLeft(currentScrollLeft - overflow.deltaX);
      },
      
      _getOverflow: function(top, left, width, height) {
        var dX = 0;
        var isOutOfViewport = false;        
        if (left < this.viewportRegion.left) {
          dX = this.viewportRegion.left - left;
          if (left + width < this.viewportRegion.left) {
            isOutOfViewport = true;
          }
        }
        //It's OK if we return the only overflow when element has both right and left one (Element is wider than viewport hence we can't position it correctly anyway)
        if (left + width > this.viewportRegion.right) {
          dX = this.viewportRegion.right - (left + width);
          if (left > this.viewportRegion.right) {
            isOutOfViewport = true;
          }
        }

        var dY = 0;
        if (top < this.viewportRegion.top) {
          dY = this.viewportRegion.top - top;
          if (top + height < this.viewportRegion.top) {
            isOutOfViewport = true;
          }
        }
        
        if (top + height > this.viewportRegion.bottom) {
          dY = this.viewportRegion.bottom - (top + height);
          if (top > this.viewportRegion.bottom) {
            isOutOfViewport = true;
          }
        }

        return {
                  hasOverflow: dX != 0 || dY != 0, 
                  deltaX: dX, 
                  deltaY: dY, 
                  isOutOfViewport: isOutOfViewport                  
               };
      }     
    };
  };
 
  return getInstance();
};