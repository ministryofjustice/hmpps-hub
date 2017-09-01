function scSetRight(element, evt, itemID, accessRight, allow, propagationType) {
  var state = allow ? 0 : 2;

  if (element.src.indexOf("_enabled") >= 0) {
    element.src = element.src.replace("enabled", "disabled");
  }
  else {
    state += 1;
    element.src = element.src.replace("disabled", "enabled");
  }

  if (allow) {
    var sibling = scForm.browser.getNextSibling(element);
    sibling.src = "/sitecore/shell/Themes/Standard/Images/Security/large_deny_disabled.gif";
  }
  else {
    var sibling = scForm.browser.getPreviousSibling(element);
    sibling.src = "/sitecore/shell/Themes/Standard/Images/Security/large_allow_disabled.gif";
  }
  
  if (propagationType == "A") {  
    switch(state) {
      case 0:
      case 2:
        element.parentNode.className = "scSecurityItem";
        break;
      case 1:
        element.parentNode.className = "scSecurityItem Enabled";
        break;
      case 3:
        element.parentNode.className = "scSecurityItem Deny";
        break;
    }
  }
  
  scForm.postRequest("", "", "", "SetAccessRight(\"" + itemID + "\", \"" + accessRight + "\", \"" + state + "\", \"" + propagationType + "\")", null, true);
}
