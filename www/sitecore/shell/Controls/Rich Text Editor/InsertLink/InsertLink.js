function GetDialogArguments() {
    return getRadWindow().ClientParameters;
}

function getRadWindow() {
  if (window.radWindow) {
        return window.radWindow;
  }
    
    if (window.frameElement && window.frameElement.radWindow) {
        return window.frameElement.radWindow;
    }
    
    return null;
}

var isRadWindow = true;

var radWindow = getRadWindow();

if (radWindow) { 
  if (window.dialogArguments) { 
    radWindow.Window = window;
  } 
}

function scClose(url, text) {
	var returnValue = {
		url:url,
		text:text
	};

	getRadWindow().close(returnValue);

}

function scCancel() {
  getRadWindow().close();
}

// It seems that this function is unused.
function scCloseWebEdit(url) {
  window.top.returnValue = window.returnValue = url;
  window.top.close();
}

if (window.focus && Prototype.Browser.Gecko) {
  window.focus();
}