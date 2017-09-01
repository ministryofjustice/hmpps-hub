function addAccount(header, key) {
  var accounts = scForm.browser.getControl("Accounts");

  var option = document.createElement("OPTION");
  accounts.options.add(option);

  option.value = key;
  if (typeof (option.innerText) != 'undefined') {
    option.innerText = header;
  }
  else {
    option.textContent = header;
  }
  option.selected = true;
  
  updateButtonState();
}

function removeAccount(key) {
  var accounts = scForm.browser.getControl("Accounts");
  
  for(var n = accounts.options.length - 1; n >= 0; n--) {
    if (accounts.options[n].value == key) {
      accounts.options.remove(n);
    }
  }
  
  updateButtonState();
}

function selectAccount(key) {
  var accounts = scForm.browser.getControl("Accounts");
  
  for(var n = accounts.options.length - 1; n >= 0; n--) {
    if (accounts.options[n].value == key) {
      accounts.selectedIndex = n;
    }
  }
  
  updateButtonState();
}

function updateButtonState() {
  var accounts = $("Accounts");
  var elements = [$("Permissions"), $("Accounts"), $("Inheritance")];
  
  $("Remove").disabled = !$A(accounts.childNodes).find(function(option) { return option.selected; });
  
  if (accounts.childNodes.length == 0) {
    elements.each(function(element) { element.addClassName("disabled") });
    $("Inheritance").innerHTML = "";
  }
  else {
    elements.each(function(element) { element.removeClassName("disabled") });
    $("NoAccounts").hide();    
    $("NoPermissions").hide();
  }
}

function scSetRight(element, evt, accessRight, allow, propagationType) {
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
        element.parentNode.className = "scSecurityItemEnabled";
        break;
      case 3:
        element.parentNode.className = "scSecurityItemDeny";
        break;
    }
  }
  
  scForm.postRequest("", "", "", "SetAccessRight(\"" + accessRight + "\", \"" + state + "\", \"" + propagationType + "\")", null, true);
  
  return scForm.browser.clearEvent(evt, true, false);
}

Event.observe(document, "dom:loaded", function() {
  $("Accounts").observe("click", updateButtonState);
  
  updateButtonState();
});