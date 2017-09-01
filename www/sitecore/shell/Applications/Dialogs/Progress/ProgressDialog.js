

function checkStatus() {
  SitecoreProgressAnimation.play();
  scForm.postRequest("", "", "", "CheckStatus");
}

function progressTo(factor) {
  SitecoreProgressAnimation.stop();
  var filler = $("filler");
  var total = $("Progress").offsetWidth;
  
  var parsedFactor = parseFloat(factor);
  var width = parsedFactor * total;
  
  filler.setStyle({ width: width + "px" });
}

function showException() {
    scForm.showModalDialog("/sitecore/shell/controls/error.htm", new Array($('ErrorMessage').value), "center:yes;help:no;resizable:yes;scroll:yes;status:no;dialogWidth:506;dialogHeight:170;header:" + scForm.translate("Error"));
}

function toggle() {
  if ($('LogContainer').style.display == '') {
    collapse();
  }
  else {
    expand();
  }
}

function expand() {
  initialDialogHeight = window.document.viewport.getHeight();
  scForm.setDialogDimension(null, initialDialogHeight + 220);
  $("LogContainer").show();
  $("MoreImage").toggle();
  $("LessImage").toggle();
}

function collapse() {
  scForm.setDialogDimension(null, initialDialogHeight);
  $("LogContainer").hide();
  $("MoreImage").toggle();
  $("LessImage").toggle();
}

function appendLog(html) {
  $("Log").innerHTML += html;
}

var SitecoreProgressAnimation = new (Class.create({
  initialize: function () {
  },
  
  play: function () {
    if (this.playing) {
      return;
    }

    this.playing = true;
    this.loop();
  },
  
  stop: function() {
    this.playing = false;
    $("filler").setStyle({ left: 0 });
  },

  loop: function () {
    if (!this.playing) {
      return;
    }

    var filler = $("filler");
    var totalWidth = $("Progress").offsetWidth;
    var fillerWidth = totalWidth / 5;
    var step = fillerWidth / 20;

    if (filler.offsetWidth != fillerWidth) {
      filler.setStyle({ width: fillerWidth + "px" });
    }

    var left = filler.positionedOffset()[0];
    left += step;
    
    if (left >= totalWidth - fillerWidth + step) {
      left = 1;
    }
    
    filler.setStyle({ left: left + "px" });
    setTimeout("SitecoreProgressAnimation.loop()", 40);
  }
}));

Event.observe(window, "load", checkStatus);
