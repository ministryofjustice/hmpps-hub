function scTGallery() {
  this.minWidth = 64;
  this.alignRightOffset = 0;
}

scTGallery.prototype.autoAdjustSize = function () {
  return true;
}

scTGallery.prototype.onKeyUp = function (evt) {
  evt = (evt != null ? evt : event);

  if (evt.keyCode == 27) {
    var frame = scForm.browser.getFrameElement(window);
    frame.style.display = "none";
  }
}

scTGallery.prototype.onLoad = function () {
  var frame = scForm.browser.getFrameElement(window);
  // frame.style.display = "";

  scForm.focus(frame);

  var width = "";
  var height = "";

  if (!scForm.browser.isIE) {
    width = frame.offsetWidth;
  }

  if (frame.width != "") {
    width = frame.width;
  }

  if (frame.height != "") {
    height = frame.height;
  }

  if (width == "" || height == "") {
    var ctl = $(document.body.firstChild);
    var w = ctl.style.width;
    var h = ctl.style.height;

    if (scForm.browser.isIE) {
      ctl.style.width = "1px";
      ctl.style.height = "1px";
    }
    else {
      ctl.setStyle({ width: "auto", height: "auto" });
    }
    ctl.style.position = "absolute";

    width = ctl.scrollWidth;
    height = ctl.scrollHeight;

    ctl.style.position = "";
    ctl.style.width = w;
    ctl.style.height = h;
  }

  if (width == "" || width < this.minWidth) {
    width = this.minWidth;
  }

  if (height == "" || height < 24) {
    height = 24;
  }

  if (this.autoAdjustSize()) {
    frame.style.height = height + "px";
    var ieWordWrapFixWidth = 1;
    frame.style.width = (Number(width) + ieWordWrapFixWidth) + "px";
  }

  var viewport = frame.ownerDocument.body;
  if (viewport.clientHeight == 0) {
    var form = $(frame.ownerDocument.body).down("form");
    if (form && form.clientHeight > 0) {
      viewport = form;
    }
  }

  if (frame.offsetLeft + frame.offsetWidth > viewport.offsetWidth) {
    frame.style.left = (viewport.offsetWidth - frame.offsetWidth - 1) + "px";
  }

  if (frame.offsetTop + frame.offsetHeight > viewport.offsetHeight) {
    frame.style.top = (viewport.offsetHeight - frame.offsetHeight - 1) + "px";
  }

  if (frame.offsetLeft < 0) {
    frame.style.left = "0px";
  }

  if (frame.offsetTop + 16 > viewport.offsetHeight || frame.offsetTop < 0) {
    frame.style.top = "0px";
  }

  if (this.autoAdjustSize()) {
    if (frame.offsetLeft + frame.offsetWidth > viewport.offsetWidth) {
      frame.style.width = (viewport.offsetWidth - frame.offsetLeft - 1) + "px";
    }

    if (frame.offsetTop + frame.offsetHeight > viewport.offsetHeight) {
      frame.style.height = (viewport.offsetHeight - frame.offsetTop - 1) + "px";
    }
  }
  frame.style.zIndex = "10000";
}

scTGallery.prototype.mouseDown = function (tag, evt) {
  if (!this.dragging) {
    this.trackCursor = new scPoint();
    this.trackCursor.setPoint(evt.screenX, evt.screenY);

    this.dragging = true;
    this.delta = 0;

    scForm.browser.setCapture(tag);

    scForm.browser.clearEvent(evt, true, false);
  }
}

scTGallery.prototype.mouseMove = function (tag, evt) {
  if (this.dragging) {
    var dx = evt.screenX - this.trackCursor.x;
    var dy = evt.screenY - this.trackCursor.y;

    var frame = scForm.browser.getFrameElement(window);

    if (frame.offsetWidth + dx > this.minWidth) {
      frame.style.width = (frame.offsetWidth + dx) + "px";
      this.trackCursor.x = evt.screenX;
    }
    else {
      frame.style.width = "" + this.minWidth + "px";
    }

    if (frame.offsetHeight + dy > 24) {
      frame.style.height = (frame.offsetHeight + dy) + "px";
      this.trackCursor.y = evt.screenY;
    }
    else {
      frame.style.height = "24px";
    }

    scForm.browser.clearEvent(evt, true, false);
  }
}

scTGallery.prototype.mouseUp = function (tag, evt) {
  if (this.dragging) {
    this.dragging = false;

    scForm.browser.clearEvent(evt, true, false);

    scForm.browser.releaseCapture(tag);

    var frame = scForm.browser.getFrameElement(window);

    var scGalleries = window.parent.document.getElementById("scGalleries");

    var value = scGalleries.value;

    var p = value.toQueryParams();
    p[frame.id] = frame.style.width + "q" + frame.style.height;
    scGalleries.value = Object.toQueryString(p);
  }
}

scTGallery.prototype.onHide = function () {
}

var scGallery = new scTGallery();

scForm.browser.attachEvent(window, "onload", function () { scGallery.onLoad() });
scForm.browser.attachEvent(document, "onkeyup", function () { scGallery.onKeyUp() });
