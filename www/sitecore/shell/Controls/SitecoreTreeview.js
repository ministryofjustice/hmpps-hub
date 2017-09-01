function scTreeviewMouseDown() {
  var evt = window.event;
  
  if (evt.shiftKey) {
    var ctl = evt.srcElement;
    while (ctl != null && ctl.tagName != "TR") {
      ctl = ctl.parentNode;
    }
    
    scTreeviewElement = ctl;
    scTreeviewMouseY = evt.screenY;
    scTreeviewSibling = ctl.nextSibling;
    scTreeviewMove = ctl.onmousemove;
    
    ctl.ommousemove = scTreeviewMouseMove;
    ctl.attachEvent("ommouseup", scTreeviewMouseUp);
    
    scForm.browser.setCapture(ctl);
    scForm.browser.clearEvent(evt, true);
    
    return false;
  }
  
  return true;
}

function scTreeviewMouseMove() {
  var evt = window.event;

  var dy = evt.screenY - scTreeviewMouseY;
  
  var y = evt.offsetY;

  var ctl = evt.srcElement;
  
  while (ctl != null && ctl.tagName != "TR") {
    y += ctl.offsetLeft;
    ctl = ctl.parentNode;
  }

  if (ctl != scTreeviewElement) {
    if (dy > 0 && y < 4) {
      ctl.parentNode.insertBefore(scTreeviewElement, ctl.nextSibling);
    }
    else if (dy < 0 && y > ctl.offsetHeight - 4) {
      ctl.parentNode.insertBefore(scTreeviewElement, ctl);
    }
  }
  
  scTreeviewMouseY = evt.screenY;
  
  scForm.browser.clearEvent(evt, true);
}

function scTreeviewMouseUp() {
  var evt = window.event;

  scForm.browser.releaseCapture(scTreeviewElement);
  
  ctl.onmousemove = scTreeviewMove;
  ctl.detachEvent("ommouseup", scTreeviewMouseUp);

  scTreeviewMove = null;
  scTreeviewElement = null;
  scTreeviewSibling = null;
  
  scForm.browser.clearEvent(evt, true);
}
