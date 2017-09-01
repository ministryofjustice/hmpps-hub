if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

Sitecore.PageModes.ChromeManager = new function() {
  this.overChromes = new Array();        
  this.ignoreDOMChanges = false;
  this.selectionChanged = new Sitecore.Event();
  this.chromeUpdating = new Sitecore.Event(); 
  this.chromeUpdated = new Sitecore.Event();
  this.chromesReseting = new Sitecore.Event();
  this.chromesReseted = new Sitecore.Event();
  this.positioningManager = new Sitecore.PageModes.PositioningManager();
  this._updateVariationsQueue = [];
  this.messages = [];
      
  this.init = function() {
    Sitecore.PageModes.PageEditor.onCapabilityChanged.observe($sc.proxy(this.onCapabilityChanged, this));
    $sc.each(this.chromes(), function(){ this.load(); });
    this._selectionFrame = new Sitecore.PageModes.SelectionFrame();
    this._hoverFrame = new Sitecore.PageModes.HoverFrame();
    this._moveControlFrame = new Sitecore.PageModes.MoveControlFrame();            
  };

  this.handleRegisteredMessage = function (message, params, sender) {
    var messages = this.messages;
    $sc.each(messages, function () {
      if (this.message === message) {
        this.callbackFunction(message, params, sender);
      }
    });
  };

  this.addFieldValue = function(fieldValueElement) {
    if (this.fieldValuesContainer == null) {
      this._createFieldValuesContainer();
    }
    
    var elem = null;
    if (!fieldValueElement.jquery) {
      elem = $sc(fieldValueElement);
    }
    else {
      elem = fieldValueElement;
    }
    
    this.fieldValuesContainer.append(elem); 
    elem.bind("setData", $sc.proxy(this.onFieldModified, this));
  };

  this.chromes = function() {
    if (!this._chromes) {
      var chromesToLoad = new Array();
      this._chromes = $sc(".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']")
                      .map($sc.proxy(function(idx, element) {
                        // preserve existing chromes in case of reset, only create chromes for new dom elements
                        var $domElement = $sc(element);

                        var chrome = this.getChrome($domElement);

                        if (!chrome || this.isElementButNotInitializedYet($domElement)) {
                          var type = this.getChromeType($domElement);
                          chrome = new Sitecore.PageModes.Chrome($domElement, type);

                          if (this._reseted) {
                            chromesToLoad.push(chrome);
                          }
                        }

                        return chrome;
                      }, this));

      this._reseted = false;
      $sc.each(chromesToLoad, function(){ this.load(); });
      this._chromes = $sc.grep(this._chromes, function(c) { return c != null; });
    }

    return this._chromes;
  };

  this.setClass = function (renderings, className) {
    var chromes = this.chromes();
    for (var i = 0; i < renderings.length; i++) {
      var rendering = renderings[i];
      for (var j = 0; j < chromes.length; j++) {
        var chrome = chromes[j];
        if (chrome.controlId() !== rendering["controlId"]) {
          continue;
        }

        chrome.element.addClass(className);
      }
    }
  },

  this.removeClass = function (className) {
    var chromes = this.chromes();
    for (var i = 0; i < chromes.length; i++) {
      var chrome = chromes[i];
      chrome.element.removeClass(className);
    }
  },

  this.getChromeByFieldId = function (fieldId) {
    var chrome;
    $sc.each(this.chromes(), function () {
      var identifier = this.fieldIdentifier;
      if (identifier) {
        if (identifier.toLowerCase() == fieldId.toLowerCase()) {
          chrome = this;
        }
      }
    });

    return chrome;
  },

  this.getChromesByFieldIdAndDataSource = function(fieldId, dataSourceId) {
    var result = [];
    var chromesList = this.chromes();
    for (var c = 0; c < chromesList.length; c++) {
      var chrome = chromesList[c];

      var controlId = null;
      if (chrome.controlId) {
        controlId = chrome.controlId();
      }

      if (!controlId || controlId == "") {
        controlId = chrome.element.attr("id");
      }

      if (!controlId) {
        continue;
      }

      var idParts = controlId.split('_');
      if (idParts.length < 3) {
        continue;
      }

      var fieldIdentifier = idParts[2];
      var dataSourceIdentifier = idParts[1];

      if ($sc.toShortId(fieldId.toLowerCase()) === fieldIdentifier.toLowerCase() && $sc.toShortId(dataSourceId.toLowerCase()) === dataSourceIdentifier.toLowerCase()) {
        result.push(chrome);
      }
    }

    return result;
  },

  // Updates current chromes position in array according to DOM changes
  this.rearrangeChromes = function() {
    var l = this._chromes ? this._chromes.length : 0;
    this._chromes = $sc(".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']")
                      .map($sc.proxy(function(idx, element) {                       
                        var $domElement = $sc(element);
                        var chrome = this.getChrome($domElement);
                        if (chrome) {
                          return chrome;
                        }
                      }, this));

     if (l !== this._chromes.length) {
      console.error(l + " chromes expected." + this._chromes.length + " found");
     } 
  }

  // Not the most elegant of all methods.
  // If the domElement is an editFrame or field root node, but the this.getChrome doesn't return the corresponding chrome, this means that this
  // dom element hasn't been initialized as corrseponding chrome.
  // The reason this method is here, is because the same domElement might have been initialized as a part of placeholder or rendering, which would give it an scChromes 
  // collection.
  this.isElementButNotInitializedYet = function(domElement) {
    var chrome = this.getChrome(domElement);

    if (!chrome) {
      return false;
    }

    if (!domElement.is(".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][chromeType='field']")) {        
      return false;
    }

    if (chrome.key() == "editframe" || chrome.key() == "field") {
      return false;
    }

    return true;
  };

  this.getChrome = function(domElement) {
    var chromes = domElement.data("scChromes");
    
    if (!chromes || chromes.length == 0) {
      return null;
    }

    return chromes[chromes.length - 1];
  };

  this.getChromesByType = function(chromeType) {
    return $sc.grep(this.chromes(), function(c) {
      return (c.type instanceof chromeType);
    });
  };

  this.getChromeType = function(domElement) {
    if (domElement.hasClass("scWebEditInput")) {
      if (domElement.hasClass("scWordContainer")) {
        return new Sitecore.PageModes.ChromeTypes.WordField();
      }

      return new Sitecore.PageModes.ChromeTypes.Field();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='field']")) {
      return new Sitecore.PageModes.ChromeTypes.WrapperlessField();
    }

    if (domElement.hasClass("scLooseFrameZone")) {
      return new Sitecore.PageModes.ChromeTypes.EditFrame();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='placeholder']")) {
      return new Sitecore.PageModes.ChromeTypes.Placeholder();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='rendering']")) {
      return new Sitecore.PageModes.ChromeTypes.Rendering();
    }

    console.error("Unknown chrome type:");
    console.log(domElement);

    throw ("Unknown chrome type");
  };

  this.handleMessage = function(msgName, params) {
    var msgHandler = null;
    if (this._commandSender) {
      msgHandler = this._commandSender;
    }
    else if (this.selectedChrome()) {
      msgHandler = this.selectedChrome();
    }

    if (params && params.controlId) {
      if (msgHandler == null || (msgHandler != null && msgHandler.controlId() != params.controlId)) {
        msgHandler = $sc.first(this.chromes(), function() { return this.controlId() == params.controlId; });
      }
    }
    
    if (msgHandler != null) {
      msgHandler.handleMessage(msgName, params);
    }
  };

  this.handleCommonCommands = function (sender, msgName, params) {
    if (msgName == "chrome:common:edititem") {      
      var reGuid = /(\{){0,1}[0-9A-F]{8}\-[0-9A-F]{4}\-[0-9A-F]{4}\-[0-9A-F]{4}\-[0-9A-F]{12}(\}){0,1}/i;
      var matches = reGuid.exec(sender.getContextItemUri());
      if (matches != null && matches.length > 0) {
        var itemid = matches[0];
        Sitecore.PageModes.PageEditor.postRequest(params.command + "(id=" + itemid + ")", null, false);
      }        
    }
    // throw message further in order corresponding chrome could handle it either/
    sender.handleMessage(msgName, params);
  }; 
          
  this.hideSelection = function() {
    if (this._selectedChrome) {
      this._selectedChrome.hideSelection();
      this._selectedChrome = null;
      this.selectionFrame().hide();
    }
  };

  this.hoverActive = function() {
    return !Sitecore.PageModes.DesignManager.sorting;
  };

  this.hoverFrame = function() {
    return this._hoverFrame;
  };

  this.moveControlFrame = function() {
    return this._moveControlFrame;
  };
          
  this.onMouseOver = function(chrome) {
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    if (!this.hoverActive()) {
      return;
    }

    this.overChromes.push(chrome);
    this.updateHoverChrome();
  };

  this.onMouseOut = function(chrome) {
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    var idx = $sc.inArray(chrome, this.overChromes); 
    if (idx > -1) {
      this.overChromes.splice(idx,1);
    }

    this.updateHoverChrome();
  };   
  /**
  * @deprecated since Sitecore 6.5. You should now use @see Sitecore.PageModes.PageEditor#postRequest.
  */  
  this.postRequest = function(request, callback, async) {
    Sitecore.PageModes.PageEditor.postRequest(request, callback, async);    
  };
  
  this.resetChromes = function() {   
    this.chromesReseting.fire();
    $sc.each(this.chromes(), function(){ this.reset();});

    this._chromes = null;
    this._reseted = true;

    // force init of new chromes to attach event handlers
    this.chromes();
    this.chromesReseted.fire();
    Sitecore.PageModes.ChromeHighlightManager.planUpdate();
  };

  this.resetSelectionFrame = function () {
    var selectionFrame = this.selectionFrame();
    if (!selectionFrame) {
      return;
    }

    var selectedChrome = this.selectedChrome();    
    if (selectedChrome) {
      this.hideSelection();
      this.select(selectedChrome);
    }
  };

  this.save = function(postaction) {
    Sitecore.PageModes.PageEditor.save(postaction);
  };
  
  this.select = function(chrome) {       
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    if (!chrome || !chrome.isEnabled()) {
      this.hideSelection();            
      this.selectionChanged.fire(null);
      return;
    }

    this.selectionChanged.fire(chrome);

    if (this._selectedChrome == chrome) {
      this.selectionFrame().show(chrome);
      return;
    }

    if (this._selectedChrome && this._selectedChrome != chrome) {
      this._selectedChrome.hideSelection();
    }

    this._selectedChrome = chrome;
    chrome.showSelection();
    this.selectionFrame().show(chrome);    
  };

  this.selectedChrome = function() {
    return this._selectedChrome;
  };

  this.selectionFrame = function() {
    return this._selectionFrame;
  };

  /**
  * @deprecated since Sitecore 6.5. You should now use @see Sitecore.PageModes.PageEditor#setModified.
  */
  this.setModified = function(value) {   
     Sitecore.PageModes.PageEditor.setModified(value);   
  };

  /**
  * @deprecated since Sitecore 6.5. You should now use @see Sitecore.PageModes.PageEditor#isModified.
  */
  this.isModified = function() {
    return Sitecore.PageModes.PageEditor.isModified();
  };

  this.setCommandSender = function(chrome) {
    this._commandSender = chrome;
  };
    
  this.onCapabilityChanged = function() {
    var selectedChrome =  this.selectedChrome();
    this.hideSelection();    
    this.resetChromes();
    $sc.each(this.chromes(), function() { this.reload();});
    if (selectedChrome && selectedChrome.isEnabled()) {
       this.select(selectedChrome);        
    }    
  };

  /**
  * @description Handles the event when Ajax request was sent to update chrome content (insert rendering, change condition etc.)
  */
  this.onChromeUpdating = function() {    
    this.chromeUpdating.fire(this._commandSender);
  };

  /**
  * @description Handles the event when Ajax request for chrome updating has finished;
  */
  this.onChromeUpdated = function(chrome, reason) {
    this.chromeUpdated.fire();
    var isBatchUpdate = false;
    if (chrome && chrome.key() == "rendering" && reason == "changevariation") {
      var id = chrome.type.uniqueId();
      var idx = $sc.findIndex(this._updateVariationsQueue, function() { return this.componentId == id; });
      if (idx >= 0) {
        this._updateVariationsQueue.splice(idx, 1); 
        isBatchUpdate = true; 
      }
      
      var next = this._updateVariationsQueue[0];
      if (!next) {
        if (isBatchUpdate) {
          if (this._selectChromeAfterBatchUpdate === false) {
            this.select(null);
          }
          else {
            this.scrollChromeIntoView(chrome);           
          }          
        }

        this.selectionFrame().activate();       
        return;
      }

      var component = $sc.first(this.chromes(), function() { 
        return this.key() === "rendering" && this.type.uniqueId() === next.componentId;
      });

      if (!component) {
        return;
      }
      
      Sitecore.PageModes.ChromeManager.select(component);     
      component.handleMessage("chrome:testing:variationchange", {id: next.variationId});      
    }

    var ribbonBody = Sitecore.PageModes.PageEditor.ribbonBody();
    if (ribbonBody) {
      ribbonBody.trigger("onChromeUpdated");
    }
  };

  this.onFieldModified = function(evt, key, value) {    
    if (key == "modified") {      
      evt.stop();
      modifiedControlId = value;
      $sc.each(this.chromes(), function() { 
        if (this.key() == "field" && this.controlId() != modifiedControlId && this.type.isFieldValueContainer(evt.target)) {
          this.type.setReadOnly();
        } 
      });
    }
  };
  
  this.scrollChromeIntoView = function(chrome) {
     this.positioningManager.scrollIntoView(chrome);
  }; 

  this.updateHoverChrome = function() {
    var result = [], l = this.overChromes.length;

    for (var i = 0; i < l; i++) {
      var isUnique = true;

      if (this.overChromes[i].removed()) {
        continue;
      }

      for (var j = 0; j < result.length; j++) {
        if (result[j] == this.overChromes[i]) {
          isUnique = false;
          break;
        }
      }

      if (isUnique) {
        result.push(this.overChromes[i]);
      }
    }

    this.overChromes = result;
    
    var level = 0;
    var deepestChrome = null;

    $sc.each(this.overChromes, function() {
      if (this.level() > level) {
        level = this.level();
        deepestChrome = this;
      }
    });

    if (this._hoverChrome && this._hoverChrome != deepestChrome) {
      this._hoverChrome.hideHover();
    }

    if (deepestChrome) {
      this._hoverChrome = deepestChrome;
      deepestChrome.showHover();
    }
  };

  this.updateChromeDimensions = function() {    
    if (this._selectedChrome) {     
        this._selectedChrome.position.reset();      
    }
  };

  this.updateField = function(id, htmlValue, plainValue, preserveInnerContent) {
    var fieldToUpdate = $sc.first(this.chromes(), function() { return this.key() == "field" && this.controlId() == id;});
    if (fieldToUpdate) {
      var params = {
          plainValue: plainValue,
          value: htmlValue,
          preserveInnerContent: !!preserveInnerContent 
        };
              
      fieldToUpdate.handleMessage("chrome:field:editcontrolcompleted", params);
      if (!preserveInnerContent) {        
        fieldToUpdate.position.reset();
      }
    }
    else {
      console.error("The field with " + id + "was not found");
    }
  };

  this.batchChangeVariations = function(combination, selectChrome) {
    this._selectChromeAfterBatchUpdate = !!selectChrome
    for (var n in combination) {
      if (!combination.hasOwnProperty(n)) {
        continue;
      }

      var isQueueEmpty = this._updateVariationsQueue.length == 0;                      
      var componentId = n;
      var variationId = combination[n];
      this._updateVariationsQueue.push({componentId:componentId, variationId: variationId});
      if (isQueueEmpty) {
        var component = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { 
          return this.key() === "rendering" && this.type.uniqueId() === componentId;
        });

        if (component) {
          this.selectionFrame().deactivate();
          this.select(component);     
          component.handleMessage("chrome:testing:variationchange", {id: variationId}); 
        }
      }      
    }
  };

  this.getFieldValueContainer = function(itemUri, fieldID) {
    return this._getFieldValueContainer(itemUri, fieldID);
  };

  this.getFieldValueContainerById = function(id) {    
    if (!this.fieldValuesContainer) {
      return null;
    }

    var parts = id.split("_");
    // normalizaed id doesn't contain trailing _revision and _sequencer
    var normalizedId = parts.slice(0, 5).join("_");

    var result = $sc("input", this.fieldValuesContainer).filter(function() {
      return this.id.indexOf(normalizedId) == 0;
    });

    return result[0];    
  };

  this._createFieldValuesContainer = function() {    
    this.fieldValuesContainer = $sc("<div id='scFieldValues'></div>").prependTo(document.body);
  };
    
  this._getFieldValueContainer = function(itemUri, fieldID) {
    var id = "fld_" + itemUri.id + "_" + fieldID + "_" + itemUri.language + "_" + itemUri.version;
    return this.getFieldValueContainerById(id);
  };

  this.getFieldValue = function(itemUri, fieldID) {
    var container = this._getFieldValueContainer(itemUri, fieldID);

    if (!container) {
      return null;
    }

    return container.value;
  };

  this.setFieldValue = function (itemUri, fieldID, value) {
    value = value.replace(/-,scCReturn,-/g, "\r");
    value = value.replace(/-,scNewLine,-/g, "\n");
    value = value.replace(/-,scTab,-/g, "\t");

    value = value.replace(/-,scDQuote,-/g, "\"");
    value = value.replace(/-,scSQuote,-/g, "'");

    var container = this._getFieldValueContainer(itemUri, fieldID, value);    
    if (!container) {
      var revision = itemUri.revision || "#!#Ignore revision#!#";

      var id = "fld_" + itemUri.id + "_" + fieldID + "_" + itemUri.language + "_" + itemUri.version + "_" + revision + "_999";
     
      container = $sc("<input type='hidden' />").attr({
          name: id,
          id: id,
          value: value
        }).get(0);

      if (!this.fieldValuesContainer) {
        this._createFieldValuesContainer();
      }

      this.fieldValuesContainer.append(container); 
      Sitecore.PageModes.PageEditor.setModified(true);
      if (this.selectedChrome() && this.selectedChrome().key() == "editframe") {
        this.selectedChrome().type.fieldsChangedDuringFrameUpdate = true;
      }
      
      return;     
    }

    if (container.value != value) {
      container.value = value;
      Sitecore.PageModes.PageEditor.setModified(true);
      if (this.selectedChrome() && this.selectedChrome().key() == "editframe") {
        this.selectedChrome().type.fieldsChangedDuringFrameUpdate = true;
      }

      $sc.each(this.chromes(), function() { 
        if (this.key() == "field" && this.type.isFieldValueContainer(container)) {
          this.type.refreshValue();
        }
      });
    }          
  };   
};