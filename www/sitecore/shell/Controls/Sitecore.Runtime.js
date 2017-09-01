/* Sitecore */

var Sitecore = new Object();

Sitecore.Version = "2.060704";

Sitecore.abstractMethod = function() {
  throw "Abstract method should be implemented.";
}

Sitecore.registerNamespace = function(namespacePath) {
  var root = window;
  var parts = namespacePath.split('.');
  
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (!root[part]) {
      root[part] = new Object();
    }
    root = root[part];
  }
}

Sitecore.registerClass = function(type, typeName, baseType, interfaceType) {
  if (baseType != null) {
    baseType.apply(type);
  }
  type._typeName = typeName;
}

if (typeof (scForm) != "undefined") {
  Sitecore.App = scForm;
  Sitecore.Dhtml = scForm.browser;
}

Sitecore.$ = function(id, tagName) {
  var result = id;

  if (typeof (id) == "string") {
    result = Sitecore.Dhtml.getControl(id);
  }

  if (tagName != null) {
    while (result != null && result.tagName != tagName) {
      result = result.parentNode;
    }
  }

  if (typeof (Prototype) != "undefined") {
    return Element.extend(result);
  }

  return result;
}

/* Sitecore.BaseClass */

Sitecore.BaseClass = function() {
}

/* Sitecore.Event */

Sitecore.Event = new function() {
  this.raise = function(instance, method) {
    method.apply(instance);
  }
}

/* Sitecore.Math.Point */

Sitecore.registerNamespace("Sitecore.Math");
Sitecore.Math.Point = function(x, y) {
  Sitecore.registerClass(this, "Sitecore.Math.Point", Sitecore.BaseClass);
  this.x = (x != null ? x : 0);
  this.y = (y != null ? y : 0);
  
  this.alert = function() {
    alert(this.toString());
  }
  
  this.clientToScreen = function(tag) {
    var ctl = tag;
    
    while (ctl != null) {
      this.offset(ctl.offsetLeft, ctl.offsetTop);
      ctl = ctl.offsetParent;
    }
  }

  this.setPoint = function(x, y) {
    this.x = x;
    this.y = y;
  }

  this.offset = function(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  this.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  }
}

/* Sitecore.Math.Rect */

Sitecore.Math.Rect = function(left, top, width, height) {
  Sitecore.registerClass(this, "Sitecore.Math.Rect", Sitecore.BaseClass);
  this.left = (left != null ? left : 0);
  this.top = (top != null ? top : 0);
  this.width = (width != null ? width : 0);
  this.height = (height != null ? height : 0);

  this.alert = function() {
    alert(this.toString());
  }

  this.apply = function(control) {
    control.style.left = this.left;
    control.style.top = this.top;
    control.style.width = this.width;
    control.style.height = this.height;
  }

  this.assign = function(rect) {
    this.left = rect.left;
    this.top = rect.top;
    this.width = rect.width;
    this.height = rect.height;
  }

  this.clientToScreen = function(tag) {
    var ctl = tag;
    while (ctl != null) {
      this.offset(ctl.offsetLeft, ctl.offsetTop);
     
      ctl = ctl.offsetParent;
    }
  }

  this.contains = function(x, y) {
    return (x >= this.left && y >= this.top && x <= this.left + this.width && y <= this.top + this.height);
  }

  this.ensureRect = function(left, top, width, height) {
    if (this.left == null) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
    }
  }

  this.getElementRect = function(control) {
    this.left = control.offsetLeft;
    this.top = control.offsetTop;
    this.width = control.offsetWidth;
    this.height = control.offsetHeight;
  }

  this.move = function(left, top) {
    this.left = left;
    this.top = top;
  }

  this.normalize = function() {
    if (this.width < 0) {
      this.width = 0;
    }
    if (this.height < 0) {
      this.height = 0;
    }
  }

  this.offset = function(left, top) {
    this.left += left;
    this.top += top;
  }

  this.setRect = function(left, top, width, height) {
    this.left = (left != null ? left : this.left);
    this.top = (top != null ? top : this.top);
    this.width = (width != null ? width : this.width);
    this.height = (height != null ? height : this.height);
  }

  this.shrink = function(width, height) {
    this.width -= width;
    this.height -= height;
  }

  this.toString = function() {
    return "(" + this.left + ", " + this.top + ", " + this.width + ", " + this.height + ")";
  }
}

/* Sitecore.UI.Movable */

Sitecore.registerNamespace("Sitecore.UI");
Sitecore.UI.Movable = function() {
  Sitecore.registerClass(this, "Sitecore.UI.Movable", Sitecore.BaseClass);
  this.trackCursor = null;
  this.moving = false;

  this.mouseDown = function(sender, evt) {
    if (!this.moving && !this.canMove(sender, evt)) {
      return;
    }
  
    if (evt != null && Sitecore.Dhtml.getMouseButton(evt) == 1 && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
      this.moving = true;
      this.trackCursor = new Sitecore.Math.Point();
      this.trackCursor.setPoint(evt.screenX, evt.screenY);
      
      Sitecore.Dhtml.setCapture(sender);
      
      Sitecore.Dhtml.clearEvent(evt, true);
    }
  }

  this.mouseMove = function(sender, evt) {
    if (this.moving)  {
      if (Sitecore.Dhtml.getMouseButton(evt) == 1) {
        var target = this.getTarget();

        target.style.left = "" + (target.offsetLeft + evt.screenX - this.trackCursor.x) + "px";
        target.style.top = "" + (target.offsetTop + evt.screenY - this.trackCursor.y) + "px";
        
        this.trackCursor.setPoint(evt.screenX, evt.screenY);
        
        Sitecore.Dhtml.clearEvent(evt, true);
      }
      else {
        this.mouseUp(sender, evt);
      }
    }
  }

  this.mouseUp = function(sender, evt) {
    this.moving = false;
    this.target = null;
    
    Sitecore.Dhtml.releaseCapture(sender);
    Sitecore.Dhtml.clearEvent(evt, true);
    
    Sitecore.Event.raise(this, this.onMoveEnded);
  }
  
  this.canMove = function(sender, evt) {
    return true;
  }
  
  this.getTarget = Sitecore.abstractMethod;
}

/* Sitecore.UI.ExpandableWindow */

Sitecore.UI.ExpandableWindow = function(expanded) {
  Sitecore.registerClass(this, "Sitecore.UI.ExpandableWindow", Sitecore.UI.Movable);
  if (expanded != null) {
    this._setWindowExpanded(expanded);
  }

  this.expand = function() {
    this._setExpanded(true);
  }

  this.expanded = function() {
    return this.getExpandableWindowPanel().style.display == "";
  }

  this.collapse = function() {
    this._setExpanded(false);
  }

  this.toggle = function() {
    this._setExpanded(!this.expanded());
  }
  
  this._setExpanded = function(expanded) {
    this.getExpandableWindowPanel().style.display = expanded ? "" : "none";
    
    Sitecore.Event.raise(this, this.onExpanded);
  }

  this.getExpandableWindowPanel = Sitecore.abstractMethod;
}

/* Sitecore.UI.DomElement */

Sitecore.UI.DomElement = function() {
}

Sitecore.UI.DomElement.addCssClass = function(element, className) {
  if (!this.containsCssClass(element, className)) {
    element.className += " " + className;
  }
}

Sitecore.UI.DomElement.containsCssClass = function(element, className) {
  var parts = element.className.split(" ");
  
  for(var n = 0; n < parts.length; n++) {
    if (parts[n] == className) {
      return true;
    }
  }
  
  return false;
}

Sitecore.UI.DomElement.removeCssClass = function(element, className) {
  var current = " " + element.className + " ";

  var n = current.indexOf(" " + className + " ");
  
  if (n >= 0) {
    element.className = (current.substr(0, n) + " " + current.substring(n + className.length + 1, current.length));
  }
}

Sitecore.UI.DomElement.toggleCssClass = function(element, className) {
  if (this.containsCssClass(element, className)) {
    this.removeCssClass(element, className);
  }
  else {
    this.addCssClass(element, className);
  }
}


/* Sitecore.Net.Cookie */

Sitecore.registerNamespace("Sitecore.Net");
Sitecore.Net.Cookie = function() {
  Sitecore.registerClass(this, "Sitecore.Net.Cookie", Sitecore.BaseClass);

  this.read = function(name) {
    name = name + "=";
    
    var i = 0;
    
    while (i < document.cookie.length) {
      var j = i + name.length;
      
      if (document.cookie.substring(i, j) == name) {
        var n = document.cookie.indexOf (";", j);
        
        if (n == -1) {
          n = document.cookie.length;
        }
        
        return unescape(document.cookie.substring(j, n));
      }
        
      i = document.cookie.indexOf(" ", i) + 1;
      
      if (i == 0) {
        break; 
      }
    }
    
    return null;
  }
  
  this.write = function(name, value, expires, path, domain, secure) {
    if (expires == null) {
      expires = new Date();
      expires.setMonth(expires.getMonth() + 3);
    }
    
    if (path == null) {
      path = "/";
    }

    document.cookie = name + "=" + escape(value) +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      (path ? "; path=" + path : "") +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
  }
}

/* Sitecore.UI.ModifiedTracking */

Sitecore.UI.ModifiedTracking = new function() {
  this.getModified = function() {
    if (Sitecore.UI.ModifiedTracking.app) {
      return Sitecore.UI.ModifiedTracking.app.modified;
    }
    return Sitecore.App.modified;
  }

  this.setModified = function(modified) {
    if (Sitecore.UI.ModifiedTracking.app) {
      return Sitecore.UI.ModifiedTracking.app.setModified(modified);
    }
    return Sitecore.App.setModified(modified);
  }

  this.track = function(active, app) {
    Sitecore.UI.ModifiedTracking.app = app || null;

    function eventHandler() {
      Sitecore.UI.ModifiedTracking.beforeUnload();
    }

    if (app) {
      scSitecore.prototype.base_setModified = scSitecore.prototype.setModified;

      scSitecore.prototype.setModified = function(value) {
        scForm.base_setModified(value);

        Sitecore.UI.ModifiedTracking.setModified(value);
      };

      return;
    }

    if (active) {
      Sitecore.Dhtml.attachEvent(window, "onbeforeunload", eventHandler);
      window.scBeforeUnload = "1";
    }
    else {
      Sitecore.Dhtml.detachEvent(window, "onbeforeunload", eventHandler);
      window.scBeforeUnload = null;
    }
  }

  this.handleEvent = function(evt, isEditor) {
    if (evt.type == "keyup") {
      if (!Sitecore.App.isFunctionKey(evt, isEditor)) {
        this.setModified(true);
      }
    }
    else if (evt.type == "cut" || evt.type == "paste" || evt.type == "change") {
      this.setModified(true);
    }
  }

  this.beforeUnload = function() {
    if (this.getModified()) {
      if (typeof (scForm) != "undefined") {
        event.returnValue = scForm.translate("There are unsaved changes.");
      }
      else {
        event.returnValue = "There are unsaved changes.";
      }
    }
  }
}

// Resizes the collection of buttons to fit the largest caption
Sitecore.UI.alignButtons = function(buttons) {
    var maxWidth = 0;

    buttons.each(function(item) {
        var width = item.offsetWidth;
        maxWidth = maxWidth < width ? width : maxWidth;
    });
        
    buttons.each(function(item) {
        item.setStyle({
            'width': 'auto'
        });
        var width = item.offsetWidth;
        maxWidth = maxWidth < width ? width : maxWidth;
    });

    buttons.each(function(item) {
        // FF and Chrome (not sure about Safari) uses "traditional" box model for button elements by default.
        item.setStyle({
            'width': maxWidth + 'px'
        });        
        var opacity = item.getOpacity(); //the code removes bad outline border on selected element;
        item.setOpacity(0.1);
        item.setOpacity(opacity); 
    });
     
}
