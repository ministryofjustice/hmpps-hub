///============================================================================
// Point class
///============================================================================
function scPoint(x, y) {
  this.x = (x != null ? x : 0);
  this.y = (y != null ? y : 0);
}

scPoint.prototype.alert = function() {
  alert(this.toString());
}

scPoint.prototype.clientToScreen = function(tag) {
  var ctl = tag;
  
  while (ctl != null) {
    this.offset(ctl.offsetLeft, ctl.offsetTop);
    ctl = ctl.offsetParent;
  }
}

scPoint.prototype.setPoint = function(x, y) {
  this.x = x;
  this.y = y;
}

scPoint.prototype.offset = function(dx, dy) {
  this.x += dx;
  this.y += dy;
}

scPoint.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
}

///============================================================================
// Rect class
///============================================================================
function scRect(left, top, width, height) {
  this.left = (left != null ? left : 0);
  this.top = (top != null ? top : 0);
  this.width = (width != null ? width : 0);
  this.height = (height != null ? height : 0);
}

scRect.prototype.alert = function() {
  alert(this.toString());
}

scRect.prototype.apply = function(control) {
  control.style.left = "" + this.left + "px";
  control.style.top = "" + this.top + "px";
  control.style.width = "" + this.width + "px";
  control.style.height = "" + this.height + "px";
}

scRect.prototype.assign = function(rect) {
  this.left = rect.left;
  this.top = rect.top;
  this.width = rect.width;
  this.height = rect.height;
}

scRect.prototype.clientToScreen = function(tag) {
  var ctl = tag;
  while (ctl != null) {
    this.offset(ctl.offsetLeft, ctl.offsetTop);

    ctl = ctl.offsetParent;
  }
};

scRect.prototype.clientToRelativeParent = function (tag) {
  var ctl = tag;
  while (ctl != null && (window.getComputedStyle ? getComputedStyle(ctl).position : ctl.currentStyle.position) != "relative") {
    this.offset(ctl.offsetLeft, ctl.offsetTop);

    ctl = ctl.offsetParent;
  }
};

scRect.prototype.getRelativeParentSize = function(tag) {
  var ctl = tag;
  while (ctl != null && (window.getComputedStyle ? getComputedStyle(ctl).position : ctl.currentStyle.position) != "relative") {
    ctl = ctl.offsetParent;
  }

  if (ctl != null) {
    this.width = ctl.offsetWidth;
    this.height = ctl.offsetHeight;
  }
};

scRect.prototype.contains = function(x, y) {
  return (x >= this.left && y >= this.top && x <= this.left + this.width && y <= this.top + this.height);
}

scRect.prototype.ensureRect = function(left, top, width, height) {
  if (this.left == null) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }
}

scRect.prototype.getControlRect = function(control) {
  this.left = control.offsetLeft;
  this.top = control.offsetTop;
  this.width = control.offsetWidth;
  this.height = control.offsetHeight;
}

scRect.prototype.move = function(left, top) {
  this.left = left;
  this.top = top;
}

scRect.prototype.normalize = function() {
  if (this.width < 0) {
    this.width = 0;
  }
  if (this.height < 0) {
    this.height = 0;
  }
}

scRect.prototype.offset = function(left, top) {
  this.left += left;
  this.top += top;
}

scRect.prototype.setRect = function(left, top, width, height) {
  this.left = (left != null ? left : this.left);
  this.top = (top != null ? top : this.top);
  this.width = (width != null ? width : this.width);
  this.height = (height != null ? height : this.height);
}

scRect.prototype.shrink = function(width, height) {
  this.width -= width;
  this.height -= height;
}

scRect.prototype.toString = function() {
  return "(" + this.left + ", " + this.top + ", " + this.width + ", " + this.height + ")";
}
