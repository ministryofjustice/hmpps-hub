if (typeof(Sitecore) == "undefined") {
  Sitecore = new Object();
}

Sitecore.Treeview = new function () {
};

Sitecore.Treeview.collapseTreeNode = function (node) {
  while (node.childNodes.length > 2) {
    node.removeChild(node.childNodes[2]);
  }

  this.setGlyph(node.down(), "/treemenu_collapsed.png");
};

Sitecore.Treeview.expandTreeNode = function (node, html) {
  this.collapseTreeNode(node);

  if (html != "") {
    node.insert("<div>" + html + "</div>");

    this.setGlyph(node.down(), "/treemenu_expanded.png");
  } else {
    this.setGlyph(node.down(), "/notreemenu_collapsed.png.gif");
  }
};

Sitecore.Treeview.onTreeClick = function (element, evt, click) {
  var source = Event.element(evt);
  var node = source.up("div.scContentTreeNode");
  if (node == null || node.id == null || node.id == "") {
    return;
  }

  var id = node.id.substr(node.id.lastIndexOf("_") + 1)

  if (source.className == "scContentTreeNodeGlyph") {
    return this.onTreeGlyphClick(node, $(element), id);
  }

  return this.onTreeNodeClick(node, $(element), evt, id, click);
};

Sitecore.Treeview.onTreeGlyphClick = function (node, treeElement, id) {
  var glyph = node.down();

  if (glyph.src.indexOf("treemenu_collapsed.png") >= 0 && glyph.src.indexOf("notreemenu_collapsed.png.gif") == -1) {
    this.setGlyph(glyph, "/sc-spinner16.gif");

    var content = $F(treeElement.id + "_Database");

    body = treeElement.id + "_Selected=" + escape($F(treeElement.id + "_Selected")) + "&" + treeElement.id + "_Parameters=" + escape($F(treeElement.id + "_Parameters"));
    var templateIDs = $(treeElement.id + "_templateIDs");
    if (templateIDs) {
      body += "&" + treeElement.id + "_templateIDs=" + escape(templateIDs.value);
    }
    var displayFieldName = $(treeElement.id + "_displayFieldName");
    if (displayFieldName) {
      body += "&" + treeElement.id + "_displayFieldName=" + escape(displayFieldName.value);
    }
 
    if (window.scCSRFToken && window.scCSRFToken.key && window.scCSRFToken.value) {
        body += "&" + window.scCSRFToken.key + "=" + window.scCSRFToken.value;
    }

    var contentLanguage;
    var treeviewLanguage = window.document.getElementById(treeElement.id + "_Language");

    if (treeviewLanguage) {
      contentLanguage = "&la=" + treeviewLanguage.value;
    } else {
      contentLanguage = "";
    }

    new Ajax.Request("/sitecore/shell/Controls/TreeviewEx/TreeviewEx.aspx?treeid=" + encodeURIComponent(treeElement.id) + "&id=" + encodeURIComponent(id) + (content != null ? "&sc_content=" + content : "") + contentLanguage, {
      method: "post",
      postBody: body,
        onSuccess: function (transport) { Sitecore.Treeview.expandTreeNode(node, transport.responseText) },
        onException: function (request, ex) { alert(ex); },
        onFailure: function (request) { alert("Failed"); }
    });
  } 
  else if (glyph.src.indexOf("treemenu_expanded.png") > 0) {
    this.collapseTreeNode(node);
  }

  return false;
};

Sitecore.Treeview.refresh = function (node, treeElement, id) {
  scForm.browser.closePopups();
  node = $(node);
  this.collapseTreeNode(node);
  this.onTreeGlyphClick(node, $(treeElement), id);
};

Sitecore.Treeview.onTreeNodeClick = function (node, treeElement, evt, id, click) {
  var selectedElement = $(treeElement.id + "_Selected")
  var selected = selectedElement.value;

  if (!evt.shiftKey) {
    selected = "";
    var active = treeElement.getElementsBySelector(".scContentTreeNodeActive");

    if (active != null && active.length > 0) {
      active.each(function (e) {
        e.className = "scContentTreeNodeNormal";
      });
    }
  }

  node.down().next().className = "scContentTreeNodeActive";
  selectedElement.value = selected + (selected != "" ? "," : "") + id;

  if (click != null) {
    scForm.postEvent(treeElement, evt, click);
  }

  $(node.id).down('span').focus();

  return false;
};

Sitecore.Treeview.setGlyph = function (glyph, src) {
  glyph.src = glyph.src.replace("/treemenu_collapsed.png", src).replace("/notreemenu_collapsed.png.gif", src).replace("/treemenu_expanded.png", src).replace("/sc-spinner16.gif", src);
};

Sitecore.Treeview.onTreeDrag = function (element, evt) {
  if (evt.button == 1 || evt.type == "dragstart") {
    var source = Event.element(evt).up("div");

    if (source != null) {
      scForm.drag(element, evt, "item:" + source.id);
    }
  }
};

Sitecore.Treeview.onTreeDrop = function(element, evt) {
  var e = $(document.elementFromPoint(evt.clientX, evt.clientY)).up("DIV");
  
  if (e != null && e.id != null && e.id != "") {
    var parameters = null;
    
    if (evt.type == "drop") {
      parameters = element.id + '.Drop("$Data,'+ e.id + '")';
    }
  
    scForm.drop(element, evt, parameters);
  }
}

Sitecore.Treeview.onKeyDown = function(element, evt) {
  if (evt.altKey || evt.shiftKey || evt.ctrlKey) {
    return;
  }

  var source = Event.element(evt);
  var node = source.up("div.scContentTreeNode");
  if (node == null || node.id == null || node.id == "") {
    return;
  }

  if (node != null) {
    switch (evt.keyCode) {
      case 37: // left
        node = node.childNodes[0];
        if (node.src.indexOf("/treemenu_expanded.png") >= 0) {
          this.RaiseEventClick(node);
          scForm.browser.clearEvent(evt, true, false);
        }
        break;

      case 39: // right
        node = node.childNodes[0];
        if (node.src.indexOf("/treemenu_collapsed.png") >= 0) {
          this.RaiseEventClick(node);
          scForm.browser.clearEvent(evt, true, false);
        }
        break;

      case 38: // up
        var previousNode = this.getPreviousTreeNode(node) || node.up('div.scContentTreeNode', 0);
        if (previousNode) {
          this.RaiseEventClick(previousNode.down('a'));
          scForm.browser.clearEvent(evt, true, false);
        }
        break;

      case 40: // down
        var nextNode = node.down('div.scContentTreeNode') || node.next() || this.getNextTreeNode(node);
        if (nextNode != null) {
          this.RaiseEventClick(nextNode.down('a'));
          scForm.browser.clearEvent(evt, true, false);
        }
        break;
    }
  }
}

Sitecore.Treeview.getNextTreeNode = function(node) {
  var upperNode = node.up('div.scContentTreeNode');
  var result;
  do {
    result = upperNode.next();
    upperNode = upperNode.up('div.scContentTreeNode');
  } while (upperNode && !result)

  return result;
}

Sitecore.Treeview.getPreviousTreeNode = function (node) {
  var previousNode = node.previous('div.scContentTreeNode');
  if (!previousNode)
    return;

  var lastChildNode = $(previousNode).select(':last-child').last().up('div.scContentTreeNode');

  return lastChildNode;
}

Sitecore.Treeview.RaiseEventClick = function (element) {
  // Safari can not procces .click() on 'img', 'a' and maybe something else
  if (!Prototype.Browser.WebKit) {
    element.click();
  }
  else {
    var eventObj = document.createEvent('MouseEvents');
    eventObj.initEvent('click', true, true);
    element.dispatchEvent(eventObj);
  }
}

Sitecore.getUrlParameterValue = function (param) {
    var search = window.location.search.substring(1);
    if (search.indexOf('&') > -1) {
        var params = search.split('&');
        for (var i = 0; i < params.length; i++) {
            var key_value = params[i].split('=');
            if (key_value[0] == param) {
                return key_value[1];
            }
        }
    } else {
        var params = search.split('=');
        if (params[0] == param) {
            return params[1];
        }
    }
    return null;
}