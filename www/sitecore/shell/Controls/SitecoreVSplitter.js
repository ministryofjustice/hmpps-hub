function scVSplitter() {
  this.dragging = false;
}

scVSplitter.prototype.createOutline = function(bounds, tag) {
  var result = document.createElement("div");

  result.style.border = "2px ridge";
  result.style.position = "absolute";
  result.style.zIndex = "9999";
  result.style.cursor = "col-resize";
  
  this.bounds.apply(result);

  /*
  var ctl = tag;

  while (ctl != null && ctl.tagName != "TD") {
    ctl = ctl.parentNode;
  }
  */
  
  ctl = document.body;
  
  if (ctl != null) {
    ctl.appendChild(result);
  }
  
  return result;
}

scVSplitter.prototype.mouseDown = function (tag, evt, id, target) {
  if (!this.dragging) {
    this.bounds = new scRect();
    this.bounds.getControlRect(tag);
    this.bounds.clientToScreen(tag);

    if (!scForm.browser.isIE) {
      this.bounds.height -= 4;
    }

    this.trackCursor = new scPoint();
    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    this.dragging = true;
    this.delta = 0;

    scForm.browser.setCapture(tag, function (tag, evt) { scVSplit.mouseMove(tag, evt, id, target) });

    scForm.browser.clearEvent(evt, false);

    return false;
  }
}

scVSplitter.prototype.mouseMove = function (tag, evt, id, target) {
  if (this.dragging) {
    if (evt.type == "mouseup") {
      return this.mouseUp(tag, evt, id, target);
    }

    if (this.outline == null) {
      this.outline = this.createOutline(this.bounds, tag);
    }

    var dx = evt.screenX - this.trackCursor.x;

    this.bounds.offset(dx, 0);

    this.delta += dx;

    this.bounds.apply(this.outline);

    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    scForm.browser.clearEvent(evt, false);

    return false;
  }
}

scVSplitter.prototype.mouseUp = function (tag, evt, id, target) {
  if (this.dragging) {
    this.dragging = false;

    scForm.browser.clearEvent(evt, false);

    scForm.browser.releaseCapture(tag);

    if (this.outline != null) {
      scForm.browser.removeChild(this.outline);
      this.outline = null;
    }

    var ctl = tag;

    while (ctl != null && ctl.tagName != "TD") {
      ctl = ctl.parentNode;
    }

    if (ctl != null) {
      var prev = scForm.browser.getPreviousSibling(ctl);
      var next = scForm.browser.getNextSibling(ctl);

      var left = prev.offsetWidth;
      var right = next.offsetWidth;

      var v = left + this.delta;

      if (v < 32) {
        this.delta = -(left - 32);
      }
      else if (v > left + right - 32) {
        this.delta = right - 32;
      }

      if (target == "left") {
        prev.style.width = left + this.delta + "px";
      }

      if (target == "right") {
        next.style.width = right - this.delta + "px";
      }

      scForm.postEvent(tag, evt, id + ".Release(\"" + prev.offsetWidth.toString() + "px\", \"" + next.offsetWidth.toString() + "px\")");
    }
  }
}

var scVSplit = new scVSplitter();
