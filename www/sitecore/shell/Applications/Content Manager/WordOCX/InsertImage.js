function GetDialogArguments() {
  if (window.radWindow) {
    return window.radWindow.Argument;
  }
  else {
    return null;
  }
}

var isRadWindow = true;

var radWindow = getRadWindow();

function getRadWindow() {
  if (window.radWindow) {
    return window.radWindow;
  }

  if (window.frameElement && window.frameElement.radWindow) {
    return window.frameElement.radWindow;
  }

  return null;
}

if (radWindow) { 
  if (window.dialogArguments) { 
    radWindow.Window = window;
  } 
  
  radWindow.OnLoad(); 
}

function scClose(media) {
	var returnValue = {
		media:media
	};
	
	CloseDlg(returnValue);
}

if (window.focus && Prototype.Browser.Gecko) {
  window.focus();
}

var AspectPreserver = Class.create({
  reload: function() {
    if ($("Width")) {
      $("Width").tainted = true;
    }
    this.retryCount = 0;
    this.hookEvents();
  },
  
  hookEvents: function() {
    if ((!$("Width") || $("Width").tainted) && this.retryCount < 10) {
      this.retryCount++;
      setTimeout(this.hookEvents.bind(this), 50);
      return;
    }
    else if (this.retryCount >= 10) {
      console.warn("retry limit exceeded, bailing out");
      return;
    }
    
    this._originalWidth = $F($("Width"));
    this._originalHeight = $F($("Height"));
    
    $("Width").observe("blur", this.onWidthChange.bind(this));
    $("Height").observe("blur", this.onHeightChange.bind(this));
  },
  
  onWidthChange: function() {
    var width = parseInt($F($("Width")));
    $("Height").value = Math.round(width / this._originalWidth * this._originalHeight);
  },
  
  onHeightChange: function() {
    var height = parseInt($F($("Height")));
    $("Width").value = Math.round(height / this._originalHeight * this._originalWidth);
  }
})

var scAspectPreserver = new AspectPreserver();