function scWindow() {
  this.minimized = false;
  this.maximized = false;
  this.docked = false;

  var manager = this.getManager();
  
  if (manager != null) {
    var icon = "";
    var match = "";
    var header = "";

    var match = window.location.href.match(/ic=[^&]*/gi);
    if (match != null) {
      var icon = unescape(match[0]).substr(3);
    }
    var match = window.location.href.match(/he=[^&]*/gi);
    if (match != null) {
      var header = decodeURIComponent(match[0]).substr(3).replace(/\+/g, " ");
    }
    else {
      header = "Content Editor";
    }
    
    this.docked = manager.register(window, header, icon);
  }
  
  scForm.browser.attachEvent(window, "onload", scLoadWindow);
  scForm.browser.attachEvent(window, "onunload", scUnloadWindow);
}

scWindow.prototype.activate = function() {
  this.bringToFront();
}

scWindow.prototype.bringToFront = function() {
  var manager = this.getManager();
  if (manager != null) {
    manager.bringToFront(this.getID());
  }
}

scWindow.prototype.canDrag = function() {
  return !this.maximized && !this.minimized;
}

scWindow.prototype.canMaximize = function() {
  this.getWindowFlags();
  
  return this.maximizable && !this.docked;
}

scWindow.prototype.canMinimize = function() {
  this.getWindowFlags();
  
  return this.minimizable && !this.docked;
}

scWindow.prototype.canResize = function() {
  this.getWindowFlags();
  
  return this.resizable && !this.maximized && !this.minimized && !this.docked;
}

scWindow.prototype.closeWindow = function() {
  var manager = this.getManager();
  if (manager != null) {
    manager.close(this.getID());
  }
}

scWindow.prototype.getEventPoint = function(evt, control) {
  var result = new scPoint(evt.clientX, evt.clientY);
  
  var ctl = scForm.browser.getSrcElement(evt);
  
  ctl = ctl.offsetParent;
  
  while (ctl != null && ctl != control) {
    result.offset(ctl.offsetLeft, ctl.offsetTop);
    
    ctl = ctl.offsetParent;
  }
  
  return result;
}

scWindow.prototype.getFrame = function() {
  return scForm.browser.getFrameElement(window);
}

scWindow.prototype.getID = function() {
  var frame = this.getFrame();
  
  if (frame != null) {
    return frame.id;
  }
  
  return null;
}

scWindow.prototype.getManager = function() {
  if (typeof(window.parent.scManager) != "undefined") {
    return window.parent.scManager;
  }
  
  return null;
}

scWindow.prototype.getWindowFlags = function() {
  if (this.maximizable == null) {
    this.maximizable = true;
    this.minimizable = true;
    this.resizable = true;
    
    for(var e = scForm.browser.getEnumerator(document.getElementsByTagName("TABLE")); !e.atEnd(); e.moveNext()) {
      var className = e.item().className;
      
      if (className.indexOf("scWindowHandle") >= 0) {
        this.resizable = className.indexOf("scWindowNoResize") < 0;
        this.maximizable = className.indexOf("scWindowNoMaximize") < 0;
        this.minimizable = className.indexOf("scWindowNoMinimize") < 0;
        break;
      }
    }
  }
}

scWindow.prototype.hideWindow = function() {
  var manager = this.getManager();
  if (manager != null) {
    manager.hide(this.getID());
  }
}

scWindow.prototype.hitTest = function(evt) {
  if (evt == null) {
    return "";
  }

  var ctl = scForm.browser.getSrcElement(evt);
  if (typeof ctl.tagName == "undefined") {
    return "";
  }

  var delta = 4;
  var delta2 = 16;

  var point = new scPoint(evt.clientX, evt.clientY);

  var width = document.body.offsetWidth;
  var height = document.body.offsetHeight;

  if (this.canResize()) {
    if (point.x < delta && point.y < delta2 || point.x < delta2 && point.y < delta) {
      return "resize topleft";
    }
    else if (point.x < delta && point.y >= height - delta2 || point.x < delta2 && point.y >= height - delta) {
      return "resize bottomleft";
    }
    else if (point.x >= width - delta2 && point.y < delta || point.x >= width - delta && point.y < delta2) {
      return "resize topright";
    }
    else if (point.x >= width - delta2 && point.y >= height - delta || point.x >= width - delta && point.y >= height - delta2) {
      return "resize bottomright";
    }
    else if (point.x < delta) {
      return "resize left";
    }
    else if (point.x >= width - delta) {
      return "resize right";
    }
    else if (point.y < delta) {
      return "resize top";
    }
    else if (point.y >= height - delta) {
      return "resize bottom";
  }
  }

  if (this.canDrag()) {
    while (ctl != null) {
      if (ctl.className != null && ctl.className.indexOf("scWindowHandle") >= 0 && point.y < 60) {
        return "handle";
      }

      ctl = ctl.parentNode;
    }
  }

  return "";
}

scWindow.prototype.hide = function() {
  var manager = this.getManager();
  if (manager != null) {
    manager.hide(this.getID());
  }
}

scWindow.prototype.maximizeWindow = function() {
  if (this.canMaximize()) {
    if (window.event.clientY > 36) {
      return;
    }
    var manager = this.getManager();
    
    if (manager != null) {
      manager.maximize(this.getID());
    }
  }
}

scWindow.prototype.minimizeWindow = function() {
  if (this.canMinimize()) {
    var manager = this.getManager();
    
    if (manager != null) {
      manager.minimize(this.getID());
    }
  }
}

scWindow.prototype.mouseDown = function(tag, evt) {
  if (evt != null && scForm.browser.getMouseButton(evt) == 1 && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
    var manager = this.getManager();

    if (manager != null) {
      this.manager = manager;

      manager.mouseDown(tag, evt, this.getID(), this.hitTest(evt));
    }
  }
}

scWindow.prototype.mouseMove = function(tag, evt) {
  if (this.manager != null) {
    this.manager.mouseMove(tag, evt, this.getID());
    return false;
  }
  else {
    var hit = this.hitTest(evt);

    switch (hit) {
      case "resize left": case "resize right":
        document.body.style.cursor = "e-resize";
        break;

      case "resize top": case "resize bottom":
        document.body.style.cursor = "n-resize";
        break;

      case "resize topleft": case "resize bottomright":
        document.body.style.cursor = "mw-resize";
        break;

      case "resize topright": case "resize bottomleft":
        document.body.style.cursor = "sw-resize";
        break;

      default:
        document.body.style.cursor = "default";
        break;
    }
  }

  return false;
}

scWindow.prototype.mouseUp = function(tag, evt) {
  if (this.manager != null) {
    this.manager.mouseUp(tag, evt, this.getID());
    this.manager = null;
    return false;
  }
}

scWindow.prototype.setCaption = function(caption) {
  var ctl = scForm.browser.getControl("WindowCaption");
  
  if (ctl != null) {
    ctl.innerHTML = caption + " - ";
  }
}

scWindow.prototype.setDocked = function(docked) {
  this.docked = docked;

  var ctl = scForm.browser.getControl("WindowFrameTop");
  if (ctl != null) {
    ctl.style.background = (docked ? "inactiveborder" : "activecaption url(/sitecore/shell/themes/standard/images/toolwindow.gif) repeat-x");
    ctl.style.color = (docked ? "windowtext" : "captiontext");
  }
  var ctl = scForm.browser.getControl("WindowFrameLeft");
  if (ctl != null) {
    ctl.style.background = (docked ? "inactiveborder" : "activecaption");
  }
  var ctl = scForm.browser.getControl("WindowFrameRight");
  if (ctl != null) {
    ctl.style.background = (docked ? "inactiveborder" : "activecaption");
  }
  var ctl = scForm.browser.getControl("WindowFrameBottom");
  if (ctl != null) {
    ctl.style.background = (docked ? "inactiveborder" : "activecaption");
  }
}

function scLoadWindow() {
  var manager = scWin.getManager();
  
  if (manager != null) {
    scWin.setDocked(scWin.docked);
    
    var frame = scWin.getFrame();
    if (frame.style.width == "100%" && frame.style.height == "100%") {
      scWin.maximized = true;
      scWin.bounds = new scRect(0, 0, frame.ownerDocument.body.offsetWidth * 75 / 100, frame.ownerDocument.body.offsetHeight * 75 / 100);
    }
  }
}

function scUnloadWindow() {
  var manager = scWin.getManager();
  
  if (manager != null) {
    manager.unloadWindow(scWin.getID());
  }
}

var scWin = new scWindow();
