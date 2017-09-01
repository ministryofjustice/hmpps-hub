Sitecore.PageDesigner = new function() {
  Sitecore.registerClass(this, "Sitecore.PageDesigner");

  Sitecore.UI.ModifiedTracking.track(true);
  
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.PageDesigner.load() } );
}

Sitecore.PageDesigner.load = function() {
  var frame = Sitecore.Dhtml.getFrameElement(window);
  
  if (frame != null && frame.style.display != "none") {
    scUpdateRibbonProxy("Ribbon", "Ribbon", window.location.href.indexOf("ar=1") >= 0);
  }
}

function scOnShowEditor() {
  scUpdateRibbonProxy("Ribbon", "Ribbon");
}

function scGetFrameValue(value, request) {
  var frame = scForm.browser.getFrameElement(window);
  if (frame == null || frame.style.display == "none") {
    return;
  }
  
  if (request.parameters == "contenteditor:save") {
    Sitecore.App.invoke("item:save");
  }

  return null;
}
