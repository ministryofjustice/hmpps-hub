/* Sitecore.Floatie */

Sitecore.Floatie = new function() {
  Sitecore.registerClass(this, "Sitecore.Floatie", Sitecore.UI.ExpandableWindow);
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.Floatie.load() } );
  
  this.getTarget = function() {
    return Sitecore.Dhtml.getFrameElement(window);
  }

  this.getExpandableWindowPanel = function() {
    return $("CollapsableWindow");
  }
  
  this.load = function(sender, evt) {
    var target = this.getTarget();
    target.style.height = "20px"; // make sure meassure is correct
    target.style.height = "" + document.body.scrollHeight + "px";
    
    var frame = this.getTarget();
    if (frame != null) {
      if (frame.offsetLeft + 16 > frame.ownerDocument.body.offsetWidth || frame.offsetLeft < 0) {
        frame.style.left = "0px";
        this.saveState();
      }

      if (frame.offsetTop + 16 > frame.ownerDocument.body.offsetHeight || frame.offsetTop < 0) {
        frame.style.top = "0px";
        this.saveState();
      }
    }
  }
  
  this.mouseOver = function(sender, evt) {
  }

  this.mouseOut = function(sender, evt) {
  }

  this.onMoveEnded = function(sender, evt) {
    this.saveState();
  }
  
  this.onExpanded = function(sender, evt) {
    var target = this.getTarget();
    if (this.expanded()) {
      var height = document.body.scrollHeight;
      
      if (height < 96) {
        height = 320;
      }
    
      target.style.height = "" + height + "px";
    }
    else {
      target.style.height = "20px";
    }
    this.saveState();
  }
  
  this.saveState = function() {
    var target = this.getTarget();
    var cookie = new Sitecore.Net.Cookie();
    cookie.write("sitecore_floatie_state", "" + target.offsetLeft + "," + target.offsetTop + "," + (this.expanded() ? "1" : "0"));
  }
}
