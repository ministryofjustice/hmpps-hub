Sitecore.GridDesigner = new function() {
  Sitecore.registerClass(this, "Sitecore.GridDesigner");

  Sitecore.UI.ModifiedTracking.track(true, Sitecore.App.getParentForm());
  
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.GridDesigner.load() } );
}

Sitecore.GridDesigner.load = function() {
  Sitecore.Dhtml.attachEvent($("Editor"), "onclick", function() { Sitecore.GridDesigner.click() } );
  Sitecore.Dhtml.attachEvent(document, "onkeydown", function() { Sitecore.GridDesigner.keyDown() } );
  Sitecore.Dhtml.attachEvent(document, "ondblclick", function() { Sitecore.GridDesigner.dblClick() } );

  var frame = Sitecore.Dhtml.getFrameElement(window);
  
  if (window.location.href.indexOf("mo=IDE") > 0) {
    $("Ribbon").parentNode.style.display = "";
  }
  else if (frame.style.display != "none") {
    scUpdateRibbonProxy("Ribbon", "Ribbon", window.location.href.indexOf("ar=1") >= 0);
  }
}

Sitecore.GridDesigner.keyDown = function() {
  if (window.event.keyCode == 46) {
    Sitecore.App.invoke("griddesigner:delete");
  }
}

Sitecore.GridDesigner.dblClick = function() {
  Sitecore.Dhtml.clearEvent(window.event);
  Sitecore.App.invoke("griddesigner:properties");
}

Sitecore.GridDesigner.click = function() {
  var evt = window.event;
  
  var element = Sitecore.Dhtml.getSrcElement(evt);
  
  while (element != null) {
    var className = element.className;
    
    if (className != null && className.indexOf("scGridDesignerArea") >= 0) {
      break;
    }
    
    element = element.parentNode;
  }
  
  this.select(evt, element);
}

Sitecore.GridDesigner.select = function(evt, element) {
  var selected = $("Selected").value;
  
  if (!evt.ctrlKey) {
    this.clearSelected();
  }
  
  if (element != null) {
    if (this.isSelected(element)) {
      this.removeSelected(element);
    }
    else {
      this.addSelected(element);
    }
  }
  
  if ($("Selected").value != selected) {
    Sitecore.App.postRequest("", "Editor", "", "UpdateRibbon()", null, true);
  }
}

Sitecore.GridDesigner.update = function() {
}

Sitecore.GridDesigner.addSelected = function(element) {
  if (this.isSelected(element)) {
    return;
  }

  var selected = $("Selected");
  
  if (selected != "") {
    selected.value += "|";
  }
  
  selected.value += element.id;
 
  Sitecore.UI.DomElement.addCssClass(element, "scGridDesignerSelected");
}

Sitecore.GridDesigner.removeSelected = function(element) {
  var id = element.id;
  
  if (id == null || id == "") {
    return;
  }

  var selected = $("Selected");

  var value = "";
  
  var parts = selected.value.split('|');
  
  for(var n = 0; n < parts.length; n++) {
    if (parts[n] == id) {
      Sitecore.UI.DomElement.removeCssClass(element, "scGridDesignerSelected");
      continue;
    }
  
    if (value.length > 0) {
      value += "|";
    }
    
    value += parts[n];
  }

  selected.value = value;
}

Sitecore.GridDesigner.clearSelected = function() {
  var selected = $("Selected");

  var parts = selected.value.split('|');
  
  for(var n = 0; n < parts.length; n++) {
    var element = $(parts[n]);
  
    if (element == null) {
      continue;
    }
  
    Sitecore.UI.DomElement.removeCssClass(element, "scGridDesignerSelected");
  }

  selected.value = "";
}

Sitecore.GridDesigner.isSelected = function(element) {
  var selected = $("Selected");
  
  var id = element.id;
  
  if (id == null || id == "") {
    return false;
  }

  var parts = selected.value.split("|");
  
  for(var n = 0; n < parts.length; n++) {
    if (parts[n] == id) {
      return true;
    }
  }
  
  return false;
}

Sitecore.GridDesigner.setGrid = function(grid) {
  var div = document.createElement("div");
  
  div.innerHTML = grid;
  
  var editor = $("Editor");
  
  editor.innerHTML = "";
  
  while(div.childNodes.length > 0) {  
    editor.appendChild(div.firstChild);
  }
  
  this.setParentModified(true);
}

Sitecore.GridDesigner.setParentModified = function(modified) {
  var form = Sitecore.App.getParentForm();
  
  form.setModified(modified);
}

function scOnShowEditor() {
  scUpdateRibbonProxy("Ribbon", "Ribbon");
}

function scRenderingClicked(evt, iframe) {
  Sitecore.GridDesigner.select(evt, iframe);
}

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

function scDblClick(tag, evt) {
  Sitecore.Dhtml.clearEvent(evt);
  
  var width = screen.width / 2;
  var height = screen.height / 2;
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  var options = "help:no;scroll:auto;resizable:yes;status:no;center:yes"
    + ";dialogWidth:" + width + "px;dialogHeight:" + height
    + "px;dialogTop:" + top + "px;dialogLeft:" + left + "px";

  var page = "/sitecore/shell/default.aspx?xmlcontrol=IDE.RenderingProperties";
  var url = tag.parentNode.firstChild.innerHTML;
  
  if (url.indexOf("?") >= 0) {
    url = url.substr(url.indexOf("?") + 1);
  }
  
  url = url.replace(/&amp;/gi, "&")
  url = encodeURIComponent(url);
  url = page + "&pa=" + url;
  
  var result = scForm.showModalDialog(url, new Array(window), options);
  
  if (result != null && result != "__cancel") {
    Sitecore.App.invoke("SetRenderingProperties(\"" + tag.parentNode.id + "\",\"" + result + "\")");
  }
}