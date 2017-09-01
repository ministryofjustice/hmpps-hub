if (typeof Sitecore == "undefined") {
  Sitecore = new Object();
}

appendFormData = function (form, value) {
  if (form.indexOf(value) == -1) {
    form += value;
  }

  return form;
};

Sitecore.WebEdit = new function() {
  this.loaded = false;
  this.mouseMoveObservers = new Array();
  this.modified = false;
  this.selectedRendering = "";  
}

Sitecore.WebEdit.registerMessageHandler = function (message, callbackFunction) {
  Sitecore.PageModes.ChromeManager.messages.push({ message: message, callbackFunction: callbackFunction });
};

Sitecore.WebEdit.disableContentSelecting = function() {
  return Sitecore.WebEditSettings.disableContentSelecting;
}
/* -- FIELD VALUES --*/

Sitecore.WebEdit._getFieldValueContainer = function(itemUri, fieldID) {
  Sitecore.PageModes.ChromeManager.getFieldValueContainer(itemUri, fieldID);
}

Sitecore.WebEdit.getFieldValue = function(itemUri, fieldID) {
  Sitecore.PageModes.ChromeManager.getFieldValue(itemUri, fieldID);
}

Sitecore.WebEdit.setFieldValue = function(itemUri, fieldID, value) { 
  Sitecore.PageModes.ChromeManager.setFieldValue(itemUri, fieldID, value);
}

Sitecore.ItemUri = function(id, language, version, revision) {
  this.id = id;
  this.language = language;
  this.version = version;
  this.revision = revision;
}

/* -- END FIELD VALUES --*/

//For backward compatibility
Sitecore.WebEdit.editControl = function (itemid, language, version, fieldid, controlid, message) {
  var params = new Object();
  params.itemId = itemid;
  params.language = language;
  params.version = version;
  params.fieldId = fieldid;
  params.controlId = controlid;
  params.command = message;
  Sitecore.PageModes.ChromeManager.handleMessage("chrome:field:editcontrol", params);
  return false;
}

Sitecore.WebEdit.postRequest = function(request, async) {
  var ctl = document.getElementById("scWebEditRibbon");
  
  if (ctl != null) {
    async = (async == null ? false : async)
  
    ctl.contentWindow.scForm.postRequest("", "", "", request, null, async);
  }
}

Sitecore.WebEdit.quirksMode = function() {
  return typeof(document.compatMode != "undefined") && document.compatMode == "BackCompat";
}

Sitecore.WebEdit.close = function() {
  var href = window.location.href;
  
  href = href.replace("sc_ce=1", "sc_ce=0");
  
  window.location.href = href;
}

Sitecore.WebEdit.changeContentEditorSize = function(element, evt, sign) {
  var iframe = element.parentNode.previousSibling.previousSibling;
  
  var height = iframe.offsetHeight - 48 * sign;
  
  if (height < 200) {
    height = 200;
  }
  
  iframe.style.height = "" + height + "px";
  
  this.setCookie("sitecore_webedit_contenteditorheight", height);
  
  return false;
}

Sitecore.WebEdit.setCookie = function(name, value, expires, path, domain, secure) {
  if (expires == null) {
    expires = new Date();
    expires.setMonth(expires.getMonth() + 3);
  }
  
  if (path == null) {
    path = "/";
  }

  document.cookie = name + "=" + escape(value) +
    (expires ? "; expires=" + expires.toGMTString() : "") +
    (path ? "; path=" + path : "") +
    (domain ? "; domain=" + domain : "") +
    (secure ? "; secure" : "");
}

/* LAYOUT DEFINITION */

Sitecore.WebEdit.showTooltip = function(element, evt) {
  var tooltip = $(element.lastChild);
  var x = Event.pointerX(evt);
  var y = Event.pointerY(evt);
  
  if (evt.type == "mouseover") {
    if (tooltip.style.display == "none") {
      clearTimeout(this.tooltipTimer);
      
      this.tooltipTimer = setTimeout(function() {
        var html = tooltip.innerHTML;
        
        if (html == "") {
          return;
        }
      
        var t = $("scCurrentTooltip");
        if (t == null) {
          t = new Element("div", { "id":"scCurrentTooltip", "class": "scPalettePlaceholderTooltip", "style": "display:none" });
          document.body.appendChild(t);
        }
        
        t.innerHTML = html;
      
        t.style.left = x + "px";
        t.style.top = y + "px";
        t.style.display = "";
      }, 450);
    }
  }
  else {
    clearTimeout(this.tooltipTimer);
    var t = $("scCurrentTooltip");
    if (t != null) {
      t.style.display = "none";
    }
  }
};
