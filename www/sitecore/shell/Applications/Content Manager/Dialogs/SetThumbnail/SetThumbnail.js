var size = new Object();
var zoom = 100;
var showRubberBand = false;

Event.observe(window, 'load', 
  function() {
    new Control.Slider('zoom_handle', 'zoom_track', {
      sliderValue: 100,
      values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 175, 200], 
      maximum: 200,
      minimum: 10,
      range: $R(0, 200),
      onSlide: function(v) {  
        $('zoomValue').innerHTML = v + "%";
      },
      onChange: function(v) {  
        zoom = v;
        $('Zoom').value = v;
        $('zoomValue').innerHTML = v + "%";
        $('Preview').style.width = v * size.width / 100 + "px";
        $('Preview').style.height = v * size.height / 100 + "px";
        scForm.postRequest('','','','Crop', null, true);
      }
    });
    
    $('Thumbnail').observe("mousedown", function(evt) { rubberband.MouseDown(evt); }); 
    $('Thumbnail').observe("mousemove", function(evt) { rubberband.MouseMove(evt); }); 
    $('Thumbnail').observe("mouseup", function(evt) { rubberband.MouseUp(evt); }); 
  }
);

function scPreviewLoaded() {
  var image = $('Preview');
  image.style.height = "";
  image.style.width = "";
  size = image.getDimensions();
  var zoomValue = $('Zoom').value;
  if (zoomValue && zoomValue != "100") {
    image.style.width = zoomValue * size.width / 100 + "px";
    image.style.height = zoomValue * size.height / 100 + "px";
  }  
}

function scUpdateThumbnails(preview, thumb128, thumb48, thumb32, thumb24, thumb16) {
  if (preview != null) {
    $('Thumbnail').removeClassName("scTableLayout"); 
    $('Preview').src = preview;
    var isThumbnail = preview !== "/sitecore/images/blank.gif"
    showRubberBand = isThumbnail;
    $('ZoomContainer').setStyle({display: isThumbnail ? "block" : "none"});
  }
  $('thumb128').src = thumb128;
  $('thumb48').src = thumb48;
  $('thumb32').src = thumb32;
  $('thumb24').src = thumb24;
  $('thumb16').src = thumb16;
}

function scRubberBand() {
  this.panel = document.getElementById('Thumbnail');
  this.rubberband = document.getElementById('Rubber');

  this.anchorX = 0;
  this.anchorY = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  
  this.bounds = new Object();
  this.bounds.x = 0;
  this.bounds.y = 0;
  this.bounds.w = 128;
  this.bounds.h = 128;
  
  this.moving = false;
}

scRubberBand.prototype.GetRect = function(dx, dy) {
  if (!this.visible) {
    return null;
  }
  
  this.bounds.x += dx;
  this.bounds.y += dy;
  
  return this.bounds;
}

scRubberBand.prototype.GetNormalizedRect = function(dx, dy) {
  var rect = this.GetRect(dx, dy);
  if (rect == null) {
    return;
  }
  
  var result = new Object();
  
  result.x = rect.x;
  result.y = rect.y;
  result.h = rect.h;
  result.w = rect.w;
  
  var image = scForm.browser.getControl("Preview");
  
  if (result.x + result.w >= image.offsetWidth) {
    result.x = image.offsetWidth - 128;
  }

  if (result.y + result.h >= image.offsetHeight) {
    result.y = image.offsetHeight - 128;
  }
  
  if (result.x < 0) {
    result.x = 0;
  }
  else if (result.x >= image.offsetWidth) {
    result.x = image.offsetWidth - 1;
  }
  
  if (result.y < 0) {
    result.y = 0;
  }
  else if (result.y >= image.offsetHeight) {
    result.y = image.offsetHeight - 1;
  }

  return result;
}

scRubberBand.prototype.Track = function(evt) {
  var dx = evt.pointerX() - this.anchorX;
  var dy = evt.pointerY() - this.anchorY;

  var rect = this.GetNormalizedRect(dx, dy);
  
  if (rect != null) {
    this.rubberband.style.left = rect.x + "px";
    this.rubberband.style.top = rect.y + "px";
    this.rubberband.style.width = rect.w + "px";
    this.rubberband.style.height = rect.h  + "px";
  }
  
  this.anchorX = evt.pointerX();
  this.anchorY = evt.pointerY();
}

scRubberBand.prototype.Show = function() {
  if (showRubberBand) {
    this.rubberband.style.display = "";
    this.visible = true;
  }
}

scRubberBand.prototype.Hide = function() {
  var cropinfo = document.getElementById("Cropping");
  cropinfo.value = "";

  this.rubberband.style.display = "none";
  this.visible = false;
}

scRubberBand.prototype.MouseDown = function(evt) {
  scForm.browser.clearEvent(evt, true);

  if (this.moving) {
    this.MouseUp(evt);
  }
  else {
    var o = this.panel.cumulativeOffset();
    
    var clientX = evt.pointerX() - o.left;
    var clientY = evt.pointerY() - o.top;
    
    if (clientX >= this.panel.clientWidth || clientY >= this.panel.clientHeight) {
      return;
    }

    scForm.browser.setCapture(this.panel);
    
    var x = this.anchorX - this.offsetX;
    var y = this.anchorY - this.offsetY;

    this.offsetX = 64;
    this.offsetY = 64;
    
    if (this.visible) {
      if (evt.pointerX() >= x && evt.pointerX() < x + 128 && evt.pointerY() >= y && evt.pointerY() < y  + 128) {
        this.offsetX = evt.pointerX() - x;
        this.offsetY = evt.pointerY() - y;
      }
    }
    
    this.anchorX = evt.pointerX();
    this.anchorY = evt.pointerY();
    
    this.bounds.x = evt.pointerX() - this.offsetX - o.left + this.panel.scrollLeft;
    this.bounds.y = evt.pointerY() - this.offsetY - o.top + this.panel.scrollTop;

    this.moving = true;
    
    this.Show();
    
    this.Track(evt);
  }
}

scRubberBand.prototype.MouseMove = function(evt) {
  scForm.browser.clearEvent(evt, true);

  if (this.moving) {
    this.Track(evt);
  }
}

scRubberBand.prototype.MouseUp = function(evt) {
  scForm.browser.clearEvent(evt, true);

  if (this.moving) {
    scForm.browser.releaseCapture(this.panel);
    this.moving = false;
    
    var image = scForm.browser.getControl("Preview");
    
    if (this.bounds.x + 128 >= image.offsetWidth) {
      this.bounds.x = image.offsetWidth - 128;
    }

    if (this.bounds.y + 128 >= image.offsetHeight) {
      this.bounds.y = image.offsetHeight - 128;
    }
    
    if (this.bounds.x < 0) {
      this.bounds.x = 0;
    }
    
    if (this.bounds.y < 0) {
      this.bounds.y = 0;
    }
    
    $('Cropping').value = this.bounds.x + "," + this.bounds.y;
    
    scForm.postRequest('','','','Crop', null, true);
  }
}

function scInitializeRubberBand() {
  rubberband = new scRubberBand();
}

scForm.browser.attachEvent(window, "onload", scInitializeRubberBand);

var rubberband = null;

function scSetItem() {
  $('UrlPanel').hide();
  $('ItemPanel').show();
  $('UrlKind').value = "0";
}

function scSetUrl() {
  $('ItemPanel').hide();
  $('UrlPanel').show();
  $('UrlKind').value = "1";
}