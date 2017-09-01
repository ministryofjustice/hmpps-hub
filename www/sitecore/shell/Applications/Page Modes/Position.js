Sitecore.PageModes.Position = Base.extend({
  constructor: function(chrome) {
    this.chrome = chrome;
    this.element = chrome.type.layoutRoot();    
    this.onResizeHandler = $sc.proxy(this.onResize, this);
    this.element.bind(this._getResizeEventName(), this.onResizeHandler);        
    this.updated = new Sitecore.Event();
  },
  
  dimensions: function() {
    /*cache only for IE. FF and Chrome are fast enough*/
    var shouldCache = Sitecore.PageModes.Utility.isIE
    if (!shouldCache || !this._dimensions) {           
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = true;
      this._dimensions = this._calculateDimensions(this.element);
      this._dimensions = this._fixInlineContainerHeight(this._dimensions);
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = false;     
    }

    return this._dimensions;
  },
  
  offset: function () {
    var minLeft, minTop;
    minLeft = minTop = 100000;

    if (!this._ignoreOffsetTags) {
      this._ignoreOffsetTags = ["br", "hr", "script", "style", "link", "noframes" ];
    }

    var ignoreTags = this._ignoreOffsetTags;

    this.element.each(function(index, part) {
      var offset = $sc(part).offset();

      if ($sc.inArray(part.tagName.toLowerCase(), ignoreTags) >= 0) {
        return;
      }

      if ($sc(part).css("display") == "none") {
        return;
      }

      if (Sitecore.PageModes.PageEditor.isFixedRibbon() && offset.top == 0) {
        return;
      }

      if ($sc(part).is("input[type='hidden'], .scChromeData")) {
        return;
      }

      if (offset.left < minLeft) minLeft = offset.left;
      if (offset.top < minTop) minTop = offset.top;
    });

    if (minLeft == 100000) {
      minLeft = minTop = 0;
    }

    return { left: minLeft, top: minTop };
  },
  
  onResize: function(e) {           
    if ($sc.util().isIE) {    
      this.reset();
      Sitecore.PageModes.ChromeHighlightManager.planUpdate();
    } 
    else {
      e.stop();
      if (Sitecore.PageModes.ChromeManager.ignoreDOMChanges) return;
      var selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();
      if (selectedChrome && selectedChrome == this.chrome) {        
        this.reset();
        Sitecore.PageModes.ChromeHighlightManager.planUpdate();
      }
    }    
  },
  
  reset: function() {
    this._dimensions = null;
    var newRoot = this.chrome.type.layoutRoot();    
    if (this.element) {
      this.element.unbind(this._getResizeEventName());
    }

    this.element = newRoot;      
    this.element.bind(this._getResizeEventName(), this.onResizeHandler);      
    this.updated.fire();
  },

  _calculateDimensions: function(element) {
    var maxRight, maxBottom;
    maxRight = maxBottom = 0;

    var offset = this.offset();

    this.element.each(function(index, partRaw) {
      var part = $sc(partRaw);
      var partOffset = $sc(part).offset();

      var right = partOffset.left + part.outerWidth();
      var bottom = partOffset.top + part.outerHeight();

      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    return { width: maxRight - offset.left, height: maxBottom  - offset.top };
  },

  _fixInlineContainerHeight: function(dimensions) {
    if (dimensions.height == 0 && this.element.css("display") == "inline") {
      var max = 0;
      this.element.children().each(function() { 
        var h = $sc(this).outerHeight();
        if (h < max) {
          max = h;
        } 
      });

      dimensions.height = max;
    }
    
    return dimensions;
  },

  _getResizeEventName: function() {
    var eventName;
    if (this._resizeEventName) {
      return this._resizeEventName;
    }

    var nameSpace;
    if (this.chrome.key() == "field") {
      nameSpace = "field";
    }
    else {
      nameSpace = this.chrome.controlId();
    }

    if ($sc.util().isIE) {
      eventName = "resize";
      //In IE9 or later, the resize event for element layout changes is deprecated.
      //Registration for the event using addEventListener only works on the window (which fires for window resizes). Resize of element layout cannot be detected using addEventListener registration. 
      // Using special event instead.
      if (parseInt($sc.browser.version) > 8) {
        eventName = "elementresize";
      }
    }
    else {
      eventName = "DOMSubtreeModified"; 
    }
    
    if (nameSpace) {
      eventName += "." + nameSpace;
    }
    
    this._resizeEventName = eventName;
    return eventName;
  }
});