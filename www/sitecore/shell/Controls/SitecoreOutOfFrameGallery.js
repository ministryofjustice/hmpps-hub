if (typeof(Sitecore) == "undefined") {
  Sitecore = {};
}

(function(jQuery) {
  Sitecore.OutOfFrameGallery = new function() {
  this.frameName = "scOutOfFrameGalleryFrame";
  this._senderId = null,
  this._senderFrameId = null;
  this.frame = function() {
    if (!this._frame) {     
      this._frame = this.createFrameElement();
      this._overlay = this.createOverlayElement();                      
      
      this._attachEventHandler(this._frame, "blur", function() {      
        Sitecore.OutOfFrameGallery.hide();
      });
      
       this._attachEventHandler(this._frame, "load", function() {
        var overlay =  Sitecore.OutOfFrameGallery._overlay;
        if (overlay) {
          overlay.style.display = "none";
        }
      });           
    }
    
    return this._frame;
  };

  this.createFrameElement = function() {
    var element = jQuery("<iframe style=\"box-shadow: 3px 3px 3px 0 rgba(176,176,176, 0.5)\" name='" + 
                    this.frameName + "' id='" + this.frameName +
                     "' src='about:blank'  frameborder='0' scrolling='no' />")
                    .css({zIndex: "99999", position: "fixed"})
                    .hide()                    
                    .appendTo(document.body);
        
    return element.get(0);
  };

  this.createOverlayElement = function() {
     var element =  jQuery("<div>")
                      .css({background: "#fafafa url('/sitecore/shell/Themes/Standard/Images/sitecore-loader24.gif') no-repeat center center", position: "fixed", zIndex: 1000000})
                      .hide()
                      .appendTo(document.body);
     
     return element.get(0);                   
  };

  this.open = function(sender, destination, dimensions, params, httpVerb) {
    if (!sender) {
      return;
    }
    
    this._senderId = sender.id;        
    var gallery = this.getGalleryElement(sender);
    var elementAttachTo = gallery || sender;
    if (!elementAttachTo) {
      return;
    }

    var frame = this.frame();
    frame.src = 'about:blank';
    var url = "/sitecore/shell/default.aspx?xmlcontrol=" + destination;
    var offset = this._getCumulativeOffset(elementAttachTo);
    var doc = elementAttachTo.ownerDocument;    
    if (doc != window.document) {
      // The sender DOM node is inside a frame
      var iframe = this._getElementsFrame(elementAttachTo);
      if (iframe) {
        var frameOffset = this._getCumulativeOffset(iframe);
        offset.top += frameOffset.top;
        offset.left += frameOffset.left;
        if (iframe.id) {
          url += "&senderframe=" + encodeURIComponent(iframe.id);
          this._senderFrameId = iframe.id;
        }
        }
      } 

    this._applySenderStyles();

    // If Gallery attach to top. Otherwise bottom
    if (!gallery) {
      offset.top += elementAttachTo.offsetHeight;
    }
                    
    var frame = this.frame();
    if (typeof(dimensions.height) != "undefined") {
      frame.height = parseInt(dimensions.height) + "px";
      if (jQuery.browser.msie) {
        frame.style.width = "";      
        frame.style.height = "";
    }
    }

    if (typeof(dimensions.width) != "undefined") {
      frame.width = parseInt(dimensions.width) + "px";
      if (jQuery.browser.msie) {
        frame.style.width = "";
    }
    }

    frame.setAttribute("data-gallery-name", destination);    
    this.hide();    
    if (httpVerb === "POST") {            
      var form = this.getFormElement(params);
      form.setAttribute("action", url);               
      this.show(offset);
      form.submit();
      form.parentNode.removeChild(form);                     
    }
    else
    {
      var serializedParameters = this._serialize(params);
      if (serializedParameters) {
        url += "&" + serializedParameters;
      }

      frame.src = url;
      this.show(offset);
    }
  };

  this.getFormElement = function (params) {     
     var form = jQuery("<form style='display:none' method='post'></form>)").attr("target", this.frameName);
     if (params) {              
      for( var n in params) {
        jQuery("<input type='hidden' />").attr("name", n).val(params[n]).appendTo(form);                
      }
     }
               
     form.appendTo(document.body);
     return form.get(0);
  };

  this.getGalleryElement = function(element) {
    return jQuery(element).closest(".scRibbonGallery")[0];    
  };

  this.hide = function() {
    if (!this.isVisible) {
      return;
    }

    try {
      this._clearSenderStyles();
    }
    catch(err) {
      window.console.log("Clearing sender styles failed ", err);      
    }

    this._clearPersistedSender();
    var frame = this.frame();        
    frame.style.display = "none";
    if (jQuery.browser.msie) {
      frame.style.height = "0";
    }

    if (this._overlay) {
      this._overlay.style.display = "none";
    }

    this.isVisible = false;
  };

  this.show = function(position) {    
    var frame = this.frame();    
    frame.style.top = position.top + "px";
    frame.style.left = position.left + "px";        
    frame.style.display = "";       
    if (this._overlay) {    
      this._overlay.style.top = frame.style.top;
      this._overlay.style.left = frame.style.left;
      this._overlay.style.width = parseInt(frame.width) + "px";
      this._overlay.style.height = parseInt(frame.height) + "px";     
      this._overlay.style.display = "";       
    }

    this.isVisible = true;     
  };
  
  this._applySenderStyles = function() {
    var sender = this._getPersistedSender();
    if (!sender) {
      return;
    }

    var $sender = jQuery(sender);    
    if ($sender.is(".scRibbonToolbarLargeGalleryButton")) {
      $sender.addClass("scRibbonToolbarLargeGalleryButtonDown");
    }     
  };

  this._attachEventHandler = function(element, eventName, handler) {
    jQuery(element).bind(eventName, handler);
  };

  this._clearPersistedSender = function() {
    this._senderId = null;
    this._senderFrameId = null;
  };

  this._clearSenderStyles = function() {
    var sender = this._getPersistedSender();
    if (!sender) {
      return;
    }    
    
    jQuery(sender).removeClass("scRibbonToolbarLargeGalleryButtonDown");    
  };

  this._getCumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }

    return {left:valueL, top: valueT}; 
  };

  this._getElementsFrame = function (element) {
    var doc = element.ownerDocument;
    var iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < iframes.length; i++) {
      var frameDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
      if (frameDoc == doc) {
        return iframes[i];
      }
    }

    return null;
  };

  this._getPersistedSender = function() {
    if (!this._senderId) {
      return;
    }

    var doc = window.document;
    if (this._senderFrameId) {
      var senderFrame = doc.getElementById(this._senderFrameId);
      if (!senderFrame) {
        return;
      }

      doc = senderFrame.contentDocument || senderFrame.contentWindow.document;
    }

    if (!doc) {
      return;
    }

    return doc.getElementById(this._senderId);
  };

  this._serialize = function (object) {
    if (!object) {
      return null;
    }

    if (Object.prototype.toString.call(object).toLowerCase() === "[object string]") {
      return object;
    }

    var result = "";
    for (var n in object) { 
      result += "&" + encodeURIComponent(n);
      result += "=" + encodeURIComponent(object[n]);
    }

    return result.length > 1 ? result.substr(1): null;
  };
};
})($sc || jQuery);