function scSitecoreModalWindow() {
}

scSitecoreModalWindow.prototype.disableWindow = function(win) {
  win.attachEvent("onfocus", scSitecoreModalWindowLostFocus);
  win.document.attachEvent("oncontextmenu", scSitecoreModalWindowLostFocus);
  win.document.attachEvent("onclick", scSitecoreModalWindowLostFocus);
  win.document.attachEvent("ondblclick", scSitecoreModalWindowLostFocus);

  for (var n = 0; n < win.frames.length; n++) {
    this.disableWindow(win.frames[n]);
  }
};

scSitecoreModalWindow.prototype.enableWindow = function(win) {
  try {
    win.detachEvent("onfocus", scSitecoreModalWindowLostFocus);
    win.document.detachEvent("oncontextmenu", scSitecoreModalWindowLostFocus);
    win.document.detachEvent("onclick", scSitecoreModalWindowLostFocus);
    win.document.detachEvent("ondblclick", scSitecoreModalWindowLostFocus);
  } catch(e) {
  }

  for (var n = 0; n < win.frames.length; n++) {
    this.enableWindow(win.frames[n]);
  }
};

scSitecoreModalWindow.prototype.cancelEvent = function(win) {
  if (win.event != null) {
    win.event.returnValue = false;
    win.event.cancelBubble = true;
  }

  for (var n = 0; n < win.frames.length; n++) {
    this.cancelEvent(win.frames[n]);
  }
};

function scSitecoreModalWindowLostFocus() {
  window.focus();

  scModalWindow.cancelEvent(window.opener.top);
}

function scSitecoreModalWindowInitialize() {
  scModalWindow = new scSitecoreModalWindow();

  if (window.opener != null) {
    scModalWindow.disableWindow(window.opener.top);
  }
}

function scSitecoreModalWindowFinalize() {
  if (window.opener != null) {
    scModalWindow.enableWindow(window.opener.top);
  }
}

var scModalWindow;

window.attachEvent("onload", scSitecoreModalWindowInitialize);
window.attachEvent("onunload", scSitecoreModalWindowFinalize);
