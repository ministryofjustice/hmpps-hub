
Sitecore.PageModes.ChromeTypes.WrapperlessField = Sitecore.PageModes.ChromeTypes.Field.extend({ 
  controlId: function() {
    return this.chrome.openingMarker().attr("id").replace("_edit", "");
  },

  dataNode: function(domElement) {
    if (!domElement) {
      $sc.util().log("no dom element");
      return null;
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='field']")) {
      return domElement;
    }
    
    return null;      
  },

  editControlCompleted: function(value, plainValue, preserveInnerContent) {
     this.fieldValue.val(typeof(plainValue) != "undefined" ? plainValue : value);
    if (!preserveInnerContent) {
      var htmlValue = value || "";
      // If a plain text node, wrap it in a span
      if ($sc.removeTags(htmlValue) === htmlValue) {
        htmlValue = "<span class='scTextWrapper'>" + htmlValue + "</span>";  
      }

      var newElements = $sc(htmlValue);
      this.chrome.update(newElements);
    }
    else {
      var targetCtl = this.chrome.element[0];
      var wrapper = document.createElement("span"); 
      wrapper.innerHTML = value;
      var sourceCtl = wrapper.firstChild;
      $sc.util().copyAttributes(sourceCtl, targetCtl);
      delete wrapper;                      
    }           
    
    this.chrome.reset();
    this.setModified();  
  },

  elements: function(domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='field']")) {
      console.error("Unexpected DOM element passed to WrapplessFiled for initialization:");
      $sc.util().log(domElement);
      throw "Failed to parse page editor field demarked by CODE tags";
    }  

    return this._getElementsBetweenScriptTags(domElement);
  },

  layoutRoot: function() {        
    return this.chrome.element;
  }
});