scWebEditGallery = new function() {
  this.close = function() {
    var parent = window.parent;     
    if (parent && typeof(parent.Sitecore) != "undefined" && typeof(parent.Sitecore.OutOfFrameGallery) != null) {     
      parent.Sitecore.OutOfFrameGallery.hide();
      return;
    }
  
    var frame = this.browser.getFrameElement(window);
    if (frame != null) {
      frame.src = "about:blank";
      frame.style.display = "none";
    }
  };
  
  this.getSitecoreWindow = function() {
    var params = window.location.search.toQueryParams();
    if (params.senderframe) {
      var win = window;
      do {
        win = win.parent;
        var frame = win.document.getElementById(params.senderframe);
        if (frame && frame.contentWindow && frame.contentWindow.scForm) {
          return frame.contentWindow;          
        }
      
      } while (win != window.top);

      console.log("Cannot find frame with name " + params.senderframe);
      return null;
    }
  }

  this.handleMessage = function(message) {
    if (!message) {
      return;
    }

    var sc = this.getSitecoreWindow();
    if (sc) {
      sc.scForm.invoke(message);
      return;
    }

    if (window.scForm) {
      scForm.invoke(message);
    }
  };   
};

function OnPopupClosed(reason) {
  if (reason == "mainWindowBlur" || reason == "mainWindowUnload") {
    return;
  }
      
  scWebEditGallery.close();
};

document.observe("dom:loaded", function() {    
  // Workaround for FF not firing onblur event on frame
  if (!Prototype.Browser.Gecko) {
    return;    
  }

  var element = new Element("input", {type: "text", width: 0, height: 0 });
  $(document.body).insert(element);
  element.focus();
  element.remove();
  $(document).on("blur", function() {scWebEditGallery.close()});  
});

scForm.browser.attachEvent(window, "onload", function () { 
  var w = scWebEditGallery.getSitecoreWindow();
  if (w) {
    w.scForm.browser.onPopupClosed = OnPopupClosed;
  }
});
