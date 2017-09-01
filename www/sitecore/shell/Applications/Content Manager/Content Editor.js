function scContentEditor() {
    this.lastVisibleStrip = 0;
    this.fontSize = 0;
    this.isContextualTab = false;
    this.currentGallery = null;
    this.validationTimer = null;
    this.validationTimer2 = null;
    this.contentFocus = null;
    this.treeFocus = null;
    this.ribbonFocus = null;
    this.validatorUpdateDelay = null;

    scForm.Content = this;

    window.$sc && $sc(document).ready(function () {
      scContent.registerJQueryExtensions();
    });

    scForm.browser.attachEvent(document, "onkeyup", function (evt) { scContent.onKeyUp(evt ? evt : window.event) });
    scForm.browser.attachEvent(document, "oncut", function (evt) { scContent.onStartValidators(evt ? evt : window.event) });
    scForm.browser.attachEvent(document, "onpaste", function (evt) { scContent.onStartValidators(evt ? evt : window.event) });
    scForm.browser.attachEvent(window, "onunload", function (evt) { scContent.onUnload(evt ? evt : window.event) });
    scForm.browser.attachEvent(window, "onload", function (evt) { scContent.onLoad(evt ? evt : window.event) });
}

var ignoreNextTabClick = false;

scContentEditor.prototype.onLoad = function (evt) {
    scContentEditorUpdated();

    try {
      if (window.frameElement && $(window.frameElement).observe) {
          var self = this;
          $(window.frameElement).observe("sc:onWindowRestore", function () {
              self.focusActiveItem();
          });

          this.focusActiveItem();
      }
    }
    catch(e) {
    }

    if (!Prototype.Browser.Gecko) {
        return;
    }

    var tree = $$("#ContentTreePanel > div")[0];
    if (tree) {
        tree.observe("scroll", function () {
            if (scContent.treeRelayoutTimer || scContent.ignoreTreeScroll) {
                return;
            }

            scContent.treeRelayoutTimer = setTimeout(function () {
                scContent.ignoreTreeScroll = true;
                tree.setStyle({ opacity: tree.getStyle("opacity") == 1 ? 0.999 : 1 });
                scContent.treeRelayoutTimer = null;
                setTimeout("scContent.ignoreTreeScroll = null", 100);
            }, 250);
        });
    }
}

scContentEditor.prototype.onKeyUp = function (evt) {
    evt = (evt ? evt : window.event);

    if (evt.keyCode == 27) {
        if (this.currentGallery != null) {
            this.closeGallery(evt, false, "key up");
        }
    }
}

scContentEditor.prototype.onStartValidators = function (evt) {
    var srcElement = scForm.browser.getSrcElement(evt);

    if (srcElement.tagName == "INPUT" || srcElement.tagName == "SELECT" || srcElement.tagName == "TEXTAREA" || srcElement.isContentEditable) {
        if (!(srcElement.readOnly == true || srcElement.disabled == true)) {
            if (!scForm.isFunctionKey(evt, true)) {
                this.startValidators();
            }
        }
    }
}

scContentEditor.prototype.onUnload = function (evt) {
    if (window.location.href.indexOf("mo=preview") >= 0) {
        var postAction = "";

        var ctl = scForm.browser.getControl("scPostAction");
        if (ctl != null) {
            postAction = ctl.value;
        }

        var opener = window.opener;

        try {
            if (opener != null) {
                opener = opener.parent;
            }

            if (opener != null) {
                if (postAction.substr(0, 5) == "goto:") {
                    opener.location.href = postAction.substr(5);
                }
                else if (postAction.substr(0, 5) == "back:") {
                    opener.history.back();
                }
                else {
                    opener.location.reload(true);
                }
            }
        }
        catch (e) {
            var text = $("scPostActionText").innerHTML;
            if (text != "") {
                alert(text);
            }
        }
    }
}

scContentEditor.prototype.onEditorClick = function (sender, evt) {
    try {
        if (window.event != null && window.event.scClickReason == "ignore") {
            scForm.browser.clearEvent(evt, true, false);
            return;
        }
    }
    catch (e) {
        // silent
    }

    scForm.browser.closePopups('EditorClick');
    this.closeGallery(evt, false, 'EditorClick');
}

scContentEditor.prototype.getID = function (id) {
    var n = id.indexOf("_");

    if (n >= 0) {
        return id.substr(0, n);
    }

    return id;
}

// ------------------------------------------------------------------
// Communication
// ------------------------------------------------------------------

scContentEditor.prototype.execute = function (command, callback) {
    var request = this.getExecuteRequest.apply(this, arguments);
    request.send();
}

scContentEditor.prototype.getExecuteRequest = function (command, callback) {
    var request = new scRequest();

    var url = "/sitecore/shell/Applications/Content Manager/Execute.aspx?cmd=" + command;

    for (var n = 2; n < arguments.length - 1; n += 2) {
        url += "&" + arguments[n] + "=" + encodeURIComponent(arguments[n + 1]);
    }

    var content = window.location.href;
    var n = content.indexOf("sc_content=");
    if (n >= 0) {
        content = content.substr(n);

        n = content.indexOf("&");
        if (n >= 0) {
            content = content.substr(0, n);
        }

        n = content.indexOf("#");
        if (n >= 0) {
            content = content.substr(0, n);
        }

        url += "&" + content;
    }

    request.url = url;
    request.async = true;
    request.callback = callback;
    request.handle = this.executeHandler;

    return request;
}

scContentEditor.prototype.executeHandler = function (parameters, callback) {
    if (this.httpRequest != null) {
        if (this.httpRequest.status != "200") {
            scForm.showModalDialog("/sitecore/shell/controls/error.htm", new Array(this.httpRequest.responseText), "center:yes;help:no;resizable:yes;scroll:yes;status:no;dialogMinHeight:150;dialogMinWidth:250;dialogWidth:580;dialogHeight:150;header:" + scForm.translate('Error'));
            return;
        }

        if (this.httpRequest.getResponseHeader("SC-Login") == 'true') {
          var parser = document.createElement('a');
          parser.href = this.httpRequest.responseURL;
          window.top.location = parser.protocol + "//" + parser.host + (parser.pathname[0] == '/' ? '' : '/') + parser.pathname +
            "?returnUrl=" + (top.location.pathname[0] == '/' ? '' : '/') + encodeURIComponent(top.location.pathname + top.location.search + top.location.hash);
          return;
        }

        this.response = this.httpRequest.responseText;
    }

    if (this.response != null) {
        if (this.callback != null) {
            this.callback(this.response, this);
        }
    }
}

// ------------------------------------------------------------------
// Ribbon
// ------------------------------------------------------------------

scContentEditor.prototype.canToggleRibbon = function () {
    var doc = window.top.document;
    return !doc.getElementById("scWebEditRibbon");
}

scContentEditor.prototype.getRibbonStrips = function (id) {
    var result = new Array();

    var parent = scForm.browser.getControl(id + "_Toolbar");

    if (parent != null) {
        for (var e = scForm.browser.getEnumerator(parent.getElementsByTagName("DIV")); !e.atEnd(); e.moveNext()) {
            var ctl = e.item();

            if (ctl.className == "scRibbonToolbarStrip" || ctl.className == "scRibbonToolbarContextualStrip") {
                result.push(ctl);
            }
        }
    }

    return result;
}
scContentEditor.prototype.ribbonNavigatorButtonClick = function (sender, evt, id) {
    this.setActiveStrip(id);
    return false;
}
scContentEditor.prototype.ribbonNavigatorButtonDblClick = function (sender, evt, id) {
  this.setActiveStrip(id);
  this.toggleRibbon(100);
  scForm.browser.clearEvent(evt, true, false);
  return false;
}
scContentEditor.prototype.toggleRibbon = function (animationTime) {
  if (this.canToggleRibbon()) {
    jQuery("#Ribbon" + this.getActiveItemId() + "_Toolbar").slideToggle(animationTime, function () {
      var button = document.getElementById('scRibbonToggle');
      button.className = this.style.display == "none" ? 'scRibbonOpen' : "scRibbonClose";
    });
  }
}
scContentEditor.prototype.ribbonNavigatorWheel = function (sender, evt) {
    var strips = this.getRibbonStrips(this.getID(sender.id));
    var index = -1;

    for (var n = 0; n < strips.length; n++) {
        var ctl = strips[n];

        if (ctl.style.display == "") {
            index = n;
            break;
        }
    }

    var delta = (evt.wheelDelta > 0 ? 1 : -1);

    if (index >= 0) {
        index = index + delta;
    }
    else {
        index = this.lastVisibleStrip;
    }

    index = (index < 0 ? 0 : index >= strips.length ? index = strips.length - 1 : index);

    this.setActiveStrip(strips[index].id);

    return false;
}

scContentEditor.prototype.setActiveStrip = function (id) {
    scForm.browser.closePopups('EditorClick');
    this.closeGallery(null, false, 'EditorClick');

    var ribbonID = this.getID(id);

    var strips = this.getRibbonStrips(ribbonID);

    for (var n = 0; n < strips.length; n++) {
        var strip = strips[n];

        var nav = scForm.browser.getControl(ribbonID + "_Nav_" + strip.id.substr(strip.id.lastIndexOf("_") + 1));

        if (nav != null) {
          if (strip.id == id) {
                strip.style.display = "";
                if (document.getElementById(ribbonID + "_Toolbar").style.display == "none")
                { 
                  this.toggleRibbon(0);
                }
                if (strip.firstChild.tagName == "BLOCKQUOTE") {
                    var startComment = "<!--";
                    var endComment = "-->";
                    var html = strip.firstChild.innerHTML;
                    
                    if (html.substring(0, startComment.length) === startComment && html.substring(html.length - endComment.length) === endComment) {
                        html = html.substring(startComment.length);
                        strip.innerHTML = html.substring(0, html.length - endComment.length);
                    }
                }

                nav.className = nav.className.replace(/Normal/gi, "Active");
                this.isContextualTab = nav.className.indexOf("Contextual") >= 0;

                if (!this.isContextualTab) {
                    this.lastNoneContextualStrip = id;
                }
                this.lastVisibleStrip = n;
            }
            else {
                if (this.lastNoneContextualStrip == null && strip.style.display == "") {
                  this.lastNoneContextualStrip = strip.id;
                }

                strip.style.display = "none";
                nav.className = nav.className.replace(/Active/gi, "Normal");

                if (strip.firstChild.tagName != "BLOCKQUOTE") {
                    var quotedHtml = "<BLOCKQUOTE><!--" + strip.innerHTML + "--></BLOCKQUOTE>";
                    strip.innerHTML = quotedHtml;
                }
            }
        }
    }

    var ctl = scForm.browser.getControl("scActiveRibbonStrip");
    if (ctl != null) {
        ctl.value = id;
    }

    return false;
}

// ------------------------------------------------------------------
// Tree
// ------------------------------------------------------------------

scContentEditor.prototype.onTreeClick = function (sender, evt) {
    var ctl = scForm.browser.getSrcElement(evt);

    if (ctl != null) {
        if (ctl.id != null && ctl.id.indexOf("_Glyph_") >= 0) {
            return this.onTreeGlyphClick(ctl, ctl.id.substr(ctl.id.lastIndexOf("_") + 1), this.getID(ctl.id));
        }

        while (ctl != null && ctl.tagName != "A") {
            ctl = ctl.parentNode;
        }

        if (ctl != null) {
            if ($(ctl).hasClassName("scBeenDragged")) {
                console.info("been dragged click");
                Event.stop(evt);
                $(ctl).removeClassName("scBeenDragged");
                return;
            }

            if ($(ctl).hasClassName("scContentTreeNodeStatic")) {
              return;
            }

            if (ctl.id != null && ctl.id.indexOf("_Node_") >= 0) {
                if (!$$('#EditorFrames>iframe[id^="F{"]').any(function (iframe) { return iframe.contentWindow.scForm && iframe.contentWindow.scForm.modified; })
                  || confirm(scForm.translate("There are unsaved changes. Are you sure you want to continue?"))) {
                    return this.onTreeNodeClick(ctl, ctl.id.substr(ctl.id.lastIndexOf("_") + 1));
                }
            }
        }
    }

    this.onEditorClick(sender, evt);

    scForm.browser.clearEvent(evt, true, false);

    return false;
}

scContentEditor.prototype.onTreeNodeClick = function (sender, id) {
    sender = $(sender);

    setTimeout(function () {
        scForm.disableRequests = true;

        if (navigator.userAgent.indexOf('Trident') > 0) {
            var focusKeeper = top.document.getElementById('scIEFocusKeeper');
            if (focusKeeper) focusKeeper.focus();
        }

        scForm.postRequest("", "", "", "LoadItem(\"" + id + "\")");

        $(sender.id).focus();
    }, 1);

    return false;
}

scContentEditor.prototype.collapseTreeNode = function (sender) {
    if (typeof (sender) == "string") {
        sender = scForm.browser.getControl(sender);
    }

    if (sender != null) {
        node = sender.parentNode;
    }

    if (node != null) {
        while (node.childNodes.length > 3) {
            node.removeChild(node.childNodes[3]);
        }

        scForm.browser.setOuterHtml(node.childNodes[0], scForm.browser.getOuterHtml(node.childNodes[0]).replace("/treemenu_expanded.png", "/treemenu_collapsed.png"));
    }
}

scContentEditor.prototype.expandTreeNode = function (sender, result) {
    var node = null;

    if (typeof (sender) == "string") {
        sender = scForm.browser.getControl(sender);
    }

    if (sender != null) {
        node = sender.parentNode;
    }

    if (node != null) {
        this.collapseTreeNode(sender);

        if (result != "") {
            var container = node.ownerDocument.createElement("div");

            node.appendChild(container);

            container.innerHTML = result;

            scForm.browser.setOuterHtml(node.childNodes[0], scForm.browser.getOuterHtml(node.childNodes[0]).replace("/treemenu_collapsed.png", "/treemenu_expanded.png").replace("/noexpand15x15.gif", "/treemenu_expanded.png").replace("/sc-spinner16.gif", "/treemenu_expanded.png"));

            document.fire("sc:contenttreeupdated", node);
        }
        else {
            scForm.browser.setOuterHtml(node.childNodes[0], scForm.browser.getOuterHtml(node.childNodes[0]).replace("/treemenu_collapsed.png", "/noexpand15x15.gif").replace("/treemenu_expanded.png", "/noexpand15x15.gif").replace("/sc-spinner16.gif", "/noexpand15x15.gif"));
        }
    }
}

scContentEditor.prototype.onTreeGlyphClick = function (sender, id, treeid) {
    if (sender.src.indexOf("treemenu_collapsed.png") >= 0 && sender.src.indexOf("noexpand15x15.gif") == -1) {
        function expandTreeNode(result) {
            scContent.expandTreeNode(sender, result);
        }

        var parent = sender.parentNode;

        scForm.browser.setOuterHtml(sender, scForm.browser.getOuterHtml(sender).replace("/treemenu_collapsed.png", "/sc-spinner16.gif").replace("/treemenu_expanded.png", "/sc-spinner16.gif"));

        sender = parent.childNodes[0];

        var language = $F("scLanguage");

        this.execute("GetTreeviewChildren", expandTreeNode, "id", id, "treeid", treeid, "ro", this.getQueryString("ro"), "la", language);
    }
    else if (sender.src.indexOf("treemenu_expanded.png") >= 0) {
        this.collapseTreeNode(sender);
    }

    return false;
}

scContentEditor.prototype.getActiveTreeNode = function (control) {
    while (control != null && control.className != "scContentTree") {
        control = control.parentNode;
    }

    return control && control.querySelector("a.scContentTreeNodeActive");
}

scContentEditor.prototype.blurTreeNode = function () {
  var tree = document.getElementById("ContentTreeInnerPanel");
  var node = this.getActiveTreeNode(tree);
  node && node.classList.add("scContentTreeNodeBlured");
}

scContentEditor.prototype.focusTreeNode = function () {
  var tree = document.getElementById("ContentTreeInnerPanel");
  var node = this.getActiveTreeNode(tree);
  node && node.classList.remove("scContentTreeNodeBlured");
}

scContentEditor.prototype.setActiveTreeNode = function (id, path, treeid) {
    var active = scForm.browser.getControl(id);

    if (active != null) {
        var ctl = this.getActiveTreeNode(active);

        if (ctl != null) {
            ctl.className = "scContentTreeNodeNormal";
        }

        active.className = "scContentTreeNodeActive";
    }
    else if (path != null && path != "") {
        var parts = path.split("/");

        var ctl = this.getActiveTreeNode(scForm.browser.getControl(parts[1]));

        if (ctl != null) {
            ctl.className = "scContentTreeNodeNormal";
        }

        for (var n = 1; n < parts.length; n++) {
            var ctl = scForm.browser.getControl(parts[n]);

            if (ctl == null) {
                function expandTreeToNode(result) {
                    scContent.expandTreeNode(parts[n - 1], result);
                }

                var language = $F("scLanguage");

                this.execute("ExpandTreeviewToNode", expandTreeToNode, "root", parts[n - 1], "id", id, "treeid", treeid, "ro", this.getQueryString("ro"), "la", language);

                break;
            }
        }
    }

    if (!scForm.browser.isIE) {
        setTimeout(function () { scForm.browser.resizeFixsizeElements(); }, 100);
    }

    var active = this.getActiveEditorTab();
    if (!active || active.id.startsWith('B') && !active.id.startsWith('BT') && !active.id.startsWith('BContent')) {
        this.onEditorTabClick(null, null, 'Content' + id.substr(10));
    }
}

scContentEditor.prototype.getTreeDragParameters = function (tag, evt) {
    var control = scForm.browser.getSrcElement(evt);

    while (control != null && control.tagName != "A") {
        control = control.parentNode;
    }

    if (control != null) {
        return "sitecore:item:" + control.id;
    }

    return null;
}

scContentEditor.prototype.onTreeDrag = function (tag, evt) {
    var control = scForm.browser.getSrcElement(evt);

    if (evt.button == 1 || evt.type == "dragstart") {
        while (control != null && control.tagName != "A") {
            control = control.parentNode;
        }

        if (control != null && !$(control).hasClassName('scContentTreeNodeStatic')) {
            scForm.drag(tag, evt, "item:" + control.id);
        }
    }
}

scContentEditor.prototype.onTreeDrop = function (tag, evt) {
    var control = document.elementFromPoint(evt.clientX, evt.clientY);

    while (control != null && control.tagName != "A") {
        control = control.parentNode;
    }

    if (control != null && !!control.id && !$(control).hasClassName('scContentTreeNodeStatic')) {
        var parameters = null;

        if (evt.type == "drop") {
            parameters = 'Drop("$Data,' + control.id + '")';
        }

        scForm.drop(tag, evt, parameters);
    }
}

scContentEditor.prototype.onTreeContextMenu = function (tag, evt) {
    if (evt.ctrlKey) {
        /*Must not ignore CTRL for MacOS, as right click played via CTRL button*/
        if (navigator.userAgent.toUpperCase().indexOf("MAC")==-1) {
            return;
        }
    }

    var control = scForm.browser.getSrcElement(evt);

    while (control != null && control.tagName != "A") {
        control = control.parentNode;
    }

    if (control != null) {
        scForm.lastEvent = evt;
        scForm.invoke('Tree_ContextMenu("' + control.id + '")');
        scForm.lastEvent = null;
    }
    else if (evt.clientX < 20) {
        scForm.postRequest("", "", "", "Gutter_ContextMenu");
    }

    scForm.browser.clearEvent(evt, true, false);
}

scContentEditor.prototype.findNextTreeNode = function (control, useChildren) {
    if (control != null) {
        if (useChildren) {
            if (control.childNodes.length > 2) {
                return control.childNodes[2].childNodes[0];
            }
        }

        var nextSibling = scForm.browser.getNextSibling(control);
        if (nextSibling != null) {
            return nextSibling;
        }

        if (control.parentNode.className != "scContentTree") {
            var parent = control.parentNode.parentNode;

            return this.findNextTreeNode(parent, false);
        }
    }

    return null;
}

scContentEditor.prototype.findPreviousTreeNode = function (control, useChildren) {
    if (control.previousSibling != null) {
        return this.getLastChildTreeNode(control.previousSibling);
    }

    if (control.parentNode.className != "scContentTree") {
        var parent = control.parentNode.parentNode;

        return parent;
    }

    return null;
}

scContentEditor.prototype.getLastChildTreeNode = function (control) {
    if (control.childNodes.length > 2) {
        var ctl = control.childNodes[2];

        return this.getLastChildTreeNode(ctl.childNodes[ctl.childNodes.length - 1]);
    }

    return control;
}

scContentEditor.prototype.onTreeKeyDown = function (tag, evt) {
    if (evt.altKey || evt.shiftKey || evt.ctrlKey) {
        return;
    }

    var source = Event.element(evt);
    var node = source.up("div.scContentTreeNode");
    if (node == null) {
        return;
    }

  switch (evt.keyCode) {
            case 37:
                // left
                node = node.childNodes[0];

                if (node.src.indexOf("/treemenu_expanded.png") >= 0) {
                    this.RaiseEventClick(node);
                    scForm.browser.clearEvent(evt, true, false);
                }
                break;
            case 39:
                // right
                node = node.childNodes[0];

                if (node.src.indexOf("/treemenu_collapsed.png") >= 0) {
                    this.RaiseEventClick(node);
                    scForm.browser.clearEvent(evt, true, false);
                }
                break;
            case 38:
                // up
                var previousNode = this.getPreviousTreeNode(node) || node.up('div.scContentTreeNode', 0);
                if (previousNode) {
                    var treeNodeLink = previousNode.down('a');
                    this.RaiseEventClick(treeNodeLink);
                    scForm.browser.clearEvent(evt, true, false);
                    $(treeNodeLink.id).focus();
                }
                break;
            case 40:
                // down
                var nextNode = node.down('div.scContentTreeNode') || node.next() || this.getNextTreeNode(node);

                if (nextNode != null) {
                    var treeNodeLink = nextNode.down('a');
                    this.RaiseEventClick(treeNodeLink);
                    scForm.browser.clearEvent(evt, true, false);
                    $(treeNodeLink.id).focus();
                }
                break;
      
    case 46: // delete
      scForm.invoke('item:delete', event);
      break;
  }
};

scContentEditor.prototype.getNextTreeNode = function (node) {
    var upperNode = node.up('div.scContentTreeNode');
    var result;
    do {
        result = upperNode.next();
        upperNode = upperNode.up('div.scContentTreeNode');
    } while (upperNode && !result)

    return result;
}

scContentEditor.prototype.getPreviousTreeNode = function (node) {
    var previousNode = node.previous('div.scContentTreeNode');
    if (!previousNode)
        return;

    var lastChildNode = $(previousNode).select(':last-child').last().up('div.scContentTreeNode');

    return lastChildNode;
}

scContentEditor.prototype.RaiseEventClick = function (element) {
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

scContentEditor.prototype.initializeTree = function () {
    var ctl = scForm.browser.getControl("ContentTreePanel");

    if (ctl != null) {
        var visible = (scForm.getCookie("scContentEditorFolders") != "0") && (window.location.href.indexOf("mo=mini") < 0) && (window.location.href.indexOf("mo=popup") < 0) || (window.location.href.indexOf("mo=template") >= 0);

        ctl.style.display = visible ? "" : "none";
    }
}

// ------------------------------------------------------------------
// Galleries
// ------------------------------------------------------------------

scContentEditor.prototype.showGallery = function(sender, evt, id, src, parameters, width, height, where) {
  scForm.focus(sender); // IE bug work-around
  this.closeGallery(evt, true, 'showGallery');
  Event.stop(evt);

  // To do: insert more proper logic than silent try/catch
  if ($("scGalleries")) {
    try {
      var size = $F("scGalleries").toQueryParams()[id];
      if (size != null && size != "") {
        var parts = size.split("q");
        width = parts[0];
        height = parts[1];
      }
    } catch(ex) {
      console.error(ex);
    }
  }

  var url = "/sitecore/shell/default.aspx?xmlcontrol=" + src + "&" + parameters;

  var iframe = document.createElement("IFRAME");

  iframe.id = id;
  iframe.className = "scGalleryFrame";
  iframe.frameBorder = 0;
  iframe.allowTransparency = true;
  iframe.ondeactivate = function () {
    if (top.initializingModalDialog) {
      return false;
    }
    return scContent.closeGallery(id, null, 'ondeactivate');
  };
  iframe.src = url;
  // iframe.style.display = "none";

  iframe.width = width;
  iframe.height = height;

  var bounds = new scRect();
  bounds.clientToRelativeParent(sender);

  var relativeParentSize = new scRect();
  relativeParentSize.getRelativeParentSize(sender);

  var iframeLeft = 0;
  var iframeTop = 0;
  if (where == "expanding") {
    iframeLeft = bounds.left + 2;
    iframeTop = bounds.top;
    if (iframe.width == null || iframe.width == "") {
      iframe.width = sender.offsetWidth + "px";
    }
  } else {
    iframeLeft = bounds.left + 3;
    iframeTop = bounds.top + sender.offsetHeight + 2;
  }

  var iframeWidth = 0;
  try {
    iframeWidth = parseInt(iframe.width);
  } catch(ex) {
    console.error(ex);
  }

  if (relativeParentSize.width > 0 && iframeLeft + iframeWidth > relativeParentSize.width) {
    iframeLeft = relativeParentSize.width - iframeWidth;
  }

  iframe.style.left = iframeLeft + "px";
  iframe.style.top = iframeTop + "px";

  sender.insertBefore(iframe, sender.firstChild);

  this.currentGallery = id;

  return false;
};

scContentEditor.prototype.closeGallery = function (evt, clearEvent, reason) {
    var ctl = scForm.browser.getControl(this.currentGallery);

    if (ctl != null) {
        ctl.parentNode.removeChild(ctl);
    }

    this.currentGallery = null;

    if (scForm.browser.isIE && clearEvent && evt != null) {
        scForm.browser.clearEvent(evt, true, false);
    }

    return false;
}

scContentEditor.prototype.showOutOfFrameGallery = function (sender, evt, destination, dimensions, params, httpVerb) {
    Event.stop(evt);
    var galleryObj = null;
    for (var win = window.self; ; win = win.parent) {
        if (typeof (win.Sitecore) != "undefined" && typeof (win.Sitecore.OutOfFrameGallery) != "undefined") {
            galleryObj = win.Sitecore.OutOfFrameGallery;
            break;
        }

        if (win == window.top) {
            break;
        }
    }

    if (galleryObj == null) {
        console.error("OutOfFrameGallery object not found.");
        return;
    }

    scForm.focus(sender); // IE bug work-around     
    galleryObj.open(sender, destination, dimensions, params, httpVerb);
}

scContentEditor.prototype.showMenu = function (sender, evt, id) {
    scForm.showPopup(null, sender.id, id, "below");
    scForm.browser.clearEvent(evt, true, false);
    return false;
}

// ------------------------------------------------------------------
// Editor
// ------------------------------------------------------------------

scContentEditor.prototype.toggleSection = function (id, sectionName) {
    var el = document.getElementById(id);
    if (el == null) {
        return;
    }

    var nextSibling = el.nextSibling;
    var visible = nextSibling.style.display == "none";

    el.className = visible ? "scEditorSectionCaptionExpanded" : "scEditorSectionCaptionCollapsed";
    jQuery(nextSibling).slideToggle(100);

    var scSections = document.getElementById("scSections");
    var value = scSections.value;

    var p = value.toQueryParams();
    p[sectionName] = visible ? "0" : "1";
    scSections.value = Object.toQueryString(p);

    var glyph = document.getElementById(id + "_Glyph");
    if (glyph != null) {
        var replace = (visible ? "/accordion_down" : "/accordion_up");
        var replaceWith = (visible ? "/accordion_up" : "/accordion_down");

        scForm.browser.setOuterHtml(glyph, scForm.browser.getOuterHtml(glyph).replace(replace, replaceWith));
    }

    if (this.onToggleSection) {
        for (var k = 0; k < this.onToggleSection.length; k++) {
            this.onToggleSection[k](id, sectionName);
        }
    }
}

// ------------------------------------------------------------------
// Folders
// ------------------------------------------------------------------

scContentEditor.prototype.toggleFolders = function () {
    var ctl = scForm.browser.getControl("ContentTreePanel");

    if (ctl != null) {
        var visible = !(ctl.style.display == "");

        ctl.style.display = visible ? "" : "none";

        scForm.setCookie("scContentEditorFolders", visible ? "1" : "0");

        var button = scForm.browser.getControl("RibbonToggleFolders");
        button.childNodes[0].checked = visible;

        if (jQuery(".splitter-bar").toggle(visible).length){
          jQuery('.scContentEditorSplitter').trigger("resize", [ visible? (scForm.getCookie("scContentEditorFoldersWidth") || 200) : 0 ]);
        } else{
          this.turnOnSplitter();
        }
    }

    if (typeof (scGeckoRelayout) != "undefined") {
        scForm.browser.initializeFixsizeElements();
    }
};

// ------------------------------------------------------------------
// Splitter
// ------------------------------------------------------------------

scContentEditor.prototype.turnOnSplitter = function () {
    jQuery('.scContentEditorSplitter').splitter( {
        resizeTo: document.getElementById('MainPanel'),
        sizeLeft: scForm.getCookie("scContentEditorFoldersWidth") || 200,
        onEndSplitMouse: function (pos) {
            scForm.setCookie("scContentEditorFoldersWidth", pos);
        }
    });
}

// ------------------------------------------------------------------
// Item Buckets Fullscreen
// ------------------------------------------------------------------

scContentEditor.prototype.fullScreen = function () {
    if (!scForm.browser.isIE) {
        window.$sc(window.top.document).fullScreen(true);
    }
};

scContentEditor.prototype.activateContextualTab = function (id) {
    var contextuals = scForm.browser.getControl(id + "_ContextualToolbar");

    for (var s = scForm.browser.getEnumerator(contextuals.childNodes) ; !s.atEnd() ; s.moveNext()) {
        if (s.item().className == "scRibbonToolbarStrip" || s.item().className == "scRibbonToolbarContextualStrip") {
            scContent.setActiveStrip(s.item().id);
            return true;
        }
    }

    return false
}

scContentEditor.prototype.activate = function (tag, evt, parameters) {
    if (evt != null) {
        scForm.activate(tag, evt);
    }

    if (parameters != this.lastActivated) {
        if (parameters.indexOf("&rib=1") >= 0) {
            this.updateContextualTabs(tag, evt, parameters);
        }
        else {
            this.clearContextualTabs();
        }
    }

    this.lastActivated = parameters;
    this.activeField = tag.id;
}

scContentEditor.prototype.clearContextualTabs = function (reset) {
    var reset = false;

    var ctl = scForm.browser.getControl("Ribbon" + this.getActiveItemId() + "_ContextualToolbar");
    if (typeof (ctl) == "undefined" || !ctl) {
        return;
    }

    reset = ctl.childNodes.length > 0;
    ctl.innerHTML = "";

    $$(".scRibbonNavigatorButtonsContextualGroup").invoke("remove");

    if (reset && this.lastNoneContextualStrip != null) {
        this.setActiveStrip(this.lastNoneContextualStrip);
    }
}

scContentEditor.prototype.updateContextualTabs = function (tag, evt, parameters) {

    var ctl = scForm.browser.getControl("Ribbon" + this.getActiveItemId() + "_Navigator");
    if (ctl == null) {
        return;
    }


    function setTabs(result) {
        if (result != "" && result != null) {
            eval("var data = " + result);

            var ctl = scForm.browser.getControl("Ribbon" + this.getActiveItemId() + "_Navigator");
            if (ctl != null) {
                var div = document.createElement("div");

                div.innerHTML = data.navigator;

                while (div.childNodes.length > 0) {
                    ctl.appendChild(div.childNodes[0]);

                }
            }

            ctl = scForm.browser.getControl("Ribbon" + this.getActiveItemId() + "_ContextualToolbar");
            if (ctl != null) {
                ctl.innerHTML = data.strips;
            }

            if (scContent.isContextualTab) {
                scContent.setActiveStrip(scContent.lastNoneContextualStrip);
            }
        }
    }

    for (var key in scForm.suspended) {
        if (key != null) {
            window.setTimeout(function () { scContent.updateContextualTabs(tag, null, parameters) }, 0);
            return;
        }
    }

    this.execute("GetContextualTabs", setTabs, "parameters", parameters);
}

scContentEditor.prototype.deactivate = function (tag, evt, parameters) {
    scForm.activate(tag, evt);
}

scContentEditor.prototype.fire = function (command) {
    if (this.activeField != null) {
        var frame = scForm.browser.getControl(this.activeField);

        if (frame != null) {
            try {
                frame.contentWindow.scFire(command);
            } catch (ex) {
                console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
            }
        }
    }

    var evt = window.event;
    if (evt != null) {
        scForm.browser.clearEvent(evt, true, false);
    }
}

scContentEditor.prototype.fireCombobox = function (tag, evt, command) {
    if (this.activeField != null) {
        var frame = scForm.browser.getControl(this.activeField);

        if (frame != null) {
            var value = tag.options[tag.selectedIndex].value;

            try {
                frame.contentWindow.scFireCombobox(command, value);
            } catch (ex) {
                console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
            }
        }
    }
}

scContentEditor.prototype.getQueryString = function (name) {
    var qs = window.location.href;

    var n = qs.indexOf("?");
    if (n < 0) {
        return "";
    }

    qs = "&" + qs.substr(n + 1);

    var n = qs.indexOf("&" + name + "=");
    if (n < 0) {
        return "";
    }

    qs = "&" + qs.substr(name.length + 2);

    var n = qs.indexOf("&");
    if (n >= 0) {
        qs = qs.substr(0, n);
    }

    return qs;
}

scContentEditor.prototype.watermarkFocus = function (sender, evt) {
    sender = sender || evt.target;

    if (!sender.dirty) {
        sender.watermark = sender.value;
        sender.value = "";
        sender.style.color = "black";
    }
}

scContentEditor.prototype.watermarkBlur = function (sender, evt) {
    if (sender.value == "") {
        sender.value = sender.watermark;
        sender.style.color = "#969696";
        sender.dirty = false;
    }
    else {
        sender.dirty = true;
    }
}

// ------------------------------------------------------------------
// Multilist
// ------------------------------------------------------------------

scContentEditor.prototype.multilistMoveLeft = function (id, allOptions) {
    var all = scForm.browser.getControl(id + "_unselected");
    var selected = scForm.browser.getControl(id + "_selected");

    for (var n = 0; n < selected.options.length; n++) {
        var option = selected.options[n];

        if (option.selected || allOptions == true) {
            var index = 0;

            var header = option.innerHTML;

            for (var i = 0; i < all.options.length - 1; i++) {
                if (header < all.options[i].innerHTML) {
                    index = i;
                    break;
                }
            }

            var opt = document.createElement("OPTION");

            all.options.add(opt, index);

            opt.innerHTML = header;
            opt.value = option.value;
        }
    }

    this.multilistRemoveSelected(selected, allOptions, id + "_selected_help");

    this.multilistUpdate(id);
}

scContentEditor.prototype.multilistMoveRight = function (id, allOptions) {
    var all = scForm.browser.getControl(id + "_unselected");
    var selected = scForm.browser.getControl(id + "_selected");

    for (var n = 0; n < all.options.length; n++) {
        var option = all.options[n];

        if (option.selected || allOptions == true) {
            var opt = document.createElement("OPTION");

            selected.appendChild(opt);

            opt.innerHTML = option.innerHTML;
            opt.value = option.value;
        }
    }

    this.multilistRemoveSelected(all, allOptions, id + "_all_help");

    this.multilistUpdate(id);
}

scContentEditor.prototype.multilistMoveDown = function (id) {
    var selected = scForm.browser.getControl(id + "_selected");

    var index = 0;

    for (var n = selected.options.length - 1; n >= 0; n--) {
        var option = selected.options[n];

        if (!option.selected) {
            index = n;
            break;
        }
    }

    for (var n = index - 1; n >= 0; n--) {
        var option = selected.options[n];

        if (option.selected) {
            scForm.browser.swapNode(option, scForm.browser.getNextSibling(option));
        }
    }

    this.multilistUpdate(id);
}

scContentEditor.prototype.multilistMoveUp = function (id) {
    var selected = scForm.browser.getControl(id + "_selected");

    var index = selected.options.length;

    for (var n = 0; n < selected.options.length; n++) {
        var option = selected.options[n];

        if (!option.selected) {
            index = n;
            break;
        }
    }

    for (var n = index + 1; n < selected.options.length; n++) {
        var option = selected.options[n];

        if (option.selected) {
            scForm.browser.swapNode(option, scForm.browser.getPreviousSibling(option));
        }
    }

    this.multilistUpdate(id);
}

scContentEditor.prototype.multilistRemoveSelected = function (list, allOptions, id) {
    var index = -1;

    for (var n = list.options.length - 1; n >= 0; n--) {
        var option = list.options[n];

        if (option.selected || allOptions == true) {
            index = n;
            if (Prototype.Browser.IE) {
                list.options.remove(n);
            }
            else {
                list.remove(n);
            }
        }
    }

    if (index >= list.options.length) {
        index = list.options.length - 1;
    }

    var help = scForm.browser.getControl(id);

    if (index >= 0 && index < list.options.length) {
        list.selectedIndex = index;
        help.innerHTML = list.options[index].innerHTML;
    }
    else {
        help.innerHTML = "";
    }

    list.focus();
}

scContentEditor.prototype.multilistUpdate = function (id) {
    var selected = scForm.browser.getControl(id + "_selected");

    // IE listbox hack
    selected.style.position = selected.style.position == 'relative' ? 'static' : 'relative';

    var value = "";

    for (var n = 0; n < selected.options.length; n++) {
        var option = selected.options[n];
        value += (value != "" ? "|" : "") + option.value;
    }

    var selectedValues = scForm.browser.getControl(id + "_Value");

    selectedValues.value = value;
}

/* Switcher */

scContentEditor.prototype.switchTo = function (id, url) {
    location.href = url;

    if (event != null) {
        scForm.browser.clearEvent(event, true, false);
    }

    return false;
}

scContentEditor.prototype.scrollPanel = function (id, direction) {
    var ctl = scForm.browser.getControl(id);

    if (ctl != null && ((direction && ctl.scrollTop > 0) || (!direction && ctl.scrollTop + ctl.clientHeight < ctl.scrollHeight))) {
        var data = new Object();

        data.id = id;
        data.property = "scrollTop";
        data.delta = direction ? -4 : 4;
        data.steps = 11;
        data.speed = 25;

        setTimeout(function () { scContent.animate(data) }, 25);
    }
}

scContentEditor.prototype.animate = function (data) {
    var ctl = scForm.browser.getControl(data.id);

    if (ctl != null) {
        eval("ctl." + data.property + " += " + data.delta);
        data.steps--;

        if (data.steps > 0) {
            setTimeout(function () { scContent.animate(data) }, data.speed);
        }
    }
}

scContentEditor.prototype.postMessage = function (message) {
    for (var n = 0; n < window.frames.length; n++) {
        try {
            scForm.postMessageToWindow(window.frames[n], message);
        } catch (ex) {
            console.log("Failed to access frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
        }
    }
}

scContentEditor.prototype.scrollTo = function (sender, evt) {
    var srcElement = scForm.browser.getSrcElement(evt);
    var ctl = scForm.browser.getControl(srcElement.id.substr(4));
    var isSection = ctl && ctl.id && ctl.id.indexOf('Section') == 0;

    var scrollToCtl = isSection ? ctl : scForm.browser.getControl('FieldMarker' + srcElement.id.substr(4));

    ctl = ctl || scrollToCtl;

    var sectionCtl = isSection ? ctl : $(ctl).up('.scEditorSectionPanel').previous();
    if (sectionCtl.className == 'scEditorSectionCaptionCollapsed') {
        this.RaiseEventClick($(sectionCtl).down('.scEditorSectionCaptionGlyph'));
    }

    scForm.focus(ctl);

    scForm.browser.scrollIntoView(scrollToCtl);

    scForm.browser.closePopups('ScrollTo');

    scForm.browser.clearEvent(evt, true, false);

    return false;
}

/* Validation */

scContentEditor.prototype.startValidators = function (sender, evt) {
    if (this.validatorUpdateDelay == null) {
        var ctl = scForm.browser.getControl("scValidatorsUpdateDelay");

        if (ctl == null) {
            return;
        }

        this.validatorUpdateDelay = parseInt(ctl.value, 10);
    }

    if (this.validatorUpdateDelay == 0) {
        return;
    }

    this.clearValidatorTimeouts();

    if (!this.hasValidators()) {
        return;
    }

    var validator = this.getValidator();
    if (validator != null) {
        validator.innerHTML = "<div class=\"scValidationResultValidating\"></div>";

        this.validationTimer = window.setTimeout(function () { scContent.validate() }, this.validatorUpdateDelay);
    }
}

scContentEditor.prototype.getValidator = function () {
  var controls = document.getElementsByClassName("scValidatorPanel");
  if (controls != undefined && controls.length > 0) {
    return controls[0];
  }
  return null;
}

scContentEditor.prototype.renderValidators = function (result, frequency) {
    var validator = this.getValidator();
    validator.innerHTML = result;

    this.updateFieldMarkers();

    if (result.indexOf("Applications/16x16/bullet_square_grey.png") >= 0) {
        this.validationTimer2 = window.setTimeout("scContent.updateValidators()", frequency);
    }
}

scContentEditor.prototype.validate = function () {
    this.clearValidatorTimeouts();

    if (!this.hasValidators()) {
        return;
    }

    var validator = this.getValidator();
    validator.innerHTML = "<div class=\"scValidationResultValidating\"></div>";

    scForm.postRequest("", "", "", "ValidateItem", null, true);
}

scContentEditor.prototype.hasValidators = function () {
    var hasValidators = scForm.browser.getControl("scHasValidators");
    if (hasValidators == null) {
        return false;
    }
    return hasValidators.value == "1";
}

scContentEditor.prototype.clearValidatorTimeouts = function () {
    if (this.validationTimer != null) {
        window.clearTimeout(this.validationTimer);
    }
    this.validationTimer = null;

    if (this.validationTimer2 != null) {
        window.clearTimeout(this.validationTimer2);
    }
    this.validationTimer2 = null;
}

scContentEditor.prototype.updateValidators = function () {
    scForm.postRequest("", "", "", "UpdateValidators", null, true);
}


scContentEditor.prototype.updateFieldMarkers = function (itemId) {
  itemId = itemId || "";
  var validatorPanel = {};
  if (itemId === "") {
    validatorPanel = this.getValidator();
  } else {
    validatorPanel = $("ValidatorPanel" + itemId);
  }


  $sc("[id^=FieldMarker]").each(function (index, element) { element.className = "scEditorFieldMarkerBarCell" });

  for (var e = scForm.browser.getEnumerator(validatorPanel.getElementsByTagName("DIV")) ; !e.atEnd() ; e.moveNext()) {
    var ctl = e.item();

    if (ctl.id.substr(0, 16) == "ValidationMarker") {
      var id = ctl.id.substr(16);

      var marker = $("FieldMarker" + id);
      if (marker != null) {
        marker.className = ctl.firstChild.innerHTML;
        $(marker).title = ctl.childNodes[1].alt ? ctl.childNodes[1].alt : ctl.childNodes[1].title;
      }
    }
  }
}

scForm.activateEx = scForm.activate;

scForm.activate = function (sender, evt) {
    if (evt.type == "deactivate" || evt.type == "blur") {
        scContent.startValidators();
    }
    scForm.activateEx(sender, evt);
}

/* Editor tabs */

scContentEditor.prototype.getActiveEditorTab = function () {
  return document.querySelector("#EditorTabs .scRibbonEditorTabActive");
}

scContentEditor.prototype.replaceImageSrc = function (element, text, withText) {
    var src = scForm.browser.getImageSrc(element);
    src = src.replace(text, withText);
    scForm.browser.setImageSrc(element, src);
}

scContentEditor.prototype.setActiveRibbon = function(itemId) {
    this.closeAllRibbons();

    var self = this;
    $sc("#RibbonPanel>.scRibbon")
        .each(function (index, ribbonElement) {
            if (ribbonElement.id.indexOf(itemId) > -1) {
                ribbonElement.style.display = "";
                var stripToActive = ribbonElement.querySelector(".scRibbonToolbarStrip");
                self.setActiveStrip(stripToActive.id);
            }
        });
};

scContentEditor.prototype.deactivateAllEditorTabs = function () {
  this.onEditorTabClick();
}

scContentEditor.prototype.onEditorTabClick = function (sender, evt, id) {
    if (ignoreNextTabClick == true && navigator.userAgent.indexOf('Firefox') > 0) {
        ignoreNextTabClick = false;
        return;
    }
  
    if (id == "TAddNewSearch") {
      window.scForm.postRequest('', '', '', 'contenteditor:launchblanktab(url=' + '' + ')');
      return;
    }

    scForm.browser.clearEvent(evt, true, false);

    var activeTab = this.getActiveEditorTab();

    if (activeTab != null) {
      activeTab.className = "scRibbonEditorTabNormal";
      var activeTabHeader = activeTab.querySelector(".scEditorTabHeaderActive");
      if (activeTabHeader) {
        activeTabHeader.className = "scEditorTabHeaderNormal";
      }

      var activeFrame = scForm.browser.getControl("F" + activeTab.id.substr(1));

      activeFrame.style.display = "none";
    }

    $$("#EditorTabs .scEditorTabControlsHolder").invoke("hide");

    var e = $("EditorTabControls_" + id);
    if (e != null) {
      Element.show("EditorTabControls_" + id);
    }

    if (id) {
      var newActiveItemId = this.extractItemId(id) || this.getPrimaryItemId();
      var activeItemId = this.getActiveItemId();
    
      if (activeItemId != newActiveItemId) {
        this.setActiveRibbon(newActiveItemId);
        var tab = this.getEditorTabs().filter(function (tab) { return tab.id.indexOf(newActiveItemId) > -1 })[0];
        if (tab) {
          scForm.invoke("SetActiveItem", newActiveItemId, tab.language, tab.version);
        } else {
          var primaryItemUri = this.getPrimaryItemUri();
          scForm.invoke("SetActiveItem", newActiveItemId, primaryItemUri.language, primaryItemUri.version);
        }
      }
    }
    
    var newActiveTab = scForm.browser.getControl("B" + id);

    if (id == "SelectSearch") {
        var allBucketTabs = $$(".scEditorTabIcon");
        for (var n = 0; n < allBucketTabs.length; n++) {
            if (allBucketTabs[n].src.indexOf("applications/16x16/view.png") != -1) {
                var currentId = allBucketTabs[n].parentElement.parentElement;
                newActiveTab = scForm.browser.getControl(currentId.id);
            }
        }
    }

    if (newActiveTab != null) {
        newActiveTab.className = "scRibbonEditorTabActive";
        var newActiveTabHeader = newActiveTab.querySelector(".scEditorTabHeaderNormal");
        if (newActiveTabHeader) {
          newActiveTabHeader.className = "scEditorTabHeaderActive";
        }
    
        var frame = scForm.browser.getControl("F" + id);

        if (id == "SelectSearch") {
          var allBucketTabs = $$(".scEditorTabIcon");
          for (var n = 0; n < allBucketTabs.length; n++) {
              if (allBucketTabs[n].src.indexOf("applications/16x16/view.png") != -1) {
                  var currentId = allBucketTabs[n].parentElement.parentElement;
                  frame = scForm.browser.getControl("F" + currentId.id.substr(1, currentId.id.length));
              }
          }
        }

        frame.style.display = "";

        if (Prototype.Browser.Gecko || Prototype.Browser.WebKit) {
            scForm.browser.initializeFixsizeElements(true);
        }

        var scActiveEditorTab = scForm.browser.getControl("scActiveEditorTab");
        scActiveEditorTab.value = id;

        if (this.isContextualTab) {
            this.setActiveStrip(this.lastNoneContextualStrip);
        }

        this.clearContextualTabs();

        try {
            if (frame.contentWindow != null && frame.contentWindow.scOnShowEditor != null) {
                frame.contentWindow.scOnShowEditor();
            }
        } catch (ex) {
            console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
        }

        if (this.onEditorTabActivated) {
            for (var k = 0; k < this.onEditorTabActivated.length; k++) {
                this.onEditorTabActivated[k]();
            }
        }
    }
}

scContentEditor.prototype.onEditorTabActivated = [];
scContentEditor.prototype.subscribeToEditorTabActivatedEvent = function (delegate) {
    if (!delegate) {
        return;
    }

    if (!scContentEditor.prototype.onEditorTabActivated) {
        scContentEditor.prototype.onEditorTabActivated = [];
    }

    scContentEditor.prototype.onEditorTabActivated[scContentEditor.prototype.onEditorTabActivated.length] = delegate;
}

scContentEditor.prototype.showEditorTab = function (command, header, icon, url, id, closeable, activate, language, version, title) {
    var editorTabs = scForm.browser.getControl("EditorTabs");
    var editors = scForm.browser.getControl("EditorFrames");

    scForm.browser.setImageSrc(editorTabs.lastChild.lastChild, "/sitecore/shell/themes/standard/Images/Ribbon/tab2.png");

    var div = document.createElement("div");

    var html = "<a id=\"B" + id + "\" href=\"#\" class=\"scRibbonEditorTabNormal\" title=\"" + title + "\" oncontextmenu=\"javascript:return scForm.postEvent(this,event,'ShowTabContextMenu');\" onclick=\"javascript:return scContent.onEditorTabClick(this,event,'" + id + "')\"><span class=\"scEditorTabHeaderNormal\"><img src=\"" + icon + "\" width=\"16\" height=\"16\" alt=\"\" border=\"0\" class=\"scEditorTabIcon\" /><span>" + header + "</span>";
    if (closeable) {
        var src = " src='/sitecore/shell/themes/standard/Images/tab_close_24x24.png'";
        html += "<div class=\"scEditorTabCloseContainer\"><img class=\"scEditorTabClose\" onmouseover=\"javascript:return scForm.rollOver(this, event)\" onclick=\"javascript:scContent.closeEditorTab('" + id + "');\" onmouseout=\"javascript:return scForm.rollOver(this, event)\" height=\"16\" alt=\"\" width=\"16\" border=\"0\"" + src + " /></div>";
    }

    html += "</span></a>";

    div.innerHTML = html;

    editorTabs.appendChild(div.firstChild);


    var iframe = document.createElement("iframe");
    iframe.id = "F" + id;
    iframe.src = url + (activate ? "&ar=1" : "");
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "no";
    iframe.marginWidth = "0";
    iframe.marginHeight = "0";
    iframe.style.display = "none";
    editors.appendChild(iframe);

    this.addEditorTab(command, header, icon, url, closeable, id, language, version, title);

    this.onEditorTabClick(null, null, id);
}

scContentEditor.prototype.closeAllEditorTab = function () {
  var tabs = this.getEditorTabs();

  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].closable) {
      this.closeEditorTab(tabs[i].id);
    }
  }
}

scContentEditor.prototype.closeEditorTab = function (tabId) {
    var $tabToClose = $sc("#B" + tabId);

    if ($tabToClose.length == 0) {
        return;
    }

    if (!this.getEditorTabs().any(function (tab) { return tab.id == tabId && tab.closable })) {
      return;
    }

    var itemId = this.extractItemId(tabId);
    var itemContent = document.querySelector("#F" + tabId);
    if ((itemId && scForm.getModified(itemId)
      || itemContent
      && itemContent.contentWindow
      && itemContent.contentWindow.scForm
      && itemContent.contentWindow.scForm.getModified())
      && !confirm(scForm.translate("There are unsaved changes. Are you sure you want to continue?"))) {
        return;
    }

    if (tabId.indexOf("Content") == 0) {
      scForm.invoke("CloseTab", tabId);
    }

    var currentItemId = this.extractItemId(tabId);

    scForm.setModified(false, currentItemId);

    var relatedTabs = document.querySelectorAll("#EditorTabs [id$='" + currentItemId + "'][class^=scRibbonEditorTab]");

    // if the latest item tab is removed
    if (relatedTabs.length == 1) {
      this.removeRibbon(currentItemId);

      var primaryItemUri = this.getPrimaryItemUri();
      scForm.invoke("SetActiveItem", primaryItemUri.id, primaryItemUri.language, primaryItemUri.version);
      this.setActiveRibbon(primaryItemUri.id);
    }

    var tabs = this.getEditorTabs();
    for (var n = 0; n < tabs.length; n++) {
      if (tabs[n].id.indexOf(tabId) >= 0) {
        tabs.splice(n, 1);
      }
    }

    this.setEditorTabs(tabs);

    scForm.browser.clearEvent(window.event, true, false);

    var frame = scForm.browser.getControl("F" + tabId);
    frame.parentNode.removeChild(frame); // frame of tab

    var editorTabControls = document.getElementById("EditorTabControls_" + tabId);
    if (editorTabControls) {
      editorTabControls.parentNode.removeChild(editorTabControls);
    }

    var activeEditorTab = this.getActiveEditorTab();
    var activeEditorTabId = activeEditorTab && activeEditorTab.id;
    var $newActiveButton;
    if (activeEditorTabId === $tabToClose.attr("id")) {
      $newActiveButton = $tabToClose.prevAll(":not(#BTAddNewSearch, .scEditorTabControlsHolder)") ||
        $tabToClose.nextAll(":not(#BTAddNewSearch, .scEditorTabControlsHolder)");
    }

    $tabToClose.remove(); // tab to remove

    var newActiveButtonId = $newActiveButton && $newActiveButton.attr("id").substr(1);

    if (newActiveButtonId) {
        this.onEditorTabClick(null, null, newActiveButtonId);
    }

    ignoreNextTabClick = true;

    return;
};

scContentEditor.prototype.removePrimaryItemStaticTabs = function () {
  var primaryItemTabs = $sc("#EditorTabs [class^=scRibbonEditorTab][id!=BTAddNewSearch]:not(:has(.scEditorTabClose))");

  for (var i = 0; i < primaryItemTabs.length; i++) {
    var generalTabId = primaryItemTabs[i].id.substr(1);
    $sc("[id$=" + generalTabId + "]").remove();
  }
};

scContentEditor.prototype.updateItemDynamicTabIds = function (oldId, newId) {
  var primaryItemTabs = $sc("#EditorTabs [id$='" + oldId + "']:has(.scEditorTabClose)");
  primaryItemTabs.each(function (index, tabButton) {
    var tabFrame = $sc("#EditorFrames [id$=" + tabButton.id.substr(1) + "]");
    if (tabFrame.length > 0) {
      tabFrame[0].id = tabFrame[0].id.replace(/.{32}$/, newId);
    }

    tabButton.id = tabButton.id.replace(/.{32}$/, newId);
  });
};

scContentEditor.prototype.getEditorTabs = function () {
  var scEditorTabs = document.getElementById("scEditorTabs");
  var editorTabsValue = scEditorTabs && scEditorTabs.value;

  if (!editorTabsValue) {
    return [];
  }

  var editorTabs = editorTabsValue.split('|')
    .map(function (tab) {
      var editorTabParts = tab.split('^');
      if (editorTabParts.Length < 9) {
        throw new Exception("Cannot parse EditorTabs value");
      }

      return {
        command: editorTabParts[0],
        header: editorTabParts[1],
        icon: editorTabParts[2],
        url: editorTabParts[3],
        closable: editorTabParts[4] === "1",
        id: editorTabParts[5],
        language: editorTabParts[6],
        version: editorTabParts[7],
        title: editorTabParts[8]
      };
    });

  return editorTabs;
};

scContentEditor.prototype.setEditorTabs = function (editorTabs) {
  var scEditorTabs = document.getElementById("scEditorTabs");

  if (!scEditorTabs) {
    return;
  }

  var editorTabsValue = editorTabs.map(function (tab) {
    return [tab.command, tab.header, tab.icon, tab.url, tab.closable ? "1" : "0", tab.id, tab.language, tab.version, tab.title].join('^');
  }).join('|');

  scEditorTabs.value = editorTabsValue;
};

scContentEditor.prototype.addEditorTab = function (command, header, icon, url, closable, id, language, version, title) {
  var tabs = this.getEditorTabs();

  tabs.push({
    command: command,
    header: header,
    icon: icon,
    url: url,
    closable: closable,
    id: id,
    language: language,
    version: version,
    title: title
  });

  this.setEditorTabs(tabs);
};

scContentEditor.prototype.closeAllButThis = function (thisTab) {
  var tabs = this.getEditorTabs();

  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].closable && tabs[i].id != thisTab) {
      this.closeEditorTab(tabs[i].id);
    }
  }
}

scContentEditor.prototype.closeAllToRightEditorTab = function (thisTab) {
  var isDynamicTab = this.getEditorTabs().any(function (tab) { return tab.id == thisTab });
  var closeTabs = !isDynamicTab;

  var tabs = this.getEditorTabs();

  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].closable && closeTabs) {
      this.closeEditorTab(tabs[i].id);
    }

    if (tabs[i].id == thisTab) {
      closeTabs = true;
    }
  }
};

scContentEditor.prototype.focusActiveItem = function () {
    var contentTreeInnerPanel = this.getActiveTreeNode(scForm.browser.getControl('ContentTreeInnerPanel'));

    if (contentTreeInnerPanel != null) {
        contentTreeInnerPanel.focus();
    }
};

scContentEditor.prototype.closeAllRibbons = function () {
    var self = this;
    $sc("#RibbonPanel>.scRibbon").each(function (index, ribbonElement) {
        self.setActiveStrip(ribbonElement.id); // this call unselects all strips, because id contains only the ribbon id and not the strip id
        ribbonElement.style.display = "none";
    });
};

scContentEditor.prototype.removeRibbon = function (id) {
  var ribbonToremove = document.querySelector("#RibbonPanel > [id$='" + id + "']");
  if (ribbonToremove) {
    ribbonToremove.parentElement.removeChild(ribbonToremove);
  }
}

scContentEditor.prototype.registerJQueryExtensions = function () {
  (function ($) {
    // Prototype.js replaces the original reverse function and put it to _reverse
    $.fn.scReverse = []._reverse || [].reverse;

    $.fn.scFilter = function (options) {

      var settings = $.extend({
        itemsSelector: null,
        categorySelector: null
      }, options);

      var element = this[0];

      if (!element || element.tagName != "INPUT" || element.type != "text") {
        console.error("'scFilter' could be applied only for <input type=\"text\" /> elements");
        return this;
      }

      if (!settings.itemsSelector) {
        console.error("'itemsSelector' must be specified");
        return this;
      }

      this.on("input",
        function () {
          var inputElement = this;

          var showCategory = false;

          $.each($(settings.itemsSelector).scReverse(), function () {
            var isVisible = this.textContent.toUpperCase().indexOf(inputElement.value.toUpperCase()) != -1;
            if (isVisible) {
              showCategory = true;
            }

            var isCategory = $(this).is(settings.categorySelector);
            if (isCategory) {
              isVisible = isVisible || showCategory;
              showCategory = false;
            }

            this.style.display = isVisible ? "" : "none";
          });
        });

      return this;
    };
  })(jQuery);
};

scContentEditor.prototype.initializeEditorHeaderNavigatorFilter = function () {
  jQuery(".scEditorHeaderNavigatorFilter")
    .scFilter({
      itemsSelector: ".scEditorHeaderNavigatorMenu [class^=scEditorHeaderNavigator]",
      categorySelector: ".scEditorHeaderNavigatorMenu .scEditorHeaderNavigatorSection"
    }).focus();
};

/* Ribbon Proxies */

function scUpdateRibbonProxy(source, target, activateRibbon) {
    var form = scForm.getParentForm();

    if (form.hasSuspendedRequests()) {
        setTimeout("scUpdateRibbonProxy('" + source + "','" + target + "'," + activateRibbon + ")", 5);
        return;
    }

    var sourceNavigator = scForm.browser.getControl(source + "_Navigator");
    var sourceToolbar = scForm.browser.getControl(source + "_ContextualToolbar").parentNode;

    var targetNavigator = form.browser.getControl(target + form.Content.getActiveItemId() + "_Navigator");
    var targetToolbar = form.browser.getControl(target + form.Content.getActiveItemId() + "_ContextualToolbar");

    var activeStripID = null;
    var activeStripIndex = -1;

    var activeStrip = form.browser.getControl("scActiveRibbonStrip");
    if (activeStrip != null) {
        activeStripID = activeStrip.value;
    }

    var n = 0;
    var toolbar = sourceToolbar.cloneNode(true);
    toolbar.removeChild(toolbar.lastChild);
    for (var e = scForm.browser.getEnumerator(toolbar.childNodes) ; !e.atEnd() ; e.moveNext()) {
        var ctl = e.item();
        ctl.className = "scRibbonToolbarContextualStrip";

        if (activateRibbon) {
            activeStripID = ctl.id;
            activateRibbon = false;
        }

        ctl.style.display = (ctl.id == activeStripID ? "" : "none");

        if (ctl.id == activeStripID) {
            ctl.style.display = "";
            activeStripIndex = n;
        }
        else {
            ctl.style.display = "none";
        }

        n++;
    }

    window.parent.scContent.clearContextualTabs(true);

    var toolbarHtml = toolbar.innerHTML;

    var frameID = scForm.browser.getFrameElement(window).id;

    function convertEvent($0, $1) {
        var command = $1;

        if (command.substr(0, 11) == "javascript:") {
            command = command.substr(11);
        }

        if (command.substr(0, 7) == "return ") {
            command = command.substr(7);
        }

        if (command.substr(0, 22) == "scContent.showGallery(") {
            return $0;
        }

        command = command.replace(/'/g, "\"");

        var code = "scUpdateRibbonProxyValues(\"" + frameID + "\",\"" + target + "\");return scForm.browser.getControl(\"" + frameID + "\").contentWindow." + command;

        return "_sc_event='javascript:" + code + "'";
    }

    function replaceEvent(eventName) {
        var re = new RegExp(eventName + "=\"([^\"]*)\"", "g");
        toolbarHtml = toolbarHtml.replace(re, convertEvent);

        var re = new RegExp(eventName + "='([^']*)'", "g");
        toolbarHtml = toolbarHtml.replace(re, convertEvent);

        var re = new RegExp(eventName + "=(\S+)", "g");
        toolbarHtml = toolbarHtml.replace(re, convertEvent);

        toolbarHtml = toolbarHtml.replace(/_sc_event/g, eventName);
    }

    replaceEvent("onclick");
    replaceEvent("onchange");

    toolbarHtml = toolbarHtml.replace(/Ribbon_/gi, "Ribbon" + form.Content.getActiveItemId() + "_");

    targetToolbar.innerHTML = toolbarHtml;

    var navigatorHtml = scForm.browser.getOuterHtml(sourceNavigator);
    navigatorHtml = navigatorHtml.replace(/scRibbonNavigatorButtonsNormal/gi, "scRibbonNavigatorButtonsContextualNormal");
    navigatorHtml = navigatorHtml.replace(/scRibbonNavigatorButtonsActive/gi, "scRibbonNavigatorButtonsContextualNormal");
    navigatorHtml = navigatorHtml.replace(/scRibbonNavigatorButtonsContextualActive/gi, "scRibbonNavigatorButtonsContextualNormal");
    navigatorHtml = navigatorHtml.replace(/Ribbon_/gi, "Ribbon" + form.Content.getActiveItemId() + "_");

    var div = targetNavigator.ownerDocument.createElement("div");
    div.innerHTML = navigatorHtml;

    while (div.childNodes.length > 0) {
        targetNavigator.appendChild(div.childNodes[0]);
    }

    window.parent.scContent.setActiveStrip(activeStripID);
}

function scUpdateRibbonProxyValues(frame, source) {
    var form;
    try {
        form = scForm.browser.getControl(frame).contentWindow.scForm;
    } catch (ex) {
        console.log("Failed to accees frame. This typically happens due to a Permission Denied exception in IE9 caused by an intricate issue with Popup and ShowModalDialog calls. " + ex.message);
        return;
    }

    var parent = scForm.browser.getControl(source + scForm.Content.getActiveItemId());

    function replaceInputValue(tagName) {
      for (var e = scForm.browser.getEnumerator(parent.getElementsByTagName(tagName)) ; !e.atEnd() ; e.moveNext()) {
            var ctl = e.item();

            var c = form.browser.getControl(ctl.id);
            if (c != null) {
                c.value = ctl.value;
            }
        }
    }

    replaceInputValue("INPUT");
    replaceInputValue("TEXTAREA");
    replaceInputValue("SELECT");
}

function scContentEditorUpdated() {
    scForm.disableRequests = false;

    var body = $(document.body);
    var editor = $("ContentEditor");
    if (editor) {
        body.fire("sc:contenteditorupdated");

        // obsolete. should only fire on body instead(above).
        editor.fire("sc:contenteditorupdated");
    }

    if (typeof (scGeckoRelayout) != "undefined") {
        scForm.browser.initializeFixsizeElements(true);
        scGeckoRelayout();
    }
}

function MultipleTextSource(sources) {
    this.sources = sources;

    this.get_text = function () {
        var texts = [];

        for (var i = 0; i < this.sources.length; i++) {
            texts[texts.length] = this.sources[i].get_text();
        }

        return texts.join("<controlSeparator><br/></controlSeparator>");
    }

    this.set_text = function (text) {
        var texts = text.split("<controlSeparator><br/></controlSeparator>");

        for (var i = 0; i < this.sources.length; i++) {
            this.sources[i].set_text(texts[i]);
        }
    }
}

function StartSpellCheck(elements, language) {
    var radSpell = $find("RadSpell");

    var sources = new Array();

    var parts = elements.split('|');
    for (var n = 0; n < parts.length; n++) {
        var element = scForm.browser.getControl(parts[n]);

        if (element == null) {
            continue;
        }

        // accessing the frame might cause a permission denied exception in IE9
        var elementTestSource = new Telerik.Web.UI.Spell.HtmlElementTextSource(element);
        if (element.contentWindow && element.contentWindow.scSetText) {
            elementTestSource.frameObject = element;
            elementTestSource.set_text = function (value) {
                this.frameObject.contentWindow.scSetText(value);
            }

            if (element.contentWindow.scGetText) {
                elementTestSource.get_text = function () {
                    return this.frameObject.contentWindow.scGetText();
                }
            }
        }

        sources.push(elementTestSource);
    }

    radSpell.set_textSource(new MultipleTextSource(sources));

    radSpell.set_dictionaryLanguage(language);

    radSpell.startSpellCheck();

    return false;
}

scContentEditor.prototype.fieldResizeDown = function (tag, evt) {
    if (!this.dragging) {
        this.dragging = true;

        scForm.browser.setCapture(tag);

        this.resizeFieldY = evt.screenY;
        this.resizeFieldHeight = $(tag).previous().getHeight();

        scForm.browser.clearEvent(evt, true, false);
    }
}

scContentEditor.prototype.fieldResizeMove = function (tag, evt) {
    if (this.dragging) {
        var dy = evt.screenY - this.resizeFieldY;
        var h = this.resizeFieldHeight + dy;

        if (h > 35 && h < 800) {
            $(tag).previous().style.height = h + "px";
            $(tag).previous().down().style.height = h + "px";
        }

        scForm.browser.clearEvent(evt, true, false);
    }
}

scContentEditor.prototype.fieldResizeUp = function (tag, evt, id) {
    if (this.dragging) {
        this.dragging = false;

        var dy = evt.screenY - this.resizeFieldY;
        var h = this.resizeFieldHeight + dy;

        if (h < 35) {
            h = 35;
        }
        else if (h > 800) {
            h = 800;
        }

        scForm.browser.clearEvent(evt, true, false);

        scForm.browser.releaseCapture(tag);

        scForm.postRequest("", "", "", "SaveFieldSize(\"" + id + "\", \"" + h + "\")", null, true);
    }
}

scContentEditor.prototype.editRichText = function (url, key, html) {
    var w = $('overlayWindow');
    this.state = scForm.state.pipeline;
    // Rich text editor is launched from content editor.
    if (w) {
        w.show();
        w.contentWindow.scLoad(url, key, html);
    }
    else {
        w = $('feRTEContainer');
        // Rich text editor is launched from field editor.

        if (w) {
            //w.show();
            if (this.loadHandler) { this.loadHandler.stop(); }
            this.loadHandler = w.on("load", function () {
                w.show();
                if (w.contentWindow.scLoad) {
                    w.contentWindow.scLoad(key, html);
                }
            });

            w.src = url;
            return;
        }

        console.error("Cannot find RTE frame object");
    }
}

scContentEditor.prototype.saveRichText = function (html) {
    scForm.postResult(html, this.state);
}

scContentEditor.prototype.onToggleSection = [];
scContentEditor.prototype.subscribeToToggleSectionEvent = function (delegate) {
    if (!delegate) {
        return;
    }

    if (!scContentEditor.prototype.onToggleSection) {
        scContentEditor.prototype.onToggleSection = [];
    }

    scContentEditor.prototype.onToggleSection[scContentEditor.prototype.onToggleSection.length] = delegate;
}

scContentEditor.prototype.fixSearchPanelLayout = function () {
  if (!window.Flexie) return;
  var height = Element.getHeight("SearchPanel");
  $('SearchResultHolder').style.marginTop = height + 'px';
  $('ContentTreeHolder').style.marginTop = height + 'px';

  height = Element.getHeight('SearchHeader');
  $('SearchResult').style.marginTop = height + 'px';
};

scContentEditor.prototype.getActiveItemUri = function () {
  return this.getItemUri("__CurrentItem");
}

scContentEditor.prototype.getActiveItemId = function () {
  return this.getActiveItemUri().id;
}

scContentEditor.prototype.getPrimaryItemUri = function () {
  return this.getItemUri("__PrimaryItem");
}

scContentEditor.prototype.getPrimaryItemId = function () {
  return this.getPrimaryItemUri().id;
}

scContentEditor.prototype.getItemUri = function (fieldName) {
  var element = document.getElementById(fieldName);
  if (!element) {
    return {};
  }

  var matchResult = element.value.match(/sitecore:\/\/(.*)\/({.*})\?lang=(.*)&ver=(.*)/);
  var itemUri = {
    database: matchResult[1],
    id: matchResult[2].replace(/[{,},-]/g, ''),
    language: matchResult[3],
    version: matchResult[4]
  }

  return itemUri;
}

scContentEditor.prototype.extractItemId = function (value) {
  var matchResult = value && value.match(/[A-F0-9]{32}$/);
  return matchResult && matchResult[0];
}

// scDraggable extends Draggable class from Scriptaculous to fix a couple of methods according to our needs.
// Changes compared to original Scriptaculous 1.9 code are marked in the code by comments.
var scDraggable;

Event.observe(document, "dom:loaded", function () {
    if (typeof (Draggable) == "undefined") {
        if (console) {
            console.info("Scriptaculous Draggable not loaded, skipping content tree drag&drop initialization");
            return;
        }
    }

    scDraggable = Class.create(Draggable, {
        startDrag: function ($super, event) {
            this.dragging = true;
            if (!this.delta)
                this.delta = this.currentDelta();

            if (this.options.zindex) {
                this.originalZ = parseInt(Element.getStyle(this.element, 'z-index') || 0);
                this.element.style.zIndex = this.options.zindex;
            }

            if (this.options.ghosting) {
                this._clone = this.element.cloneNode(true);
                this._originallyAbsolute = (this.element.getStyle('position') == 'absolute');
                if (!this._originallyAbsolute)
                    Position.absolutize(this.element);

                //Added this line to original method taken from Scriptaculous 1.9
                this.delta = this.currentDelta();

                this.element.parentNode.insertBefore(this._clone, this.element);
            }

            if (this.options.scroll) {
                if (this.options.scroll == window) {
                    var where = this._getWindowScroll(this.options.scroll);
                    this.originalScrollLeft = where.left;
                    this.originalScrollTop = where.top;
                } else {
                    this.originalScrollLeft = this.options.scroll.scrollLeft;
                    this.originalScrollTop = this.options.scroll.scrollTop;
                }
            }

            Draggables.notify('onStart', this, event);

            if (this.options.starteffect) this.options.starteffect(this.element);
        },

        initDrag: function (event) {
            if (!Object.isUndefined(Draggable._dragging[this.element]) &&
            Draggable._dragging[this.element]) return;
            if (Event.isLeftClick(event)) {
                // abort on form elements, fixes a Firefox issue
                var src = Event.element(event);
                if ((tag_name = src.tagName.toUpperCase()) && (
                tag_name == 'INPUT' ||
                tag_name == 'SELECT' ||
                tag_name == 'OPTION' ||
                tag_name == 'BUTTON' ||
                tag_name == 'TEXTAREA')) return;

                //CHANGE - scroll offset
                var scrollOffset = this.getScrollOffset();

                var pointer = [Event.pointerX(event) - scrollOffset[0], Event.pointerY(event) - scrollOffset[1]];
                var pos = this.element.cumulativeOffset();
                this.offset = [0, 1].map(function (i) { return (pointer[i] - pos[i]) });

                Draggables.activate(this);
                Event.stop(event);
            }
        },

        updateDrag: function (event, pointer) {
            scContent.dragDropManager.removeDragHoverSelection();

            if (!this.dragging) this.startDrag(event);

            if (!this.options.quiet) {
                Position.prepare();

                //CHANGE - scroll offset
                var scrollOffset = this.getScrollOffset();
                var pointer1 = [pointer[0] + scrollOffset[0], pointer[1] + scrollOffset[1]];

                Droppables.show(pointer1, this.element);
            }

            Draggables.notify('onDrag', this, event);

            this.draw(pointer);
            if (this.options.change) this.options.change(this);

            if (this.options.scroll) {
                this.stopScrolling();

                var p;
                if (this.options.scroll == window) {
                    with (this._getWindowScroll(this.options.scroll)) { p = [left, top, left + width, top + height]; }
                } else {
                    p = Position.page(this.options.scroll).toArray();
                    p[0] += this.options.scroll.scrollLeft + Position.deltaX;
                    p[1] += this.options.scroll.scrollTop + Position.deltaY;
                    p.push(p[0] + this.options.scroll.offsetWidth);
                    p.push(p[1] + this.options.scroll.offsetHeight);
                }
                var speed = [0, 0];
                if (pointer[0] < (p[0] + this.options.scrollSensitivity)) speed[0] = pointer[0] - (p[0] + this.options.scrollSensitivity);
                if (pointer[1] < (p[1] + this.options.scrollSensitivity)) speed[1] = pointer[1] - (p[1] + this.options.scrollSensitivity);
                if (pointer[0] > (p[2] - this.options.scrollSensitivity)) speed[0] = pointer[0] - (p[2] - this.options.scrollSensitivity);
                if (pointer[1] > (p[3] - this.options.scrollSensitivity)) speed[1] = pointer[1] - (p[3] - this.options.scrollSensitivity);
                this.startScrolling(speed);
            }

            // fix AppleWebKit rendering
            if (Prototype.Browser.WebKit) window.scrollBy(0, 0);

            Event.stop(event);
        },

        finishDrag: function ($super, event, success) {
            this.dragging = false;

            if (this.options.quiet) {
                Position.prepare();
                var pointer = [Event.pointerX(event), Event.pointerY(event)];
                Droppables.show(pointer, this.element);
            }

            if (this.options.ghosting) {
                //CHANGE - Commented this line in original scriptaculous 1.9
                //if (!this._originallyAbsolute)
                //Position.relativize(this.element);

                delete this._originallyAbsolute;
                Element.remove(this._clone);
                this._clone = null;
            }

            var dropped = false;
            if (success) {
                //CHANGE - scroll offset
                var scrollOffset = this.getScrollOffset();
                var x = scrollOffset[0], y = scrollOffset[1];
                var eventClone = Object.clone(event);
                eventClone.clientX += x;
                eventClone.pageX += x;
                eventClone.clientY += y;
                eventClone.pageY += y;
        eventClone.stopPropagation = function () { };
        eventClone.preventDefault = function () { };

                dropped = Droppables.fire(eventClone, this.element);
                if (!dropped) dropped = false;
            }
            if (dropped && this.options.onDropped) this.options.onDropped(this.element);
            Draggables.notify('onEnd', this, event, dropped);

            var revert = this.options.revert;
            if (revert && Object.isFunction(revert)) revert = revert(this.element);

            var d = this.currentDelta();
            d[1] = d[1] - this.options.scrollContainer.scrollTop;
            d[0] = d[0] - this.options.scrollContainer.scrollLeft;

            if (revert && this.options.reverteffect) {
                if (dropped == 0 || revert != 'failure')
                    this.options.reverteffect(this.element, d[1] - this.delta[1], d[0] - this.delta[0]);
            } else {
                this.delta = d;
            }

            if (this.options.zindex)
                this.element.style.zIndex = this.originalZ;

            if (this.options.endeffect)
                this.options.endeffect(this.element);

            Draggables.deactivate(this);
            Droppables.reset();
        },

        //CHANGE - scroll offset
        getScrollOffset: function () {
            var x = 0, y = 0;
            if (this.options.scrollContainer) {
                y = this.options.scrollContainer.scrollTop;
                x = this.options.scrollContainer.scrollLeft;
            }

            return [x, y];
        }
    });
});

var scContentEditorDragDrop = Class.create({
  initialize: function () {
//        if (Prototype.Browser.IE) {
//            return;
//        }

        this.activeDraggable = null;

        Event.observe(window, "load", function () {
            if (!scDraggable) {
                console.warn("scDraggable not defined. Skipping drag&drop initialization.");
                return;
            }

            var root = $("ContentTreeInnerPanel");

            if (!root) {
                if (console) {
                    console.info("#ContentTreeInnerPanel not found, drag&drop not initialized");
                }
            }

            this.initializeTreeNodes(root);

            var container = $("ContentTreeActualSize");
            if (container) {
              container.observe("mouseleave", function() {
                this.showMarker(null, "hide");
              }.bind(this));
            }

            document.observe("sc:contenttreeupdated", function (e) {
                var node = e.memo;

                this.initializeTreeNodes(node);
            }.bindAsEventListener(this));
        }.bind(this));
    },

    initializeTreeNodes: function (root) {
        if (!root) {
            return;
        }

        var elements = root.select(".scContentTreeNodeNormal, .scContentTreeNodeActive");
        var ids = elements.pluck("id").findAll(function (id) { return id && id != ""; });
      
        var hoverHandler = this.onNodeHover.bind(this);
        var dropHandler = this.onNodeDrop.bind(this);

        var scrollContainer = $$('#ContentTreeInnerPanel')[0];

        ids.select(function(id) { return !!id; }).each(function (id) {
            new scDraggable(id, {
                ghosting: true,
                revert: true,
                scrollContainer: scrollContainer,
                starteffect: function (element) {
                    element._opacity = Element.getOpacity(element);
                    Draggable._dragging[element] = true;
                    new Effect.Opacity(element, { duration: 0.2, from: element._opacity, to: 0.2 });
                },
                reverteffect: function (element, top_offset, left_offset) {
                    var dur = Math.sqrt(Math.abs(top_offset ^ 2) + Math.abs(left_offset ^ 2)) * 0.02;
                    new Effect.Move(element, {
                        x: -left_offset, y: -top_offset, duration: dur,
                        queue: { scope: '_draggable', position: 'end' },
                        afterFinish: function () { element.relativize(); element.setStyle({ position: 'relative' }); }
                    });
                },
                onEnd: function (draggable, event, success) {
                    if (success) {
                        if (window.console) {
                            console.info("setting 'scBeenDragged'");
                        }
                        draggable.element.addClassName("scBeenDragged");
                    }

                    scContent.dragDropManager.removeDragHoverSelection();
                }
            });

            Droppables.add(id, {
                overlap: 'vertical',
                onHover: hoverHandler,
                onDrop: dropHandler
            });

        });
    },

    getMarker: function () {
        var result = $("ContentTreeDragMarker");

        if (!result) {
            result = new Element("div", { id: "ContentTreeDragMarker", "class": "scContentDragMarker" });
            $("ContentTreeInnerPanel").insert(result);
        }

        return result;
    },

    onNodeDrop: function (dragged, target, event) {
      
        var action = this.lastAction;
        if (!action) {
            return false;
        }

        var sourceid = dragged.id.gsub("Tree_Node_", "");
        var targetid = target.id.gsub("Tree_Node_", "");
        var message = sourceid + "|" + action + "|" + targetid;

        this.showMarker(target, "hide");

        // without timeout the sorting marker gets stuck sometimes
        setTimeout(function () {
            scForm.postEvent(target, event, "DropAndSort(\"" + message + "\")");
        }, 1);

        return true;
    },

    onNodeHover: function (draggable, droppable, overlap) {
        if (this.activeDroppable) {
            this.activeDroppable.setStyle({ backgroundColor: 'white' });
        }

        this.activeDroppable = droppable;

        if (overlap == 1) {
            droppable.removeClassName("scDragHover");
            this.showMarker(droppable, "hide");
            return;
        }

        if (overlap > 0.75) {
            droppable.removeClassName("scDragHover");
            this.showMarker(droppable, "before");
            this.lastAction = "before";
            return;
        }

        if (overlap > 0.25) {
            droppable.addClassName("scDragHover");
            this.showMarker(droppable, "hide");
            this.lastAction = "into";

            return;
        }

        droppable.removeClassName("scDragHover");
        this.showMarker(droppable, "after");
        this.lastAction = "after";
    },

    removeDragHoverSelection: function () {
      var root = $("ContentTreeInnerPanel");
      if (root) {
        var dragHoverElements = root.select(".scDragHover");
        if (dragHoverElements) {
          dragHoverElements.invoke("removeClassName", "scDragHover");
        }
      }
    },

    showMarker: function (target, position) {
        var marker = this.getMarker();

        if (position == "hide") {
            marker.hide();
            this.lastAction = null;
            return;
        }
        else {
            marker.show();
        }

        var offsetParent = target.getOffsetParent();
        var eOffset = target.viewportOffset(),
        pOffset = offsetParent.viewportOffset();

        var offset = eOffset.relativeTo(pOffset);
        offset.left = offset.left + offsetParent.scrollLeft;
        offset.top = offset.top + offsetParent.scrollTop;

        var layout = target.getLayout();

        if (position == "before") {
            marker.setStyle({ "top": offset.top + "px", "left": offset.left + "px", width: layout.get("width") + 6 + "px" });
        }
        else if (position == "after") {
            marker.setStyle({ "top": offset.top + layout.get("height") + 4 + "px", "left": offset.left + "px", width: layout.get("width") + 4 + "px" });
        }
    }
});

/* Overlay */

function scOverlayWindow() {
    this.overlayContainer = null;
    this.overlayWindowContainer = null;
    this.overlayWindow = null;
    this.overlayFrame = null;
    this.scrollHandler = this.onWindowScroll.bind(this);
    this.borderRadius = "8px"
}

scOverlayWindow.prototype = {
    ensureControlsCreated: function () {
        if (this.overlayContainer) {
            return;
        }

        this.create(window.top.document);
    },

    create: function (doc) {
        this.createContainer(doc);
        this.createWindow();
        this.createCloseButton();
        this.createFrame();
    },

    createContainer: function (doc) {
        var container = doc.createElement("div");
        container.className = "scOverlayContainer";
        container.style.display = "none";
        var isQuirksMode = this.isQuirksMode(doc);
        container.style.position = isQuirksMode ? "absolute" : "fixed";
        container.style.top = "0";
        container.style.left = "0";
        if (isQuirksMode) {
            var scrollPos = this.getScrollPosition(doc);
            container.style.top = scrollPos.top + "px";
            container.style.left = scrollPos.left + "px";
        }

        container.style.height = "100%";
        container.style.width = "100%";
        container.style.zIndex = "9999";
        container.style.background = "transparent url('/sitecore/shell/Themes/Standard/Images/bg_overlay.png') repeat";
        container.style.overflow = "hidden";
        this.overlayContainer = doc.body.appendChild(container);
    },

    createCloseButton: function () {
        var doc = this.getDocument();
        var img = doc.createElement("img");
        img.src = "/sitecore/shell/~/icon/Core3/24x24/stop_d.png";
        img.style.position = "absolute";
        img.style.right = "-12px";
        img.style.top = "-12px";
        img.style.cursor = "pointer";
        img.title = "Close";
        this.overlayWindow.appendChild(img);
        img.onmouseover = img.onmouseenter = function () {
            img.src = "/sitecore/shell/~/icon/Core3/24x24/stop.png";
        }

        img.onmouseout = img.onmouseleave = function () {
            img.src = "/sitecore/shell/~/icon/Core3/24x24/stop_d.png";
        }

        img.onclick = function () {
            this.hide();
            return false;
        }.bind(this);
    },

    createFrame: function () {
        var doc = this.getDocument();
        var iframe = doc.createElement("iframe");
        iframe.className = "scOverlayFrame";
        iframe.frameBorder = 0;
        iframe.allowTransparency = true;
        iframe.src = "about:blank";
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.borderRadius = this.borderRadius;
        this.overlayFrame = this.overlayWindow.appendChild(iframe);
    },

    createWindow: function () {
        var doc = this.getDocument();
        var windowContainer = doc.createElement("div");
        windowContainer.className = "scOverlayWindowContainer";
        windowContainer.style.position = "absolute";
        windowContainer.style.top = "50%";
        windowContainer.style.left = "50%";
        this.overlayWindowContainer = this.overlayContainer.appendChild(windowContainer);
        var overlayWindow = doc.createElement("div");
        overlayWindow.className = "scOverlayWindow";
        overlayWindow.style.position = "absolute";
        overlayWindow.style.top = "-50%";
        overlayWindow.style.left = "-50%";
        overlayWindow.style.backgroundColor = "white";
        overlayWindow.style.opacity = "1";
        overlayWindow.style.zIndex = "9999";
        overlayWindow.style.width = "100%";
        overlayWindow.style.height = "100%";
        overlayWindow.style.borderRadius = this.borderRadius;
        overlayWindow.style.boxShadow = "0px 0px 4px 2px rgba(160, 160, 160, 0.75)";
        this.overlayWindow = this.overlayWindowContainer.appendChild(overlayWindow);
    },

    getDocument: function () {
        return this.overlayContainer ? this.overlayContainer.ownerDocument : window.top.document;
    },

    getScrollPosition: function (doc) {
        var scrollTop = doc.documentElement.scrollTop;
        var scrollLeft = doc.documentElement.scrollLeft;
        return { top: parseInt(scrollTop || "0"), left: parseInt(scrollLeft || "0") };
    },

    isQuirksMode: function (doc) {
        return doc.compatMode && doc.compatMode == "BackCompat";
    },

    show: function (url, height, width) {
        if (!url) {
            return;
        }

        this.ensureControlsCreated();
        this.overlayWindowContainer.style.height = height || "75%";
        this.overlayWindowContainer.style.width = width || "75%";
        this.overlayContainer.style.display = "";
        this.overlayFrame.src = url;
        if (this.isQuirksMode(window.top.document)) {
            scForm.browser.attachEvent(window.top, "onscroll", this.scrollHandler);
        }
    },

    hide: function () {
        this.overlayFrame.src = "about:blank";
        this.overlayContainer.style.display = "none";
        if (this.isQuirksMode(window.top.document)) {
            scForm.browser.detachEvent(window.top, "onscroll", this.scrollHandler);
        }
    },

    onWindowScroll: function (e) {
        var doc = this.getDocument();
        var scrollPos = this.getScrollPosition(doc)
        this.overlayContainer.style.top = scrollPos.top + "px";
        this.overlayContainer.style.left = scrollPos.left + "px";
    }
};

/* Overlay end */

var scContent = new scContentEditor();
scContent.dragDropManager = new scContentEditorDragDrop();
scContent.overlay = new scOverlayWindow();