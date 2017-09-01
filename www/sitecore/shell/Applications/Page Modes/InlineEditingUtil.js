if (typeof (Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

Sitecore.PageModes.InlineEditingUtil = new function () {
  this.processNewLineBreaks = function (editableElement) {
    if (typeof document.getSelection != 'function') {
      return;
    }

    editableElement.addEventListener('keydown', this.onKeyDown);
    editableElement.addEventListener('keypress', this.onKeyPress);
  };

  this.onKeyPress = function (e) {
    if (!Sitecore.PageModes.InlineEditingUtil.checkContentEditable(e.target)) {
      return false;
    }

    if ((e.returnValue || Sitecore.PageModes.InlineEditingUtil.isPrintableKey(e))) {
      if (Sitecore.PageModes.InlineEditingUtil.checkEmptyEditableElement(e.target)) {
        return;
      }
    }

    if (e.keyCode === 13) {
      var lineBreakTag = Sitecore.WebEditSettings.newLineBreak;
      if (lineBreakTag != "p" && lineBreakTag != "div" && lineBreakTag != "br") {
        return;
      }

      e.preventDefault();

      var selection = document.getSelection();
      var range = selection.getRangeAt(0);

      if (lineBreakTag == "br") {
        Sitecore.PageModes.InlineEditingUtil.insertBrLineBreak(selection, range);
        selection.removeAllRanges();
        selection.addRange(range);

        return;
      }

      var focusNode = selection.focusNode.parentNode;
      var contentEditable = focusNode.getAttribute("contenteditable");
      if (contentEditable) {
        focusNode = selection.focusNode;
      }

      var length = selection.focusNode.length;
      var startOrMiddlePosition = selection.focusOffset < length;
      var isParagraph = Sitecore.PageModes.InlineEditingUtil.isParagraph(focusNode);
      if (startOrMiddlePosition || !isParagraph) {
        Sitecore.PageModes.InlineEditingUtil.insertBrLineBreak(selection, range);
        selection.removeAllRanges();
        selection.addRange(range);

        return;
      }

      var focusNode = Sitecore.PageModes.InlineEditingUtil.resolveFocusNode(selection);

      var node = document.createElement(lineBreakTag);
      Sitecore.PageModes.InlineEditingUtil.applyAttributes(focusNode, node);

      range.setStartAfter(focusNode);
      range.insertNode(node);
      var placeholder = document.createElement("br");;
      node.appendChild(placeholder);
      range.collapse(true);
      range.selectNodeContents(node);

      selection.removeAllRanges();
      selection.addRange(range);

      return;
    }
  };

  this.resolveFocusNode = function (selection) {
    var focusNode = selection.focusNode;

    var goToParent = true;
    while (goToParent) {
      var isParagraph = Sitecore.PageModes.InlineEditingUtil.isParagraph(focusNode);
      if (isParagraph) {
        goToParent = false;
      }
      else {
        focusNode = focusNode.parentNode;
      }
    }

    return focusNode;
  };

  this.isParagraph = function (node) {
    var isNotParagraph = false;
    if (node.nodeName) {
      var nodeName = node.nodeName.toLowerCase();
      if (nodeName == "p" || nodeName == "div") {
        return true;
      }
    }

    return false;
  };

  this.onKeyDown = function (e) {
    if (e.keyCode === 8) {
      var selection = document.getSelection();
      var focusNode = selection.focusNode;
      if (!focusNode) {
        return;
      }

      if (typeof focusNode.getAttribute == 'function') {
        if (Sitecore.PageModes.InlineEditingUtil.checkContentEditable(focusNode)) {
          return;
        }
      }

      if (focusNode.nodeName) {
        var focusNodeName = focusNode.nodeName.toLowerCase();
        if (focusNodeName == "p" || focusNodeName == "div") {
          return;
        }
      }

      var parentNode = focusNode.parentNode;
      if (parentNode.textContent == "" && selection.focusOffset == 0) {
        var range = document.createRange();
        range.selectNode(parentNode);

        selection.removeAllRanges();
        selection.addRange(range);
        return false;
      }
    }
  };

  this.applyAttributes = function (focusNode, newTag) {
    if (!focusNode.tagName) {
      return;
    }

    if (focusNode.tagName.toLowerCase() != newTag.tagName.toLowerCase()) {
      return;
    }

    var attributes = focusNode.attributes;
    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      newTag.setAttribute(attribute.name, attribute.value);
    }
  };

  this.insertBrLineBreak = function (selection, range) {
    var brNode = document.createElement("br");
    range.insertNode(brNode);
    range.setStartAfter(brNode);
    range.collapse(true);
  };

  this.checkEmptyEditableElement = function (target) {
    if (!target) {
      return false;
    }

    if (target.textContent != "") {
      return false;
    }

    Sitecore.PageModes.InlineEditingUtil.clearNonPrintableTags(target);

    var newLineNode = Sitecore.WebEditSettings.newLineBreak;
    if (newLineNode.toLowerCase() == "p" || newLineNode.toLowerCase() == "div") {
      var selection = document.getSelection();
      var range = selection.getRangeAt(0);

      if (!Sitecore.PageModes.InlineEditingUtil.checkContentEditable(selection.focusNode)) {
        return true;
      }

      var node = document.createElement(newLineNode);
      range.insertNode(node);
      range.collapse(true);
      node.innerHTML = "<br />";
      range.selectNodeContents(node);

      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }
  };

  this.clearNonPrintableTags = function (focusNode) {
    if (!focusNode) {
      return;
    }

    var brNodes = [];
    for (var n = 0; n < focusNode.childNodes.length; n++) {
      var child = focusNode.childNodes[n];
      if (!child) {
        continue;
      }

      if (!child.nodeName) {
        continue;
      }

      if (child.nodeName.toLowerCase() != "br") {
        continue;
      }

      brNodes.push(child);
    }

    for (var n = 0; n < brNodes.length; n++) {
      focusNode.removeChild(brNodes[n]);
    }
  };

  this.isPrintableKey = function (keyPressEventArgs) {
    if (typeof keyPressEventArgs.which == "undefined") {
      return true;
    } else if (typeof keyPressEventArgs.which == "number" && keyPressEventArgs.which > 0) {
      return !keyPressEventArgs.ctrlKey && !keyPressEventArgs.metaKey && !keyPressEventArgs.altKey && keyPressEventArgs.which != 8;
    }

    return false;
  };

  this.checkContentEditable = function (target) {
    if (typeof target.getAttribute != "function") {
      return false;
    }

    var attribute = target.getAttribute("contenteditable");
    if (!attribute) {
      return false;
    }

    return attribute === "true";
  };
};