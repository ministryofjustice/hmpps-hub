function scGetFrameValue(value, request) {
  var frame = scForm.browser.getFrameElement(window);
  if (frame == null || frame.style.display == "none") {
    return;
  }

  if (request.parameters == "contenteditor:save" || request.parameters == "item:save") {
    Sitecore.App.invoke("item:save");
  }

  return null;
}
