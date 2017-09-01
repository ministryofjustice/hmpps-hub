function scOnLoad() {
  window.frameElement.style.height = document.body.scrollHeight;
  window.frameElement.style.width = document.body.scrollWidth;
  
  // disable links
  var list = document.getElementsByTagName("A");
  for(var n = 0; n < list.length; n++) {
    list[n].onclick = scDoCancel;
  }
  
  document.attachEvent("ondblclick", scDblClick);
}

function scDblClick() {
  var url = window.location.href;
  
  if (url.indexOf("?") >= 0) {
    url = url.substr(url.indexOf("?") + 1);
  }
  
  url = encodeURIComponent(url);
  
  var result = scForm.showModalDialog("/sitecore/shell/default.aspx?xmlcontrol=RenderingProperties&pa=" + url, new Array(window), "help:no;scroll:auto;resizable:yes;status:no;center:yes");
  
  if (result != null && result != "__cancel") {
  
    url = window.location.href;
    
    if (url.indexOf("?") >= 0) {
      url = url.substr(0, url.indexOf("?") + 1);
    }
    
    url += result;
    
    frameElement.src = url;
  }
}

function scDoCancel() {
  var evt = window.event;

  if (evt != null) {
    evt.returnValue = false;
    evt.cancelBubble = true;
  }
  
  return false;
}

window.attachEvent("onload", scOnLoad);