Sitecore.PageModes.ChromeTypes.Field = Sitecore.PageModes.ChromeTypes.ChromeType.extend({
  constructor: function () {
    this.base();
    //Key codes which aren't tracked as ones that modify contenteditable fields
    this._ignoreKeyCodes = [16, 17, 18, 27, 35, 36, 37, 38, 39, 40];
  },

  load: function () {
    var persistedValue = Sitecore.PageModes.ChromeManager.getFieldValueContainerById(this.controlId());
    var fieldValueInput = this.chrome.element.prev().prev(".scFieldValue");
    if (fieldValueInput.length == 0) {
      fieldValueInput = null;
    }

    if (persistedValue) {
      this.fieldValue = $sc(persistedValue);
      if (fieldValueInput) {
        fieldValueInput.remove();
      }
    }
    else {
      if (fieldValueInput) {
        this.fieldValue = fieldValueInput;
        Sitecore.PageModes.ChromeManager.addFieldValue(this.fieldValue);
      }
      else {
        this.fieldValue = $sc({});
      }
    }

    var modifiedControlId = this.fieldValue.data("modified");
    if (modifiedControlId && modifiedControlId !== this.controlId()) {
      this.setReadOnly();
      var notification = new Sitecore.PageModes.Notification("fieldchanges", Sitecore.PageModes.Texts.ContentWasEdited,
      {
        actionText: Sitecore.PageModes.Texts.SaveThePageToSeeTheChanges,
        onActionClick: $sc.proxy(Sitecore.PageModes.PageEditor.save, Sitecore.PageModes.PageEditor),
        type: "warning"
      });

      Sitecore.PageModes.PageEditor.notificationBar.addNotification(notification);
      Sitecore.PageModes.PageEditor.showNotificationBar();
    }

    this.initialAttributes = new Object();
    if (this.chrome.element.attr("sc_parameters")) {
      this.parameters = $sc.parseQuery(this.chrome.element.attr("sc_parameters"));
    }
    else {
      this.parameters = new Object();
    }

    this.parentLink = this.chrome.element.closest("a").get(0);
    this.fieldType = this.chrome.element.attr("scfieldtype");
    this.onMouseDownHandler = $sc.proxy(this.onMouseDown, this);
    this.chrome.element.mousedown(this.onMouseDownHandler);

    if (this.contentEditable()) {
      if (this.chrome.element.attr("scWatermark") == "true") {
        this.watermarkHTML = this.chrome.element.html();
      }

      this.onKeyDownHandler = $sc.proxy(this.onKeyDown, this);
      this.onKeyUpHandler = $sc.proxy(this.onKeyUp, this);
      this.onCutPasteHandler = $sc.proxy(this.onCutPaste, this);
      this.onClickHandler = $sc.proxy(this.onClick, this);
      this.onBlurHandler = $sc.proxy(this.onBlur, this);
      this.capabilityChangedHandler = $sc.proxy(this.setContentEditableState, this);
      Sitecore.PageModes.PageEditor.onCapabilityChanged.observe(this.capabilityChangedHandler);
      this.saveHandler = $sc.proxy(this.onSave, this);
      Sitecore.PageModes.PageEditor.onSave.observe(this.saveHandler);
      this.setContentEditableState();
      // IE doesn't return calculated values for current style.
      if ($sc.util().isIE) {
        var dummy = $sc("<div style='height:0px;width:1em;position:absolute'></div>");
        this.chrome.element.parent().append(dummy);
        this.fontSize = dummy.get(0).offsetWidth;
        dummy.remove();
      }
      else {
        this.fontSize = parseInt(this.chrome.element.css("font-size"));
      }
    }

    if (Sitecore.PageModes.Personalization) {
      Sitecore.PageModes.ChromeControls.registerCommandRenderer(
        "chrome:rendering:personalize",
        Sitecore.PageModes.ChromeTypes.Field.renderPersonalizationCommand,
        this);
    }

    if (Sitecore.PageModes.Testing) {
      Sitecore.PageModes.ChromeControls.registerCommandRenderer(
        "chrome:rendering:editvariations",
        Sitecore.PageModes.ChromeTypes.Field.renderEditVariationsCommand,
        this);
    }

    this.chrome.fieldIdentifier = this.id();

    // attach new line breaks handler.
    if (this.fieldType == "rich text") {
      if (!this.preventLineBreak()) {
        Sitecore.PageModes.InlineEditingUtil.processNewLineBreaks(this.chrome.element[0]);
      }
    }
  },

  // attaches content editable elements specific event handlers
  attachEventHandlers: function () {
    this.chrome.element.bind("keyup", this.onKeyUpHandler);
    this.chrome.element.bind("paste", this.onCutPasteHandler);
    this.chrome.element.bind("cut", this.onCutPasteHandler);
    this.chrome.element.bind("click", this.onClickHandler);
    this.chrome.element.bind("blur", this.onBlurHandler);

    if (this.fieldType != "rich text" || this.preventLineBreak()) {
      this.chrome.element.bind("keydown", this.onKeyDownHandler);
    }
  },

  preventLineBreak: function () {
    return this.parameters["prevent-line-break"] === "true";
  },

  contentEditable: function () {
    var attrValue = this.chrome.element.attr(Sitecore.PageModes.ChromeTypes.Field.contentEditableAttrName);
    return attrValue === "true" || attrValue === "false";
  },

  // detaches content editable elements specific event handlers
  detachEventHandlers: function () {
    this.chrome.element.unbind("keyup", this.onKeyUpHandler);
    this.chrome.element.unbind("paste", this.onCutPasteHandler);
    this.chrome.element.unbind("cut", this.onCutPasteHandler);
    this.chrome.element.unbind("click", this.onClickHandler);
    this.chrome.element.unbind("blur", this.onBlurHandler);

    if (this.fieldType != "rich text" || this.preventLineBreak()) {
      this.chrome.element.unbind("keydown", this.onKeyDownHandler);
    }
  },

  dataNode: function (domElement) {
    return domElement.prev(".scChromeData");
  },

  handleMessage: function (message, params) {
    switch (message) {
      case "chrome:field:insertimage":
        this.insertImage();
        break;
      case "chrome:field:imageinserted":
        this.imageInserted(params.html);
        break;
      case "chrome:field:insertlink":
        this.insertLink();
        break;
      case "chrome:field:linkinserted":
        this.linkInserted(params.url);
        break;
      case "chrome:field:editcontrol":
        var chars = this.characteristics();
        this.editControl(chars.itemId, chars.language, chars.version, chars.fieldId, this.controlId(), params.command);
        break;
      case "chrome:field:editcontrolcompleted":
        this.editControlCompleted(params.value, params.plainValue, params.preserveInnerContent);
        break;
      case "chrome:field:execute":
        this.execute(params.command, params.userInterface, params.value);
        break;
      case "chrome:personalization:conditionchange": case "chrome:rendering:personalize": case "chrome:rendering:editvariations": case "chrome:testing:variationchange":
        this.delegateMessageHandling(this.chrome, this.parentRendering(), message, params);
        break;
      case "chrome:rendering:personalizationcompleted": case "chrome:rendering:editvariationscompleted":
        Sitecore.PageModes.ChromeManager.select(this.chrome);
        this.delegateMessageHandling(this.chrome, this.parentRendering(), message, params);
        break;
    }
  },

  isEnabled: function () {
    return $sc.inArray(Sitecore.PageModes.Capabilities.edit, Sitecore.PageModes.PageEditor.getCapabilities()) > -1 && this.base();
  },

  isFieldValueContainer: function (node) {
    return this.fieldValue && this.fieldValue.get(0) == node;
  },

  layoutRoot: function () {
    if (this.contentEditable()) {
      return this.chrome.element;
    }

    var children = this.chrome.element.children();
    if (children.length == 1) {
      return $sc(children[0]);
    }
    return this.chrome.element;
  },

  persistValue: function () {
    if (this.isWatermark()) return;

    var html = this.chrome.element.html();
    if (this._extraLineBreakAdded) {
      var clone = this.chrome.element.clone();
      clone.find(".scExtraBreak").remove();
      html = clone.html();
    }

    if (this.watermarkHTML == null) {
      this.watermarkHTML = this.chrome.element.attr("scDefaultText");
    }

    this.fieldValue.val(html);
    this.chrome.element.removeAttr("scWatermark");
  },

  refreshValue: function () {
    if (this.contentEditable()) {
      this.chrome.element.update(this.fieldValue.val());
      this._tryUpdateFromWatermark();
      this.setModified();
    }
  },

  // Sets whether content editable elements are editable (depends on the mode(Edit, Design etc.))
  setContentEditableState: function () {
    if (this.contentEditable()) {
      var isEditable = this.isEnabled() && !this.isReadOnly();
      this.chrome.element.attr(Sitecore.PageModes.ChromeTypes.Field.contentEditableAttrName, isEditable.toString());
      if (isEditable) {
        this.attachEventHandlers();
      }
      else {
        this.detachEventHandlers();
      }
    }
  },

  setReadOnly: function () {
    this.base();
    this.setContentEditableState();
  },

  /*--- Helpers section ---*/
  controlId: function () {
    return this.chrome.element.attr("id").replace("_edit", "");
  },

  convertToGuid: function (shortId) {
    return "{" + shortId.substr(0, 8) + "-" + shortId.substr(8, 4) + "-" + shortId.substr(12, 4) + "-" + shortId.substr(16, 4) + "-" + shortId.substr(20, 12) + "}";
  },

  characteristics: function () {
    //ID format:fld_ItemID_FieldID_Language_Version_Revision_edit
    var fieldCharacteristics = this.controlId().split('_');
    return {
      itemId: this.convertToGuid(fieldCharacteristics[1]),
      fieldId: this.convertToGuid(fieldCharacteristics[2]),
      language: fieldCharacteristics[3],
      version: fieldCharacteristics[4]
    };
  },

  id: function () {
    var chars = this.characteristics();
    return chars.fieldId;
  },

  insertHtmlFragment: function (html) {
    if (!this.selection) {
      return false;
    }

    if (document.selection && document.selection.createRange) { //IE
      this.selection.pasteHTML(html);
      return true;
    }

    if (window.getSelection && window.getSelection().getRangeAt) { //FF
      var node = this.selection.createContextualFragment(html);
      this.selection.insertNode(node);
      return true;
    }

    return false;
  },

  isWatermark: function () {
    return this.watermarkHTML == this.chrome.element.html();
  },

  /*--- Commands section---*/
  editControl: function (itemid, language, version, fieldid, controlid, message) {
    var control = Sitecore.PageModes.ChromeManager.getFieldValueContainerById(controlid);
    if (control == null) {
      console.error("control with id " + controlid + " not found");
      return;
    }

    var plainValue = control.value;
    control = $sc("#" + controlid + "_edit");
    var value = control.html();
    var parameters = control.attr("sc_parameters");

    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    if (ribbon != null) {
      if (!ribbon.contentWindow.scForm) {
        ribbon.contentWindow.scForm = scForm;
      }
      ribbon.contentWindow.scForm.browser.getControl("scHtmlValue").value = value;
      ribbon.contentWindow.scForm.browser.getControl("scPlainValue").value = plainValue;
      Sitecore.PageModes.PageEditor.postRequest(
          message + '(itemid=' + itemid + ',language=' + language + ',version=' + version + ',fieldid=' +
          fieldid + ',controlid=' + controlid + ',webeditparams=' + parameters + ')', null, false);
    }

    return false;
  },

  editControlCompleted: function (value, plainValue, preserveInnerContent) {
    this.fieldValue.val(typeof (plainValue) != "undefined" ? plainValue : value);
    if (!preserveInnerContent) {
      this.chrome.element.update(value);
    }
    else {
      var targetCtl = this.chrome.element.get(0).firstChild;
      var wrapper = document.createElement("span");
      wrapper.innerHTML = value;
      var sourceCtl = wrapper.firstChild;
      $sc.util().copyAttributes(sourceCtl, targetCtl);
      delete wrapper;
    }

    this.setModified();
  },

  execute: function (command, userInterface, value) {
    if ($sc.browser.mozilla) {
      document.execCommand(command, null, null);
    }
    else {
      document.execCommand(command, userInterface, value);
    }

    // OnTime issue #341414
    this.persistValue()
    this.setModified();
    return false;
  },

  hasParentLink: function () {
    return this.parentLink != null;
  },

  insertImage: function () {
    this.chrome.element.focus();
    if (document.selection && document.selection.createRange) {
      this.selection = document.selection.createRange();
    }
    else if (window.getSelection && window.getSelection().getRangeAt) {
      this.selection = window.getSelection().getRangeAt(0);
    }

    var chars = this.characteristics();
    var parameters = this.chrome.element.attr("sc_parameters");
    Sitecore.PageModes.PageEditor.postRequest(
              "webedit:insertimage" + '(placement=cursor,itemid=' + chars.itemId + ',language=' +
              chars.language + ',version=' + chars.version + ',fieldid=' + chars.fieldId +
              ',controlid=' + this.controlId() + ',webeditparams=' + parameters + ')', null, false);

    return false;
  },

  imageInserted: function (html) {
    this.chrome.element.focus();
    if (this.insertHtmlFragment(html)) {
      this.setModified();
    }
  },

  insertLink: function () {
    var selectionText;
    // MSIE
    if (document.selection && document.selection.createRange) {
      this.selection = document.selection.createRange();
      selectionText = this.selection.htmlText;
    }
    else if (window.getSelection && window.getSelection().getRangeAt) {
      this.selection = window.getSelection().getRangeAt(0);
      selectionText = !this.selection.commonAncestorContainer.innerHTML ? this.selection.toString() : this.selection.commonAncestorContainer.innerHTML;
    }

    if ($sc.trim(selectionText) == "") {
      alert(Sitecore.PageModes.Texts.SelectSomeText);
      return;
    }

    var chars = this.characteristics();
    this.editControl(chars.itemId, chars.language, chars.version, chars.fieldId, this.controlId(), "webedit:insertlink");
  },

  linkInserted: function (url) {
    var isIE = document.selection && document.selection.createRange;

    if (!this.selection) {
      return;
    }

    // TODO: add preserving link contents for FF.
    var selectionText;
    if (isIE) {
      selectionText = this.selection.htmlText;
    } else {
      selectionText = !this.selection.commonAncestorContainer.innerHTML ? this.selection.toString() : this.selection.commonAncestorContainer.innerHTML;
    }

    var data = {
      html: selectionText,
      url: url
    };

    // If link is selected, replace it with a new one, preserving link contents.
    if (isIE) {
      // OT issue#338106
      data.html = this._processHtml(data.html);
      var htmlSelection = $sc.trim(data.html.toLowerCase()) || "";
      if (htmlSelection.indexOf("<a ") == 0 && htmlSelection.indexOf("</a>") == (htmlSelection.length - "</a>".length)) {
        htmlSelection = data.html.substring(data.html.indexOf(">") + 1);
        htmlSelection = htmlSelection.substring(0, htmlSelection.length - "</a>".length);
        data.html = htmlSelection;
      }
    }

    var htmlToInsert = "<a href='" + data.url + "'>" + data.html + "</a>";
    if (isIE) {
      this.selection.pasteHTML(htmlToInsert);
    }
    else {
      var node = this.selection.createContextualFragment(htmlToInsert);
      this.selection.deleteContents();
      this.selection.insertNode(node);
    }

    this.persistValue();
    this.setModified();
  },

  key: function () {
    return "field";
  },

  parentRendering: function () {
    var excludeFake = true;
    // The designing capablity may be turned off or user may not have designing rights    
    var enabledOnly = false;
    var chrome = this.chrome.parent(excludeFake, enabledOnly);
    if (!this._parentRendering) {
      while (chrome && chrome.key() != "rendering") {
        chrome = chrome.parent(excludeFake, enabledOnly);
      }

      this._parentRendering = chrome;
    }

    return this._parentRendering;
  },

  setModified: function () {
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    Sitecore.PageModes.PageEditor.setModified(true);
    this.fieldValue.data("modified", this.controlId());
  },

  /*---Event handlers section---*/
  onBlur: function (e) {
    this.persistValue();
    this._tryUpdateFromWatermark();
  },

  onClick: function (e) {
    if (!this.active) {
      return;
    }

    if (this.isWatermark()) {
      this.chrome.element.update("");
      //Trick to make Chrome set focus on content editable element
      if ($sc.browser.webkit) {
        var range = document.createRange();
        range.selectNodeContents(this.chrome.element.get(0));
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    // Restore original values saved in MouseDown handler
    this._restoreInitialStyles();
  },

  onCutPaste: function (e) {
    if (!this.active) {
      e.preventDefault();
      return;
    }

    this.setModified();
  },

  onDelete: function () {
    if (this.saveHandler) {
      Sitecore.PageModes.PageEditor.onSave.stopObserving(this.saveHandler);
    }

    if (this.capabilityChangedHandler) {
      Sitecore.PageModes.PageEditor.onCapabilityChanged.stopObserving(this.capabilityChangedHandler);
    }
  },

  onHide: function () {
    this.active = false;
    if (this.parentLink && this.initialAttributes.linkTextDecoration != null) {
      this.parentLink.style.textDecoration = this.initialAttributes.linkTextDecoration;
    }

    this._restoreInitialStyles();
  },

  onKeyDown: function (e) {
    if (!this.active) {
      e.preventDefault();
      return;
    }

    if (e.keyCode == 13) {
      if (this.parameters["prevent-line-break"] === "true") {
        e.stop();
        return;
      }

      if (this.parameters["linebreak"] == "br") {
        e.stop();
        if (this.fieldType == "multi-line text") {
          var linebreakTimesParamterName = "linebreak-times";
          var linebreakTimesParamter = this.parameters[linebreakTimesParamterName];
          var linebreakTimes = !linebreakTimesParamter || linebreakTimesParamter > 2 ? 0 : linebreakTimesParamter;
          linebreakTimes++;
          this.parameters[linebreakTimesParamterName] = linebreakTimes;
          if (linebreakTimes > 1) {
            return;
          }
        }

        this._insertLineBreak();
      }
    }
  },

  onKeyUp: function (event) {
    if ($sc.inArray(event.keyCode, this._ignoreKeyCodes) > -1) return;
    if (this.chrome.element.attr("scfieldtype") == "rich text"
      && event.currentTarget.innerText != null && event.currentTarget.innerText.trim() == "") {
      event.currentTarget.innerHTML = "";
    }
    if (this.fieldValue.val() != event.currentTarget.innerHTML) {
      this.setModified();
      //at least one modification has been done, so we don't need to check for modifications any more
      if (this.chrome.element.attr("scfieldtype") != "rich text") {
        this.chrome.element.unbind("keyup", this.onKeyUpHanler);
      }
    }
  },

  onMouseDown: function (e) {
    if (!e.isLeftButton()) {
      return;
    }

    if (e.ctrlKey) {
      if (!this.isEnabled()) {
        return;
      }

      var href = null;
      if (this.hasParentLink()) {
        href = this.parentLink.href;
        this.parentLink.onclick = function () { return false; };
        // For IE
        this.parentLink.href = "javascript:return false";
      }

      var sender = e.target;
      if (sender.tagName.toUpperCase() == "A") {
        href = sender.href;
        sender.onclick = function () { return false; };
        // For IE
        sender.href = "javascript:return false";
      }

      if (!href || href.indexOf("javascript:") == 0) {
        return;
      }

      e.stop();
      try 
      {
        window.location.href = href;
      }
      catch (ex) {
        //silent
      }
    }
    else if (this.isEnabled() && this.contentEditable() && Sitecore.PageModes.Utility.isNoStandardsIE()) {
      // HACK FOR IE 7 issue with wrong cursor positioning in contentEditableElements
      this.initialAttributes.position = this.chrome.element.css("position");
      this.initialAttributes.zIndex = this.chrome.element.css("z-index");
      this.chrome.element.css("position", "relative");
      this.chrome.element.css("z-index", "9085");
    }
  },

  onSave: function () {
    if (!this.isReadOnly() && Sitecore.PageModes.ChromeManager.selectedChrome() == this.chrome && this.contentEditable()) {
      this.persistValue();
    }

    if (this.fieldValue) {
      this.fieldValue.removeData("modified");
    }
  },

  onShow: function () {
    this.active = true;
    if (this.parentLink) {
      this.initialAttributes.linkTextDecoration = this.parentLink.style.textDecoration;
      this.parentLink.style.textDecoration = 'none';
    }
  },

  getConditions: function () {
    var r = this.parentRendering();

    if (!r) {
      return [];
    }

    return r.type.getConditions();
  },

  getVariations: function () {
    var r = this.parentRendering();

    if (!r) {
      return [];
    }

    return r.type.getVariations();
  },

  _insertLineBreak: function () {
    var range, tmpRange, lineBreak, extraLineBreak, selection;

    // Unsupported browser
    if (!document.createRange || !window.getSelection) {
      // MSIE
      if (document.selection && document.selection.createRange) {
        this.insertHtmlFragment("<br/>");
        // Moving caret to new position
        range = document.selection.createRange();
        range.select();
        return;
      }

      return;
    }

    // W3C compatible browser
    lineBreak = document.createElement("br");
    range = window.getSelection().getRangeAt(0);
    tmpRange = document.createRange();
    tmpRange.selectNodeContents(this.chrome.element[0]);
    tmpRange.collapse(false);
    tmpRange.setStart(range.startContainer, range.startOffset);
    // Adding 2 <br/> tags in case of pressing 'enter' while cursor is in the last position.
    // This trick forces cursor to move to the new line
    if (!tmpRange.toString() && !this.chrome.element.find(".scExtraBreak").length) {
      var extraLineBreak = document.createElement("br");
      extraLineBreak.className = "scExtraBreak";
      range.insertNode(extraLineBreak);
      this._extraLineBreakAdded = true;
    }

    range.insertNode(lineBreak);
    tmpRange = document.createRange();
    tmpRange.selectNode(lineBreak);
    tmpRange.collapse(false);
    // Moving cursor
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(tmpRange);
  },

  _processHtml: function (html) {
    if (!html) {
      return html;
    }

    var tmp, fieldContainer;
    try {
      tmp = $sc("<div></div>").html(html);
      fieldContainer = tmp.children(".scWebEditInput").eq(0);
    }
    catch (e) {
      Sitecore.PageModes.Utility.log("Failed to process html: " + html);
    }

    return fieldContainer && fieldContainer.length ? fieldContainer.html() : html;
  },

  _restoreInitialStyles: function () {
    if (this.initialAttributes.position != null && this.initialAttributes.zIndex != null) {
      this.chrome.element.css("position", this.initialAttributes.position);
      this.chrome.element.css("z-index", this.initialAttributes.zIndex);
      this.initialAttributes.position = null;
      this.initialAttributes.zIndex = null;
    }
  },

  _tryUpdateFromWatermark: function () {
    if (this.watermarkHTML &&
        (this.chrome.element.html() == "" || (this.fieldType == "text" || this.fieldType == "rich text") && $sc.removeTags(this.chrome.element.html()) == "")) {
      this.chrome.element.update(this.watermarkHTML);
      this.chrome.element.attr("scWatermark", "true");
    }
  }
},
{
  contentEditableAttrName: $sc.util().isNoStandardsIE() ? "contentEditable" : "contenteditable",
  renderPersonalizationCommand: function (command, isMoreCommand, chromeControls) {
    //Avoid duplication of condition personalization controls when there are nested fields.
    if (this.chrome.isFake()) {
      return null;
    }

    var rendering = this.parentRendering();
    if (!rendering) {
      return null;
    }

    command.disabled = false;
    var showVariations = rendering.type.hasVariations();
    if (showVariations || !Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
      command.disabled = true;
      if (showVariations) {
        return false;
      }
    }

    // Personalization command should be enabled even for readonly fields
    command.enabledWhenReadonly = true;
    if (isMoreCommand) {
      return false;
    }

    var conditions = this.getConditions();
    var tag = null;
    if (conditions.length <= 1) {
      if (!Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
        return null;
      }

      tag = chromeControls.renderCommandTag(command, this.chrome, isMoreCommand);
      if (!tag) {
        return false;
      }
    }

    var retValue;
    if (!tag) {
      var context = new Sitecore.PageModes.Personalization.ControlsContext(this.chrome, chromeControls, command);
      if (!Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar) {
        Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar = new Sitecore.PageModes.RichControls.Bar(
          new Sitecore.PageModes.Personalization.Panel(),
          new Sitecore.PageModes.Personalization.DropDown());
      }

      if (!window.heightDelta) {
        window.heightDelta = 0;
      }

      window.setChromePositionFunc = function () { };
      var context = new Sitecore.PageModes.Personalization.ControlsContext(this.chrome, chromeControls, command);
      if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
        if (window.heightDelta > 0) {
          Sitecore.PageModes.ChromeTypes.Field.generateSetChromePositionFunc(window.heightDelta *= -1);
        }

        tag = Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.renderHidden(
                context,
                Sitecore.PageModes.Texts.Analytics.ChangeCondition,
                "/sitecore/shell/~/icon/Office/16x16/users3.png");
      }
      else {
        if (window.heightDelta <= 0) {
          Sitecore.PageModes.ChromeTypes.Field.generateSetChromePositionFunc(20);
        }

        tag = Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.render(context);
        chromeControls.commands.append(tag);
        retValue = false;
      }
    }

    if (tag) {
      tag.mouseenter($sc.proxy(function () {
        var r = this.parentRendering();
        if (r) {
          r.showHover();
        }
      }, this));

      tag.mouseleave($sc.proxy(function () {
        var r = this.parentRendering();
        if (r) {
          r.hideHover();
        }
      }, this));
    }

    if (typeof (retValue) == "undefined") {
      retValue = tag;
    }

    if (window.setChromePositionFunc) {
      window.setChromePositionFunc();
    }

    return retValue;
  },

  generateSetChromePositionFunc: function (delta) {
    var toolbar = $sc(".scChromeToolbar");
    window.heightDelta = delta;
    window.setChromePositionFunc = function () {
      toolbar.height(toolbar.height() + window.heightDelta);
      setTimeout(function() {
        try {
          Sitecore.PageModes.PageEditor.controlBarStateChange();
        } catch (err) {
        }
      }, 200);
    }
  },

  renderEditVariationsCommand: function (command, isMoreCommand, chromeControls) {
    if (this.chrome.isFake()) {
      return null;
    }

    var rendering = this.parentRendering();
    if (!rendering) {
      return null;
    }
    
    command.disabled = false;
    var showConditions = rendering.type.hasConditions();
    if (showConditions || Sitecore.PageModes.PageEditor.isTestRunning() || !Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      command.disabled = true;
      if (showConditions) {
        return false;
      }
    }

    var tag = null;
    var variations = this.getVariations();
    command.disabled = false;
    if (!Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      command.disabled = true;
    }

    if (variations.length <= 1) {
      if (!Sitecore.PageModes.PageEditor.isTestingAccessible()) {
        return null;
      }

      tag = chromeControls.renderCommandTag(command, this.chrome, isMoreCommand);
      if (!tag) {
        return false;
      }
    }

    // Personalization command should be enabled even for readonly fields
    command.enabledWhenReadonly = true;
    if (isMoreCommand) {
      return false;
    }

    var retValue;
    if (!tag) {
      if (!Sitecore.PageModes.ChromeTypes.Rendering.testingBar) {
        Sitecore.PageModes.ChromeTypes.Rendering.testingBar = new Sitecore.PageModes.RichControls.Bar(
          new Sitecore.PageModes.Testing.Panel("scTestingPanel"),
          new Sitecore.PageModes.Testing.DropDown()
        );
      }

      var context = new Sitecore.PageModes.Testing.ControlsContext(this.chrome, chromeControls, command);
      if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
        tag = Sitecore.PageModes.ChromeTypes.Rendering.testingBar.renderHidden(
          context,
          Sitecore.PageModes.Texts.Analytics.ChangeVariation);
      }
      else {
        tag = Sitecore.PageModes.ChromeTypes.Rendering.testingBar.render(context)
        chromeControls.commands.append(tag);
        retValue = false;
      }
    }

    if (tag) {
      tag.mouseenter($sc.proxy(function () {
        var r = this.parentRendering();
        if (r) {
          r.showHover();
        }
      }, this));

      tag.mouseleave($sc.proxy(function () {
        var r = this.parentRendering();
        if (r) {
          r.hideHover();
        }
      }, this));
    }

    if (typeof (retValue) == "undefined") {
      retValue = tag;
    }

    return retValue;
  }
});
