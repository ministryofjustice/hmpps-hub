function scWindowManager() {
  this.windows = new Array();
  this.sequencer = 0;
  this.mode = "";

  this.browser = new scWindowManagerMozilla();
  
  scForm.browser.attachEvent(window, "onload", scWindowManagerInitialize);
  
  this.dockSize = 16;
  this.dockResizing = false;
}

scWindowManager.prototype.bringToFront = function(id) {
  var n = this.findWindow(id);

  if (n >= 0) {
    this.windows.splice(n, 1);
    this.windows.push(id);

    this.show(id);

    this.updateWindowOrder();

    var win = this.getWindow(id);
  }
};

scWindowManager.prototype.close = function(id) {
  var win = this.getWindow(id);

  try {
    var cw = win != null ? win.contentWindow : null;
  } catch(ex) {
    console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
  }

  if (win != null) {
    this.closeFrame(cw, function (result) {
      if (result) {
        scManager.hide(id);

        if (scManager.isDocked(win)) {
          scManager.undock(win);
        }

        scManager.unregister(id);

        scForm.browser.removeChild(win);

        var richTextEditor = document.getElementById(id + 'overlayWindow');
        if (richTextEditor) {
          scForm.browser.removeChild(richTextEditor);
        }
      }
    });

    return true;
  }

  return false;
};

scWindowManager.prototype.closeAll = function() {
  for (var n = 0; n < this.windows.length; n++) {
    if (!this.close(this.windows[n])) {
      return false;
    }
  }

  return true;
};

scWindowManager.prototype.closeFrame = function(win, closeFrameCallback) {
  var framesLength = win.frames.length;
  var multipleCallbackListener = new MultipleCallbackListener(framesLength, closeFrameCallback);

  //we need try\catch because we might not have access to frames running in some other domains or frames with silverlight applications loaded.
  try {
    if (win.scForm != null && win.scBeforeUnload != null) {
      if (win.scForm.modified) {
        win.scForm.showModalDialog("/sitecore/shell/default.aspx?xmlcontrol=YesNoCancel&te=" + encodeURIComponent(scForm.translate("Do you want to save the changes to the item?")), new Array(win), "dialogWidth:430px;dialogHeight:190px;help:no;scroll:auto;resizable:yes;maximizable:no;status:no;center:yes;autoIncreaseHeight:yes", null, function (dialogResult) {
          var shouldCloseDialog = true;
          switch (dialogResult) {
            case "yes":
              win.scForm.setModified(false);
              if (win.scForm.saveItem != null) {
                shouldCloseDialog = win.scForm.saveItem();
              } else {
                win.scForm.postRequest("", "", "", "item:save");
              }

              break;
            case "no":
              win.scForm.setModified(false);
              break;
            case "cancel":
              shouldCloseDialog = false;
              break;
          }
          
          if (shouldCloseDialog) {
            if (framesLength > 0) {
              for (var n = 0; n < framesLength; n++) {
                scManager.closeFrame(win.frames[n], function(callbackResult) {
                  multipleCallbackListener.onCallbackReceived(callbackResult);
                });
              }
            } else {
              closeFrameCallback(true);
            }
            
          } else {
            closeFrameCallback(false);
          }
        });
        return;
      }
    }
  } catch(err) {
  }

  if (framesLength > 0) {
    for (var n = 0; n < framesLength; n++) {
      this.closeFrame(win.frames[n], function (callbackResult) {
        multipleCallbackListener.onCallbackReceived(callbackResult);
      });
    }
  } else {
    closeFrameCallback(true);
  }
};

scWindowManager.prototype.closeWindow = function (win, form) {
  if (window.top.isModalDialog(win)) {
    window.top.dialogClose();
  } else {
    if (win == null && form != null) {
      var id = this.getIDFromContextMenu(form);
      var w = this.getWindow(id);

      if (w != null) {
        try {
          win = w.contentWindow;
        } catch(ex) {
          console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
          win = null;
        }
      }
    } else {
      while (win != null && typeof(win.scWin) == "undefined" && win != win.parent) {
        win = win.parent;
      }
    }

    if (win != null) {
      if (scForm && scForm.browser) {
        scForm.browser.closePopups();
      }

      this.close(win.scWin.getID());
    }
  }
};

scWindowManager.prototype.createOutline = function(bounds) {
  var result = scForm.browser.getControl("__outline");

  if (!result) {
    result = document.createElement("div");

    result.id = "__outline";

    document.getElementById('Desktop').appendChild(result);
  } else {
    result.style.display = "";
  }

  result.style.border = "2px ridge";
  result.style.position = "absolute";
  result.style.zIndex = "1000";

  bounds.apply(result);

  return result;
};

scWindowManager.prototype.closeOutline = function(outline) {
  outline.style.display = "none";
};

scWindowManager.prototype.dragStart = function(tag, evt, id) {
  var win = this.getWindow(id);
  if (win != null) {
    this.mode = "drag";

    this.bringToFront(id);

    this.bounds = new scRect();
    this.bounds.getControlRect(win);

    this.windowBounds = new scRect();
    this.windowBounds.getControlRect(win);

    if (win.floatBounds == null) {
      win.floatBounds = new scRect(0, 0, 250, 350);
    }

    if (this.isDocked(win)) {
      this.windowBounds.clientToScreen(win);
      this.bounds.clientToScreen(win);

      this.bounds.left += evt.clientX - win.floatBounds.width / 2;

      this.bounds.width = win.floatBounds.width;
      this.bounds.height = win.floatBounds.height;
    }

    this.trackCursor = new scPoint();
    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    scForm.browser.clearEvent(evt, false);

    return true;
  }

  return false;
};

scWindowManager.prototype.dragMove = function(tag, evt, id) {
  var win = this.getWindow(id);

  if (win != null) {
    var dx = evt.screenX - this.trackCursor.x;
    var dy = evt.screenY - this.trackCursor.y;

    if (this.outline == null) {
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
        scForm.browser.clearEvent(evt, true);
        return;
      }

      this.outline = this.createOutline(this.bounds);
    }

    this.bounds.offset(dx, dy);

    if (this.bounds.top < 0) {
      this.bounds.setRect(null, 0);
    }

    var bounds = new scRect();
    bounds.assign(this.bounds);
    var border = 4;
    this.outline.style.border = "2px ridge";

    var zone = this.getDockZone(evt);
    if (zone != null) {
      b = this.dragDockZone(zone, evt, win);

      if (b != null) {
        bounds = b;
        this.outline.style.border = "6px ridge";
        border = 12;
      }
    }

    if (!scForm.browser.isIE) {
      bounds.shrink(border, border);
    }

    bounds.apply(this.outline);

    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    scForm.browser.clearEvent(evt, false);
  }
};

scWindowManager.prototype.dragEnd = function(tag, evt, id) {
  var win = this.getWindow(id);

  if (win != null) {
    if (this.outline != null) {
      var docked = false;

      var zone = this.getDockZone(evt);
      if (zone != null) {
        b = this.dragDockZone(zone, evt, win);

        if (b != null) {
          docked = this.dockZone(zone, win, evt);
        } else {
          docked = false;
        }
      }

      if (!docked) {
        if (this.isDocked(win)) {
          this.undock(win);
        }

        this.bounds.apply(win);

        win.floatBounds = new scRect();
        win.floatBounds.assign(this.bounds);
      }

      if (this.outline != null) {
        this.closeOutline(this.outline);
        this.outline = null;
      }
    }

    scForm.browser.clearEvent(evt, false);
  }

  scForm.browser.releaseCapture(tag);
};

scWindowManager.prototype.findWindow = function(id) {
  for (var n = 0; n < this.windows.length; n++) {
    if (this.windows[n] == id) {
      return n;
    }
  }

  return -1;
};

scWindowManager.prototype.focus = function(tag, evt) {
  while (tag != null && tag.tagName != "TD") {
    tag = tag.parentNode;
  }

  if (tag != null) {
    var id = tag.id.substr(21);

    var win = this.getWindow(id);

    if (win != null) {
      if (win.style.display == "none") {
        this.restore(id);
      } else {
        var n = this.findWindow(id);

        if (n == this.windows.length - 1) {
          this.minimize(id);
        } else {
          this.bringToFront(id);
        }
      }
    }
  }
};

scWindowManager.prototype.getIDFromContextMenu = function(form) {
  var src = form.contextmenu;

  while (src != null && src.tagName != "TD") {
    src = src.parentNode;
  }

  var result = src.id.substr(21);

  scForm.browser.closePopups();

  return result;
};

scWindowManager.prototype.getWindow = function(id) {
  if (id != null) {
    return document.getElementById(id);
  }

  return null;
};

scWindowManager.prototype.getWindowHandler = function(id) {
  var win = this.getWindow(id);

  if (win != null) {
    try {
      return win.contentWindow.scWin;
    } catch(ex) {
      console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
    }
  }

  return null;
};

scWindowManager.prototype.hide = function(id) {
  var win = this.getWindow(id);

  if (win != null) {
    var n = this.findWindow(id);

    this.windows.splice(n, 1);
    this.windows.unshift(id);

    win.style.display = "none";

    if (this.isDocked(win)) {
      this.undock(win);
    }

    this.updateWindowOrder();
  }
};

scWindowManager.prototype.maximize = function(id, form) {
  if (id == null && form != null) {
    id = this.getIDFromContextMenu(form);
  }

  var win = this.getWindow(id);

  if (win != null) {
    var handler = this.getWindowHandler(id);

    if (handler.maximized) {
      this.restore(id);
    } else {
      if (handler.canMaximize()) {
        handler.maximized = true;

        if (!handler.minimized) {
          handler.bounds = new scRect();
          handler.bounds.getControlRect(win);
        } else {
          handler.minimized = false;
        }

        win.style.left = 0;
        win.style.top = 0;
        win.style.width = "100%";
        win.style.height = "100%";

        this.bringToFront(id);
        this.show(id);
      }
    }

    var contentWindow = win.contentWindow;
    if (contentWindow.Flexie) {
      contentWindow.Flexie.updateInstance();
    }
  }
};

scWindowManager.prototype.minimize = function(id, form) {
  if (id == null && form != null) {
    id = this.getIDFromContextMenu(form);
  }

  var handler = this.getWindowHandler(id);
  var win = this.getWindow(id);

  if (win != null) {
    if (!handler.minimized && handler.canMinimize()) {
      handler.minimized = true;

      if (!handler.maximized) {
        handler.bounds = new scRect();
        handler.bounds.getControlRect(win);
      }

      this.hide(id);
      this.updateWindowOrder();
    }
  }
};

scWindowManager.prototype.minimizeAllWindows = function() {
  for (var n = 0; n < this.windows.length; n++) {
    this.minimize(this.windows[n]);
  }
};

scWindowManager.prototype.mouseDown = function(tag, evt, id, hit) {
  if (this.mode == "" && id != null) {
    if (scForm.browser.getMouseButton(evt) == 1) {
      var capture = false;

      if (hit == "handle") {
        capture = this.dragStart(tag, evt, id);
      } else if (hit.indexOf("resize") >= 0) {
        capture = this.resizeStart(tag, evt, id, hit);
      }

      if (capture) {
        scForm.browser.setCapture(tag, function(tag, evt) { scManager.mouseMove(tag, evt, id) });
      }
    }
  }
};

scWindowManager.prototype.mouseMove = function(tag, evt, id) {
  if (this.mode != "" && id != null) {
    if (evt.type == "mouseup") {
      this.mouseUp(tag, evt, id);
    } else if (this.mode == "drag") {
      this.dragMove(tag, evt, id);
    } else {
      this.resizeMove(tag, evt, id);
    }

    return false;
  }
};

scWindowManager.prototype.mouseUp = function(tag, evt, id) {
  if (this.mode != "" && id != null) {
    if (this.mode == "drag") {
      this.dragEnd(tag, evt, id);
    } else {
      this.resizeEnd(tag, evt, id);

      var win = this.getWindow(id).contentWindow;
      if (win.Flexie) {
        win.Flexie.updateInstance();
      }
    }
  }

  this.mode = "";
};

scWindowManager.prototype.moveToDesktop = function(id, form, doNotRestore) {
  if (id == null && form != null) {
    id = this.getIDFromContextMenu(form);
  }

  var win = this.getWindow(id);

  if (win != null) {
    if (!doNotRestore) {
      this.restore(id, form);
    }

    win.style.left = 0;
    win.style.top = 0;
  }
};

scWindowManager.prototype.register = function(win, header, icon) {
  if (win.frameElement != null) {
    this.sequencer++;

    var id = win.frameElement.id;

    if (id == null || id == "") {
      id = "win" + this.sequencer.toString();
      win.frameElement.id = id;
    }

    this.windows.push(id);

    this.addApplication(id, header, icon);

    this.updateWindowOrder();

    win.floatBounds = new scRect();
    win.floatBounds.getControlRect(win);

    return this.isDocked(win.frameElement);
  }

  return false;
};

scWindowManager.prototype.resizeStart = function(tag, evt, id, hit) {
  var win = this.getWindow(id);
  if (win != null && this.canResize(win)) {
    this.mode = hit;

    this.bringToFront(id);

    this.bounds = new scRect();
    this.bounds.getControlRect(win);

    this.trackCursor = new scPoint();
    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    scForm.browser.clearEvent(evt, false);

    return true;
  }

  return false;
};

scWindowManager.prototype.resizeMove = function(tag, evt, id) {
  if (this.outline == null) {
    this.outline = this.createOutline(this.bounds);
  }

  var dx = evt.screenX - this.trackCursor.x;
  var dy = evt.screenY - this.trackCursor.y;

  if (this.mode.indexOf("left") >= 0) {
    this.bounds.left += dx;
    this.bounds.width -= dx;
  } else if (this.mode.indexOf("right") >= 0) {
    this.bounds.width += dx;
  }

  if (this.mode.indexOf("top") >= 0) {
    var possibleTop = this.bounds.top + dy;
    if (possibleTop >= 0) {
      this.bounds.top = possibleTop;
      this.bounds.height -= dy;
    } else {
      this.bounds.top = 0;
    }

  } else if (this.mode.indexOf("bottom") >= 0) {
    this.bounds.height += dy;
  }

  this.bounds.normalize();

  if (this.bounds.width < 150) {
    this.bounds.width = 150;
  }

  if (this.bounds.height < 64) {
    this.bounds.height = 64;
  }

  this.bounds.apply(this.outline);

  this.trackCursor.setPoint(evt.screenX, evt.screenY);

  scForm.browser.clearEvent(evt, false);
};

scWindowManager.prototype.resizeEnd = function(tag, evt, id) {
  var win = this.getWindow(id);

  this.bounds.apply(win);

  win.floatBounds = new scRect();
  win.floatBounds.assign(this.bounds);

  if (this.outline != null) {
    this.closeOutline(this.outline);
    this.outline = null;
  }

  scForm.browser.releaseCapture(tag);

  scForm.browser.clearEvent(evt, false);
};

scWindowManager.prototype.reset = function() {
  this.windows = new Array();
  this.sequencer = 0;
  this.mode = "";
};

scWindowManager.prototype.restore = function(id, form) {
  if (id == null && form != null) {
    id = this.getIDFromContextMenu(form);
  }

  var handler = this.getWindowHandler(id);
  var win = this.getWindow(id);

  if (win != null) {
    var maximize = false;

    if (handler.minimized) {
      handler.minimized = false;
      maximize = handler.maximized;
    } else if (handler.maximized) {
      handler.maximized = false;
    }

    if (maximize) {
      win.style.left = "0px";
      win.style.top = "0px";
      win.style.width = "100%";
      win.style.height = "100%";
    } else if (handler.bounds != null) {
      win.style.left = handler.bounds.left + "px";
      win.style.top = handler.bounds.top + "px";
      win.style.width = handler.bounds.width + "px";
      win.style.height = handler.bounds.height + "px";
    }

    this.bringToFront(id);
    this.show(id);

    $(win).fire("sc:onWindowRestore");
  }
};

scWindowManager.prototype.show = function(id) {
  var win = this.getWindow(id);

  if (win != null) {
    win.style.display = "";
  }
};

scWindowManager.prototype.unregister = function(id) {
  var n = this.findWindow(id);

  if (n >= 0) {
    this.windows.splice(n, 1);

    this.removeApplication(id);

    this.updateWindowOrder();
  }
};

scWindowManager.prototype.unloadWindow = function(id) {
  var n = this.findWindow(id);

  if (n >= 0) {
    this.removeApplication(id);
  }

  this.unregister(id);
};

scWindowManager.prototype.updateWindowOrder = function() {
  var top = false;

  for (var n = this.windows.length - 1; n >= 0; n--) {
    var id = this.windows[n];
    var win = this.getWindow(id);

    if (win != null) {
      var visible = win.style.display != "none";

      var zIndex = (visible ? n + 1 : 0);

      if (win.style.zIndex != zIndex) {
        win.style.zIndex = zIndex;
      }

      if (visible && !top) {
        this.activateApplication(id);
        top = true;
      } else {
        this.deactivateApplication(id);
      }
    }
  }
};

///----------------------------------------------------------------------------

scWindowManager.prototype.activateApplication = function(id) {
  var ctl = this.getApplication(id);

  if (ctl != null) {
    ctl.className = "scActiveApplication";
  }
};

scWindowManager.prototype.addApplication = function(id, header, icon) {
  var row = this.getApplications();

  if (row != null) {
    cell = this.browser.tableAddCell(row);

    cell.style.cursor = "default";
    cell.noWrap = true;
    cell.id = "startbar_application_" + id;

    if (icon != "") {
      icon = this.browser.getImage(icon, 16, 16, "middle", "0px 8px 0px 0px");
    }

    cell.innerHTML =
      "<div class=\"scStartBarApplication\" onclick=\"javascript:return scManager.focus(this, event)\" oncontextmenu='javascript:return scForm.postEvent(this, event, \"ApplicationMenu.Show\")'>" +
        "<span>" + icon + header + "</span>" +
        "</div>";
  }
};

scWindowManager.prototype.deactivateApplication = function(id) {
  var ctl = this.getApplication(id);
  if (ctl) {
    ctl.className = "scInactiveApplication";
  };
};

scWindowManager.prototype.getApplication = function(id) {
  return scForm.browser.getControl("startbar_application_" + id);
};

scWindowManager.prototype.getApplications = function() {
  var table = scForm.browser.getControl("StartbarApplications");

  if (table != null) {
    return this.browser.tableGetRow(table, 0);
  }

  return null;
};

scWindowManager.prototype.removeApplication = function(id) {
  var ctl = this.getApplication(id);

  if (ctl != null) {
    scForm.browser.removeChild(ctl);
  }
};

scWindowManager.prototype.updateImage = function(element, src) {
  if (element.src != src) {
    element.src = src;
  }
};

scWindowManager.prototype.updateBackground = function(element, background) {
  if (element.style.background != background) {
    element.style.background = background;
  }
};

///============================================================================

function scWindowManagerIE() {
}

scWindowManagerIE.prototype.getImage = function(src, width, height, align, margin, style) {
  style = (style == null ? "" : style);a
  style += (margin != "" && margin != null ? (style != "" ? ";" : "") + "margin:" + margin : "");
  src = this.getThemedImage(src, "" + width + "x" + height);

  if (src.indexOf(".png") >= 0) {
    style += (style != "" ? ";" : "") + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')";
    src = "/sitecore/images/blank.gif";
  }

  style = (style != "" ? " style=\"" + style + "\"" : "");
  align = (align != null && align != "" ? " align=\"" + align + "\"" : "");

  var result = "<img src=\"" + src + "\" border=\"0\" alt=\"\" width=\"" + width + "\" height=\"" + height + "\"" + style + align + " />"

  return result;
};

scWindowManagerIE.prototype.getThemedImage = function(src, size) {
  if (src == "") {
    return "/sitecore/images/blank.gif";
  }

  src = this.getThemedSrc(src);

  if (size != null) {
    src = src.replace(/\d\dx\d\d/gi, size)
  }

  return src;
};

scWindowManagerIE.prototype.getThemedSrc = function(src) {
  if (src.charAt(0) != "/") {
    src = "/~/icon/" + src;
  }

  var position = src.indexOf("?", 0);
  if (position > -1) {
    var tempSrc = src.substring(0, position);
    tempSrc = tempSrc + ".ashx";
    tempSrc = tempSrc + src.substr(position, src.length - position);
    src = tempSrc;
  } else {
    src = src + ".ashx";
  }
  return src;
};


scWindowManagerIE.prototype.tableGetRow = function(table, row) {
  return table.rows[0];
};

scWindowManagerIE.prototype.tableAddCell = function(row) {
  return row.insertCell(-1);
};

///============================================================================

function scWindowManagerMozilla() {
}

scWindowManagerMozilla.prototype.getImage = function(src, width, height, align, margin, style) {
  style = (style == null ? "" : style);
  style += (margin != "" && margin != null ? (style != "" ? ";" : "") + "margin:" + margin : "");
  src = this.getThemedImage(src, "" + width + "x" + height);

  if (align == "absmiddle") {
    align = "middle";
  }

  style = (style != "" ? " style=\"" + style + "\"" : "");
  align = (align != null && align != "" ? " align=\"" + align + "\"" : "");

  var result = "<img src=\"" + src + "\" border=\"0\" alt=\"\" width=\"" + width + "\" height=\"" + height + "\"" + style + align + " />"

  return result;
};

scWindowManagerMozilla.prototype.getThemedImage = function(src, size) {
  if (src == "") {
    return "/sitecore/images/blank.gif";
  }

  src = this.getThemedSrc(src);

  if (size != null) {
    src = src.replace(/\d\dx\d\d/gi, size)
  }

  return src;
};

scWindowManagerMozilla.prototype.getThemedSrc = function(src) {
  if (src.charAt(0) != "/") {
    src = "/~/icon/" + src;
  }

  var position = src.indexOf("?", 0);
  if (position > -1) {
    var tempSrc = src.substring(0, position);
    tempSrc = tempSrc + ".ashx";
    tempSrc = tempSrc + src.substr(position, src.length - position);
    src = tempSrc;
  } else {
    src = src + ".ashx";
  }
  return src;
};

scWindowManagerMozilla.prototype.tableGetRow = function(table, row) {
  var tbody = table.childNodes[0];

  if (tbody.tagName == "TBODY") {
    table = tbody;
  }

  return table.childNodes[row];
};

scWindowManagerMozilla.prototype.tableAddCell = function(row) {
  var result = document.createElement("td");

  row.appendChild(result);

  return result;
};

///============================================================================

scManager = new scWindowManager();

///============================================================================

function scDockResizerMouseDown() {
  scManager.dockResizerMouseDown();
}

function scDockResizerMouseMove() {
  scManager.dockResizerMouseMove();
}

function scDockResizerMouseUp() {
  scManager.dockResizerMouseUp();
}

function scWindowManagerInitialize() {
  scManager.zones = new Array();
  
  for(var e = scForm.browser.getEnumerator(document.getElementsByTagName("*")); !e.atEnd(); e.moveNext()) {
    var ctl = e.item();
    
    if (ctl.className.indexOf("DockZone") >= 0) {
      scManager.zones.push(ctl);
    }
  }
}

scWindowManager.prototype.canResize = function(win) {
  return !this.isDocked(win);
};

scWindowManager.prototype.createDockResizerOutline = function(bounds, tag) {
  var result = document.createElement("div");

  result.style.border = "2px ridge";
  result.style.position = "absolute";
  result.style.zIndex = "9999";
  result.style.cursor = "col-resize";
  result.style.fontSize = "1px";

  this.bounds.apply(result);

  if (tag != null) {
    tag.appendChild(result);
  }

  return result;
};

scWindowManager.prototype.dock = function(win, zone) {
  win.style.position = "";
  win.style.width = "100%";
  win.style.height = "100%";
  win.contentWindow.scWin.setDocked(true);

  zone.appendChild(win);
};

scWindowManager.prototype.dockResizerMouseDown = function() {
  var evt = event;

  if (!this.dockResizing) {
    var ctl = evt.srcElement;

    while (ctl != null) {
      if (ctl.zoneTabs != null) {
        return;
      }
      ctl = ctl.parentNode;
    }

    this.resizer = evt.srcElement;

    this.resizeFactor = 1;
    var parent = null;

    this.resizerType = this.getZoneType(this.resizer);

    if (this.resizerType != "") {
      this.bounds = this.getControlScreenRect(this.resizer);

      parent = this.resizer.parentNode.parentNode.parentNode.parentNode;

      switch (this.resizerType) {
      case "top":
        this.resizeOffset = this.bounds.height;
        this.bounds.top += this.bounds.height - 3;
        this.bounds.height = 3;
        this.resizeSize = parent.offsetHeight;
        break;
      case "bottom":
        this.resizeOffset = this.bounds.top;
        this.bounds.height = 3;
        this.resizeSize = parent.offsetHeight;
        this.resizeFactor = -1;
        break;
      case "left":
        this.resizeOffset = this.bounds.width;
        this.bounds.left += this.bounds.width - 3;
        this.bounds.width = 3;
        this.resizeSize = parent.offsetWidth;
        break;
      case "right":
        this.resizeOffset = this.bounds.left;
        this.bounds.width = 3;
        this.resizeSize = parent.offsetWidth;
        this.resizeFactor = -1;
        break;
      }

      this.resizeControl = this.resizer;
    } else {
      while (this.resizer != null && this.resizer.tagName != "TD") {
        this.resizer = this.resizer.parentNode;
      }

      if (this.resizer != null) {
        this.resizerType = this.resizer.className.substr(this.resizer.className.indexOf("_") + 1);

        this.bounds = this.getControlScreenRect(this.resizer);

        parent = this.resizer.parentNode.parentNode.parentNode;

        if (this.resizerType == "left" || this.resizerType == "right") {
          this.resizeControl = scForm.browser.getPreviousSibling(this.resizer);
          this.resizeOffset = this.resizeControl.offsetWidth;
          this.resizeSize = this.resizer.offsetParent.offsetWidth;
        } else {
          this.resizeControl = scForm.browser.getPreviousSibling(this.resizer.parentNode).childNodes[0];
          this.resizeOffset = this.resizeControl.offsetHeight;
          this.resizeSize = this.resizer.offsetParent.offsetHeight;
        }
      }
    }

    if (this.resizer != null) {
      var rect = this.getControlScreenRect(parent);
      this.boundsOrigin = new scPoint(rect.left, rect.top);

      this.trackCursor = new scPoint(evt.screenX, evt.screenY);

      this.dockResizing = true;
      this.delta = 0;

      scForm.browser.setCapture(this.resizer);

      scForm.browser.clearEvent(evt, true, false);
    }
  }
};

scWindowManager.prototype.dockResizerMouseMove = function() {
  var evt = event;

  if (this.dockResizing) {
    if (this.outline == null) {
      this.outline = this.createDockResizerOutline(this.bounds, this.resizer);
    }

    if (this.resizerType == "left" || this.resizerType == "right") {
      var dx = evt.screenX - this.trackCursor.x;

      this.delta += dx;

      var offset = this.resizeOffset + this.delta;

      this.bounds.left = this.boundsOrigin.x + (offset >= 32 ? (offset < this.resizeSize - 32 ? offset : this.resizeSize - 32) : 32);
    } else {
      var dy = evt.screenY - this.trackCursor.y;

      this.delta += dy;

      var offset = this.resizeOffset + this.delta;

      this.bounds.top = this.boundsOrigin.y + (offset >= 32 ? (offset < this.resizeSize - 32 ? offset : this.resizeSize - 32) : 32);
    }

    this.bounds.apply(this.outline);

    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    scForm.browser.clearEvent(evt, true, false);
  }
};

scWindowManager.prototype.dockResizerMouseUp = function() {
  var evt = event;

  if (this.dockResizing) {
    this.dockResizing = false;

    scForm.browser.clearEvent(evt, true, false);

    scForm.browser.releaseCapture(this.resizer);

    if (this.outline != null) {
      this.closeOutline(this.outline);
      this.outline = null;
    }

    var ctl = this.resizer;

    if (this.resizerType == "left" || this.resizerType == "right") {
      var offset = this.resizeControl.offsetWidth + this.delta * this.resizeFactor;

      offset = (offset >= 32 ? (offset < this.resizeSize - 32 ? offset : this.resizeSize - 32) : 32) + "px";

      this.resizeControl.style.width = offset + "px";

      if (this.resizeControl.parentNode.tagName == "TD") {
        this.resizeControl.parentNode.style.width = offset + "px";
      }
    } else {
      var offset = this.resizeControl.offsetHeight + this.delta * this.resizeFactor;

      offset = (offset >= 32 ? (offset < this.resizeSize - 32 ? offset : this.resizeSize - 32) : 32) + "px";

      this.resizeControl.style.height = offset;

      if (this.resizeControl.parentNode.tagName == "TD") {
        this.resizeControl.parentNode.style.height = offset;
      }
    }

    this.resizer = null;
    this.resizeControl = null;
  }
};

scWindowManager.prototype.dockZone = function(zone, win, evt) {
  var type = this.getZoneType(zone);
  var dockCell = null;
  var dockCell2 = null;

  var bounds = this.getControlScreenRect(zone);

  if (zone.childNodes.length == 0) {
    switch (type) {
    case "top":
      zone.style.height = this.outline.offsetHeight + "px";
      zone.style.padding = "0px 0px 3px 0px";
      break;
    case "left":
      zone.style.width = this.outline.offsetWidth + "px";
      zone.style.padding = "0px 3px 0px 0px";
      break;
    case "right":
      zone.style.width = this.outline.offsetWidth + "px";
      zone.style.padding = "0px 0px 0px 3px";
      break;
    case "bottom":
      zone.style.height = this.outline.offsetHeight + "px";
      zone.style.padding = "3px 0px 0px 0px";
      break;
    }

    dockCell = zone;

    zone.onmousedown = scDockResizerMouseDown;
    zone.onmousemove = scDockResizerMouseMove;
    zone.onmouseup = scDockResizerMouseUp;
    zone.style.cursor = "col-resize";
  } else {
    var cell = null;

    if (zone.childNodes[0].tagName == "TABLE") {
      if (zone.childNodes[0].zoneType == "fill") {
        cell = zone.childNodes[0];
      } else {
        var point = new scPoint(this.windowBounds.left + evt.clientX, this.windowBounds.top + evt.clientY);
        cell = this.getZoneCell(zone.childNodes[0], point, win);
      }
    } else {
      cell = zone.childNodes[0];
    }

    var area = this.getZoneCellType(cell, evt);

    switch (area) {
    case "fill":
      if (cell.zoneType == "fill") {
        var table = cell;
        dockCell = table.rows[0].cells[0];
        dockCell2 = null;
        cell = null;
      } else {
        var table = this.getDockTable();
        table.zoneType = "fill";
        var row = table.insertRow();
        dockCell = row.insertCell();
        dockCell2 = dockCell;
        row = table.insertRow();

        var tabs = row.insertCell();
        tabs.style.background = "threedlightshadow";
        tabs.style.padding = "4px 0px 4px 0px";
        tabs.zoneTabs = true;
        tabs.style.fontSize = "8pt";
        tabs.style.cursor = "default";
        tabs.valign = "top";
        tabs.height = "1%";
      }
      break;
    case "top":
      var table = this.getDockTable();
      var row = table.insertRow();
      dockCell = row.insertCell();
      this.insertDockResizer(table, null, "top");
      row = table.insertRow();
      dockCell2 = row.insertCell();
      break;
    case "bottom":
      var table = this.getDockTable();
      var row = table.insertRow();
      dockCell2 = row.insertCell();
      this.insertDockResizer(table, null, "bottom");
      row = table.insertRow();
      dockCell = row.insertCell();
      break;
    case "left":
      var table = this.getDockTable();
      var row = table.insertRow();
      dockCell = row.insertCell();
      this.insertDockResizer(table, row, "left");
      dockCell2 = row.insertCell();
      break;
    case "right":
      var table = this.getDockTable();
      var row = table.insertRow();
      dockCell2 = row.insertCell();
      this.insertDockResizer(table, row, "right");
      dockCell = row.insertCell();
      break;
    default:
      return false;
    }
  }

  if (dockCell != null) {
    if (this.isDocked(win)) {
      this.undock(win);
    } else {
      win.floatBounds = new scRect();
      win.floatBounds.getControlRect(win);
    }

    if (cell != null && table != null) {
      cell.parentNode.appendChild(table);
    }

    if (dockCell2 != null) {
      dockCell2.appendChild(cell);
    }

    this.dock(win, dockCell);

    if (area == "fill") {
      this.selectZoneTab(table, table.rows[0].cells[0].childNodes.length - 1);
    }

    return true;
  }

  return false;
};

scWindowManager.prototype.dragDockZone = function(zone, evt, win) {
  var type = this.getZoneType(zone);
  var bounds = this.getControlScreenRect(zone);

  win.floatBounds

  if (zone.childNodes.length == 0) {
    switch (type) {
    case "top":
      bounds.height = win.floatBounds.height;
      break;
    case "left":
      bounds.width = win.floatBounds.width;
      break;
    case "right":
      bounds.left -= win.floatBounds.width - bounds.width;
      bounds.width = win.floatBounds.width;
      break;
    case "bottom":
      bounds.top -= win.floatBounds.height - bounds.height;
      bounds.height = win.floatBounds.height;
      break;
    }
  } else {
    bounds = this.getZoneCellBounds(zone, evt, win);
  }

  return bounds;
};

scWindowManager.prototype.getControlScreenRect = function(control, offset) {
  var result = new scRect();

  result.getControlRect(control);
  result.clientToScreen(offset != null ? offset : control);

  return result;
};

scWindowManager.prototype.getDockedZone = function(win) {
  return this.isDocked(win) ? win.parentNode : null;
};

scWindowManager.prototype.getDockTable = function(cell) {
  var table = document.createElement("table");

  table.width = "100%";
  table.height = "100%";
  table.cellPadding = "0";
  table.cellSpacing = "0";
  table.style.tableLayout = "fixed";

  return table;
};

scWindowManager.prototype.getDockZone = function(evt) {
  var x = this.windowBounds.left + evt.clientX;
  var y = this.windowBounds.top + evt.clientY;

  if (this.zones != null) {
    var defaultZone = null;

    for (var n = 0; n < this.zones.length; n++) {
      var zone = this.zones[n];
      var rect = this.getControlScreenRect(zone);
      var type = this.getZoneType(zone);

      if (rect.width <= 16) {
        if (type == "right") {
          rect.left -= 16;
        }
        rect.width = 16;
      }

      if (rect.height <= 16) {
        if (type == "bottom") {
          rect.top -= 16;
        }
        rect.height = 16;
      }

      if (x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height) {
        if (rect.width > 16 && rect.height > 16) {
          return zone;
        }
        defaultZone = zone;
      }
    }

    return defaultZone;
  }

  return null;
};

scWindowManager.prototype.getZoneCell = function(table, point) {
  var rect = new scRect();

  for (var e = scForm.browser.getEnumerator(table.cells); !e.atEnd(); e.moveNext()) {
    var cell = e.item();

    rect.getControlRect(cell);
    rect.clientToScreen(cell.offsetParent);

    if (rect.contains(point.x, point.y)) {
      if (cell.childNodes.length > 0 && cell.childNodes[0].tagName == "TABLE") {
        var r = this.getZoneCell(cell.childNodes[0], point);

        if (r != null) {
          return r;
        }
      }

      return cell.childNodes[0];
    }
  }

  return null;
};

scWindowManager.prototype.getZoneCellBounds = function(zone, evt, win) {
  var cell = null;

  if (zone.childNodes[0].tagName == "TABLE") {
    if (zone.childNodes[0].zoneType == "fill") {
      cell = zone;
    } else {
      var point = new scPoint(this.windowBounds.left + evt.clientX, this.windowBounds.top + evt.clientY);

      cell = this.getZoneCell(zone.childNodes[0], point);

      if (zone.childNodes[0] == win) {
        return null;
      }
    }
  } else {
    if (zone.childNodes[0] != win) {
      cell = zone;
    }
  }

  if (cell != null) {
    var bounds = this.getControlScreenRect(cell);

    var rect = new scRect();
    rect.getControlRect(cell);

    var area = this.getZoneCellType(cell, evt);

    switch (area) {
    case "fill":
      break;
    case "top":
      bounds.height = rect.height / 2;
      break;
    case "bottom":
      bounds.height = rect.height / 2;
      bounds.top += (rect.height / 2);
      break;
    case "left":
      bounds.width = rect.width / 2;
      break;
    case "right":
      bounds.width = rect.width / 2;
      bounds.left += (rect.width / 2);
      break;
    default:
      bounds = null;
    }

    return bounds;
  }

  return null;
};

scWindowManager.prototype.getZoneCellType = function(cell, evt) {
  var point = new scPoint(this.windowBounds.left + evt.clientX, this.windowBounds.top + evt.clientY);

  var rect = this.getControlScreenRect(cell, cell.offsetParent);

  if (point.y >= rect.top && point.y < rect.top + this.dockSize) {
    if (point.x > rect.left + rect.width / 3 && point.x < rect.left + (rect.width / 3) * 2) {
      return "fill";
    } else {
      return "top";
    }
  } else if (point.y >= rect.top + rect.height - this.dockSize && point.y < rect.top + rect.height) {
    return "bottom";
  } else if (point.x >= rect.left && point.x < rect.left + this.dockSize) {
    return "left";
  } else if (point.x >= rect.left + rect.width - this.dockSize && point.x < rect.left + rect.width) {
    return "right";
  }

  return "";
};

scWindowManager.prototype.getZoneType = function(zone) {
  if (zone.className.indexOf("scTopDockZone") >= 0) {
    return "top";
  } else if (zone.className.indexOf("scLeftDockZone") >= 0) {
    return "left";
  } else if (zone.className.indexOf("scRightDockZone") >= 0) {
    return "right";
  } else if (zone.className.indexOf("scBottomDockZone") >= 0) {
    return "bottom";
  }

  return "";
};

scWindowManager.prototype.insertDockResizer = function(table, row, type) {
  if (row == null) {
    row = table.insertRow();
  }

  var cell = row.insertCell();
  cell.className = "scDockResizer_" + type;
  cell.innerHTML = "<img src=\"/sitecore/images/blank.gif\" width=\"1\" height=\"1\" border=\"0\" alt=\"\"/>";
  cell.style.background = "appworkspace";
  cell.width = "3";
  cell.height = "3";
  cell.style.cursor = "move";

  cell.onmousedown = scDockResizerMouseDown;
  cell.onmousemove = scDockResizerMouseMove;
  cell.onmouseup = scDockResizerMouseUp;
};

scWindowManager.prototype.isDocked = function(win) {
  return win.style.position != "absolute";
};

scWindowManager.prototype.undock = function(win) {
  var zone = this.getDockedZone(win);

  win.style.position = "absolute";
  win.floatBounds.apply(win);
  win.contentWindow.scWin.setDocked(false);

  var type = this.getZoneType(zone);

  if (zone.tagName == "TD") {
    var table = zone.parentNode.parentNode.parentNode;
    var cell = null;

    if (table.rows.length == 2) {
      var childNodes = table.rows[0].cells[0].childNodes;
      for (var index = 0; index < childNodes.length; index++) {
        if (childNodes[index] == win) {
          break;
        }
      }

      if (childNodes.length > 2) {
        if (index > 0) {
          index--;
        }

        scForm.browser.removeChild(win);
        document.body.appendChild(win);

        this.selectZoneTab(table, index);

        return;
      }

      cell = childNodes[1 - index];
      cell.style.display = "";
    } else if (table.rows.length == 3) {
      if (table.rows[0].cells[0] == zone) {
        cell = table.rows[2].cells[0].childNodes[0];
      } else {
        cell = table.rows[0].cells[0].childNodes[0];
      }
    } else {
      if (table.rows[0].cells[0] == zone) {
        cell = table.rows[0].cells[2].childNodes[0];
      } else {
        cell = table.rows[0].cells[0].childNodes[0];
      }
    }

    table.parentNode.appendChild(cell);
    scForm.browser.removeChild(table);
  }

  document.body.appendChild(win);

  if (zone.childNodes.length == 0) {
    switch (type) {
    case "top":
      zone.style.height = 1 + "px";
      break;
    case "left":
      zone.style.width = 1 + "px";
      break;
    case "right":
      zone.style.width = 1 + "px";
      break;
    case "bottom":
      zone.style.height = 1 + "px";
      break;
    }

    zone.style.padding = "0px";
    zone.onmousedown = null;
    zone.onmousemove = null;
    zone.onmouseup = null;
    zone.style.cursor = "default";

    if (zone.parentNode.tagName == "TD") {
      zone.parentNode.style.width = "";
      zone.parentNode.style.height = "";
    }
  }
};

scWindowManager.prototype.updateZoneTabs = function(table) {
  var text = "";

  var cell = table.rows[0].cells[0];

  for (var n = 0; n < cell.childNodes.length; n++) {
    var win = cell.childNodes[n];

    if (text != "") {
      text += "&nbsp;|&nbsp;|"
    }

    if (win.style.display == "") {
      text += "<b>";
    }

    text += win.getAttribute("scHeader");

    if (win.style.display == "") {
      text += "</b>";
    }
  }

  table.rows[1].cells[0].innerHTML = text;
};

scWindowManager.prototype.selectZoneTab = function(table, index) {
  var evt = event;

  while (table != null && table.tagName != "TABLE") {
    table = table.parentNode;
  }

  var cell = table.rows[0].cells[0];

  var text = "";

  for (var n = 0; n < cell.childNodes.length; n++) {
    var win = cell.childNodes[n];

    win.style.display = (n == index ? "" : "none");

    var style = (n == index ?
      "border-left:1px solid white; border-top:none; border-bottom:1px solid threedfacedarkshadow; border-right:1px solid threedfacedarkshadow; background:threedface; margin:0px 2px 0px 2px; padding:2px 4px 2px 4px; text-overflow:ellipsis; white-space:nowrap" :
      "color:graytext; margin:0px 2px 0px 2px; padding:2px 5px 3px 5px; text-overflow:ellipsis; white-space:nowrap");

    var header = null;
    var ctl = win.contentWindow.scForm.browser.getControl("Caption");
    if (ctl != null) {
      header = ctl.innerText;
    }

    if (header == null) {
      header = "Pane";
    }

    text += "<span style=\"" + style + "\" onclick=\"javascript:return scManager.selectZoneTab(this, " + n + ")\">" + header + "</span> ";
  }

  table.rows[1].cells[0].innerHTML = text;

  if (evt != null) {
    scForm.browser.clearEvent(evt, true, false);
  }

  return false;
};

// ===========================================

scWindowManager.prototype.expose = function() {
  var evt = event;

  if (evt == null) {
    evt = scForm.lastEvent;
  }

  var isExposeKey = evt.keyCode == 113;

  switch (evt.type) {
  case "keypress":
  case "keydown":
    if (isExposeKey) {
      if (this.exposeWindows != null) {
        this.hideExpose();
      } else {
        this.showExpose();
      }
    }
    break;
  case "mousedown":
    if (this.exposeWindows != null) {
      this.hideExpose();
    }
    break;
  }
};

scWindowManager.prototype.showExpose = function() {
  if (this.windows.length == 0) {
    return;
  }

  scForm.browser.setCapture(document.body);

  this.exposeWindows = new Array();

  var x = Math.ceil(Math.sqrt(this.windows.length));
  var y = Math.ceil(this.windows.length / x);

  var width = Math.floor(document.body.offsetWidth / x);
  var height = Math.floor(document.body.offsetHeight / y);

  for (var n = 0; n < this.windows.length; n++) {
    var id = this.windows[n];

    var win = this.getWindow(id);

    if (win != null) {
      var info = new Object();

      info.width = win.style.width.toString();
      info.height = win.style.height.toString();
      info.left = win.style.left.toString();
      info.top = win.style.top.toString();

      this.exposeWindows.push(info);

      var dx = width / win.offsetWidth;
      var dy = height / win.offsetHeight;

      var d = dx > dy ? dy : dx;

      if (d > 1) {
        d = 1;
      }

      win.style.width = (win.offsetWidth * d) + "px";
      win.style.height = (win.offsetHeight * d) + "px";

      win.style.left = (((n % x) * width) + (width - win.offsetWidth) / 2) + "px";
      win.style.top = ((Math.floor(n / x) * height) + (height - win.offsetHeight) / 2) + "px";

      win.contentWindow.document.body.style.zoom = Math.ceil(d * 100).toString() + "%";
    }
  }
};

scWindowManager.prototype.hideExpose = function() {
  scForm.browser.releaseCapture(document.body);

  for (var n = 0; n < this.windows.length; n++) {
    var id = this.windows[n];

    var win = this.getWindow(id);

    if (win != null) {
      var info = this.exposeWindows[n];

      win.style.width = info.width + "px";
      win.style.height = info.height + "px";
      win.style.left = info.left + "px";
      win.style.top = info.top + "px";

      win.contentWindow.document.body.style.zoom = "";
    }
  }

  this.exposeWindows = null;
};

function scExpose() {
  scManager.expose();
}

function MultipleCallbackListener(expectedCallbacksCount, onAllCallbacksReceived) {
  this.active = true;
  this.receivedCallbacksCount = 0;
  this.expectedCallbacksCount = expectedCallbacksCount;
  this.onAllCallbacksReceived = onAllCallbacksReceived;
}

MultipleCallbackListener.prototype.onCallbackReceived = function (result) {
  if (!this.active) {
    return;
  }

  this.receivedCallbacksCount++;

  if (result == false) {
    this.onCallbackReceived(false);
    this.active = false;
  }

  if (this.receivedCallbacksCount == this.expectedCallbacksCount) {
    this.onAllCallbacksReceived(true);
    this.active = false;
  }
};

scForm.browser.attachEvent(document, "onmousedown", scExpose);
if (window.top == window) {
  scForm.registerKey("c113", "javascript:scManager.expose()");
}