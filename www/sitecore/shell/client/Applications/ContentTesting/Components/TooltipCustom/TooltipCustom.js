//
// Tooltip
//
var TooltipCustom = function (isAnimate) {
  this.isAnimate = true;
  if (typeof isAnimate !== 'undefined')
    this.isAnimate = isAnimate;

  this.className = "tooltipCustom";

  TooltipCustom.prototype.index++;
  this.id = this.getId();

  //
  this.initialize();
};

TooltipCustom.prototype.index = 0;
TooltipCustom.prototype.getId = function () {
  return this.className + TooltipCustom.prototype.index;
};


TooltipCustom.prototype.cssStyleAdd = function () {
  var isAdded = false;
  var styleElems = $("style");
  for (var i = 0; i < styleElems.length; i++) {
    var style = styleElems[i];
    var html = $(style).html();
    if (html.indexOf("." + this.className) >= 0) {
      isAdded = true;
      break;
    }
  }

  if (!isAdded) {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "\
        .tooltipCustom { \
          display: none; \
          z-index: 1000000; \
          position: absolute; \
          top: 100px; \
          left: 100px; \
          max-width: 400px; \
          border: 1px solid #CDCDCD; \
          padding: 4px 12px; \
          border-radius: 5px; \
          background: #F7F7F7; \
          -webkit-user-select: none; \
          -moz-user-select: none;  \
          -khtml-user-select: none; \
          -o-user-select: none; \
        }";

    $('body').append(css);
  }
};

TooltipCustom.prototype.isWindowClick = false;

TooltipCustom.prototype.initialize = function () {
  var self = this;

  // CSS style
  this.cssStyleAdd();

  var html = "<span id='" + this.id + "' class='" + this.className + "' style='display: none;'></span>";
  $('body').append(html);

  setInterval(function () {
    // in case when "targetClick" is set - it's needed to hide tooltip after "window.click"(in any place)
    if (self.targetClick && self.isWindowClick) {
      if (self.isTargetClicked) {
        self.isTargetClicked = false;
      } else {
        self.hide();
      }
      self.isWindowClick = false;
    }
  }, 50);

  $(window).click(function (event) {
    self.isWindowClick = true;    
  });
};

TooltipCustom.prototype.setTarget = function (target, text) {
  var self = this;
  self.isAnimate = false;
  $target = $(target);
  if ($target.length > 0) {
    $target.hover(function (event) {
      self.show(event.pageX + 5, event.pageY + 10, text);
    });
    $target.mouseleave(function (event) {
      self.hide();
    });
  }
};

TooltipCustom.prototype.isTargetClicked = false;
TooltipCustom.prototype.targetClick;
TooltipCustom.prototype.setTargetClick = function (target, text) {
  var self = this;
  self.isAnimate = false;
  $target = $(target);  
  if ($target.length > 0) {
    self.targetClick = $target[0];
    $target.click(function (event) {
      var $idElem = $("#" + self.id);
      if ($idElem.css("display") == "none") {
        self.show(event.pageX + 5, event.pageY + 15, text);
      } else {
        self.hide();
      }
      self.isTargetClicked = true;
    });
  }
};

TooltipCustom.prototype.timer = null;

TooltipCustom.prototype.show = function(x, y, text) {
  this.showElem(x, y, text);
  this.showCorrect(x, y, text);
};

TooltipCustom.prototype.showElem = function (x, y, text) {
  var self = this;

  var $idElem = $("#" + this.id);

  $idElem.css("left", x);
  $idElem.css("top", y);
  if ($idElem.length > 0)
    $idElem[0].innerHTML = text;

  if (this.isAnimate) {
    $idElem.hide();
    $idElem.css("opacity", "0");
    $idElem.show();
    $idElem.animate({
      opacity: 1
    }, 700);

    if (TooltipCustom.prototype.timer) {
      clearTimeout(TooltipCustom.prototype.timer);
    }
    TooltipCustom.prototype.timer = setTimeout(function () {
      self.hide();
    }, 2000);
  } else {
    $idElem.show();
  }
};

TooltipCustom.prototype.showCorrect = function (curX, curY, text) {
  var $elem = $("#" + this.id);
  var height = $elem[0].clientHeight;
  var width = $elem[0].clientWidth;
  var maxWidth = parseInt($elem.css("max-width"), 10);

  var windowWidth = $(window).width();
  // if tooltip near with window's edge - move it to left on "maxWidth" distance
  if ((windowWidth - curX) < maxWidth
      && width < height) {
    var _curXcorrect;
    if (height > width) {
      if (width < maxWidth) {
        maxWidth = width + (height - width);
      }
      _curXcorrect = windowWidth - (maxWidth + 5);
    }
    else
      _curXcorrect = windowWidth - (width + 5);
    this.showElem(_curXcorrect, curY + 10, text);
  }
};

TooltipCustom.prototype.hide = function () {
  var $idElem = $("#" + this.id);
  $idElem.css("display", "none");
};
