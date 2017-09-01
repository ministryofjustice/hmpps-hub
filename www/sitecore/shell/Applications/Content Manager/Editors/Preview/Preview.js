Sitecore.Preview = new function() {
  Sitecore.registerClass(this, "Sitecore.Preview");

  Sitecore.UI.ModifiedTracking.track(true);
  
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.Preview.load() } );
}

Sitecore.Preview.load = function() {
  var frame = Sitecore.Dhtml.getFrameElement(window);
}

function scGetFrameValue(value, request) {
  var frame = scForm.browser.getFrameElement(window);
  
  if (request.parameters == "contenteditor:save") {
    window.location.reload(false);
  }
  
  return null;
}


function scOnShowEditor() {
  scRefresh();
}

function scRefresh() {
  var ctl = scForm.browser.getControl("Editor");
  ctl.src = ctl.src;
}
