function scCheckModified(text) {
  var modified = false;
  var result = "yes";
  
  for(var e = scForm.browser.getEnumerator(document.getElementsByTagName("IFRAME")); !e.atEnd(); e.moveNext()) {
    var iframe = e.item();
    
    if (iframe.contentWindow.scForm != null) {
      if (iframe.contentWindow.scForm.modified) {
        modified = true;
        break;
      }
    }
  }
  
  if (modified) {
    if (!confirm(text)) {
      result = "no";
    }
  }
  
  return result;
}
