function scUpdatePosition(evt, eventType) {
    var ctl = scForm.browser.getControl("Position");
    var result = "";

    if (eventType == "move") {
        var offset = scForm.browser.getOffset(evt);
        result = "(" + offset.x + ", " + offset.y + ")";
    }

    if (rubberband != null && rubberband.visible) {
        var rect = rubberband.GetNormalizedRect();
        result += (result != "" ? "   " : "") + "[(" + rect.x + ", " + rect.y + ") -> (" + (rect.x + rect.w) + ", " + (rect.y + rect.h) + "), " + rect.w + "x" + rect.h + "]";

        // Adjust the x,y position of 'cropped image' according to the scroll value also which was not consider before.
        // Math.floor() is necessary since IE returns a floating point number for the x,y position
        var normalizedY = Math.ceil(rect.y + getScrollPositionY() - scRubberBand.prototype.getRibbonHeightOffset());
        var normalizedX = Math.ceil(rect.x + getScrollPositionX());

        var image = scForm.browser.getControl("Image");
        var effectiveImageHeightOffset = image.offsetHeight;
        var effectiveImageWidthOffset = image.offsetWidth;
        var normalizedH = (normalizedY + Math.ceil(rect.h)) > effectiveImageHeightOffset ? Math.ceil(effectiveImageHeightOffset - normalizedY) : Math.ceil(rect.h);
        var normalizedW = (normalizedX + Math.ceil(rect.w)) > effectiveImageWidthOffset ? Math.ceil(effectiveImageWidthOffset - normalizedX) : Math.ceil(rect.w);

        var cropinfo = document.getElementById("CropInfo");
        cropinfo.value = normalizedX + "," + normalizedY + "," + normalizedW + "," + normalizedH;
    }

    ctl.innerHTML = (result != "" ? result : "&nbsp;");
}

/*
    For big image (Where user need to scroll to see the rest of the image), It was not possible to crop a part of that image from the bottom.
    To fix that issue, we also need to consider the scroll change value with the x,y position of image.
    The below function will be using to get the scroll position so that x,y position of image can be normalized.
    getScrollPositionY() --> Will return vertical scroll position. If not scroll, it will return 0.
    getScrollPositionX() --> Will return horizontal scroll position. If not scroll, it will return 0. 
*/

function getScrollPositionY() {
    var canvas = document.getElementById("Canvas");
    var scrollPosition = canvas.scrollTop;
    return scrollPosition;
}

function getScrollPositionX() {
    var canvas = document.getElementById("Canvas");
    var scrollPosition = canvas.scrollLeft;
    return scrollPosition;
}

/*
    Image height = Image height + Ribbon height.
    Canvas height = Canvas height + Ribbon height.
    Effective height to be considered = which ever is less between canvas height and image height.
*/

scRubberBand.prototype.getEffectiveHeightOffset = function (image) {
    var canvas = document.getElementById("Canvas");
    var canvasHeight = canvas.clientHeight + this.getRibbonHeightOffset();
    var imageHeight = image.offsetHeight + this.getRibbonHeightOffset();
    return canvasHeight <= imageHeight ? canvasHeight : imageHeight;
};

scRubberBand.prototype.getEffectiveWidthOffset = function (image) {
    var canvas = document.getElementById("Canvas");
    var canvasWidth = canvas.clientWidth;
    var imageWidth = image.offsetWidth;
    return canvasWidth <= imageWidth ? canvasWidth : imageWidth;
};

scRubberBand.prototype.getRibbonHeightOffset = function () {
    var ribbon = document.getElementById("ImagerRibbon_Strip_ImageStrip");
    var parentTr = this.findUpTag(ribbon, "tr");
    if (parentTr == undefined) {
        return ribbon.offsetHeight;
    }
    return parentTr.offsetHeight;
};

scRubberBand.prototype.findUpTag = function (el, tag) {
    while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName.toLowerCase() === tag)
            return el;
    }
    return null;
};

///------------------------------------------------------------------------

function scRubberBand() {
    this.image = document.getElementById('Image');
    this.rubberband = document.getElementById('Rubber');

    this.x0 = 0;
    this.y0 = 0;
    this.x1 = 0;
    this.y1 = 0;

    this.moving = false;
    this.visible = false;
}

scRubberBand.prototype.GetRect = function () {
    if (!this.visible) {
        return null;
    }

    var rect = new Object();
    rect.x = (this.x0 < this.x1 ? this.x0 : this.x1);
    rect.y = (this.y0 < this.y1 ? this.y0 : this.y1);
    rect.w = Math.abs(this.x1 - this.x0);
    rect.h = Math.abs(this.y1 - this.y0);

    return rect;
}

scRubberBand.prototype.GetNormalizedRect = function () {
    var rect = this.GetRect();

    if (rect == null) {
        return;
    }

    var result = new Object();

    result.x = rect.x;
    result.y = rect.y;
    result.h = rect.h;
    result.w = rect.w;

    var image = scForm.browser.getControl("Image");
    var ribbonHeightOffset = this.getRibbonHeightOffset();
    var effectiveHeightOffset = this.getEffectiveHeightOffset(image);
    var effectiveWidthOffset = this.getEffectiveWidthOffset(image);

    if (result.x < 0) {
        result.w += result.x;
        result.x = 0;
    }
    else if (result.x >= image.offsetWidth) {
        result.x = image.offsetWidth - 1;
    }

    if (result.y < ribbonHeightOffset) {
        result.h += -(ribbonHeightOffset - result.y);
        result.y = ribbonHeightOffset;
    }
    else if (result.y >= effectiveHeightOffset) {
        result.y = effectiveHeightOffset - 1;
    }

    if (result.x + result.w >= effectiveWidthOffset) {
        result.w = effectiveWidthOffset - result.x;
    }

    if (result.y + result.h >= effectiveHeightOffset) {
        result.h = effectiveHeightOffset - result.y;
    }

    return result;
}

scRubberBand.prototype.Track = function (x1, y1) {
    this.x1 = x1;
    this.y1 = y1;

    var rect = this.GetNormalizedRect();

    if (rect != null) {
        this.rubberband.style.left = rect.x + "px";
        this.rubberband.style.top = rect.y + "px";
        this.rubberband.style.width = rect.w + "px";
        this.rubberband.style.height = rect.h + "px";
    }
}

scRubberBand.prototype.Show = function () {
    this.rubberband.style.display = "block";
    this.visible = true;
}

scRubberBand.prototype.Hide = function () {
    var cropinfo = document.getElementById("CropInfo");
    cropinfo.value = "";

    this.rubberband.style.display = "none";
    this.visible = false;
}

scRubberBand.prototype.MouseDown = function (evt) {
    scForm.browser.clearEvent(evt, true);

    if (this.moving) {
        this.MouseUp();
    }
    else {
        scForm.browser.setCapture(this.image);
        var offset = scForm.browser.getOffset(evt);

        if (!evt.altKey) {
            this.x0 = offset.x;
            this.y0 = offset.y;
        }
        this.Show();
        this.Track(offset.x, offset.y);
        this.moving = true;
    }

    return false;
}

scRubberBand.prototype.MouseMove = function (evt) {
    scForm.browser.clearEvent(evt, true);

    if (this.moving) {
        var image = scForm.browser.getControl("Image");

        var ctl = scForm.browser.getSrcElement(evt);
        var offset = scForm.browser.getOffset(evt);

        if (ctl == this.rubberband) {
            this.Track(offset.x + this.rubberband.style.offsetLeft, offset.y + this.rubberband.style.offsetTop);
        }
        else {
            this.Track(offset.x, offset.y);
        }
    }

    return false;
}

scRubberBand.prototype.MouseUp = function (evt) {
    scForm.browser.clearEvent(evt, true);

    if (this.moving) {
        scForm.browser.releaseCapture(this.image);
        this.moving = false;

        var rect = this.GetRect();
        if (rect.w == 0 || rect.h == 0) {
            this.Hide();
        }
    }

    return false;
}

function scInitializeRubberBand() {
    rubberband = new scRubberBand();
}

scForm.browser.attachEvent(window, "onload", scInitializeRubberBand);

var rubberband = null;
