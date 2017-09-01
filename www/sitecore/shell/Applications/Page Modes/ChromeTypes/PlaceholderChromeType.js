Sitecore.PageModes.ChromeTypes.Placeholder = Sitecore.PageModes.ChromeTypes.ChromeType.extend( {
  constructor: function() {
    this.base();
  },

  controlId: function() {
    var marker = this.chrome.openingMarker();
    if (marker) {
      return marker.attr("id");
    }

    return this.base();
  },

  selectable: function() {
    if (this._selectable != null) {
      return this._selectable;
    }

    var marker = this.chrome.openingMarker();
    this._selectable = marker != null && marker.attr("data-selectable") === "true";
    return this._selectable;
  },

  addControl: function (position) {
    this._insertPosition = position;

    var ribbon = Sitecore.PageModes.PageEditor.ribbon();

    Sitecore.PageModes.PageEditor.layoutDefinitionControl().value = Sitecore.PageModes.PageEditor.layout().val();
    Sitecore.PageModes.PageEditor.postRequest("webedit:addrendering(placeholder=" + this.placeholderKey() + ")");
  },
  
  addControlResponse: function(id, openProperties, ds) {                       
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("insert");
    options.context = this;    
    options.data.rendering = id;
    options.data.placeholderKey = this.placeholderKey();
    options.data.position = this._insertPosition;
    options.data.url = window.location.href;

    var allowedrenderingsIds = "";
    for (var i = 0; i < this.chrome.data.custom.allowedRenderings.length; i++) {
      allowedrenderingsIds += this.chrome.data.custom.allowedRenderings[i].toString();
      if (i < this.chrome.data.custom.allowedRenderings.length - 1) {
        allowedrenderingsIds += "|";
      }
    }

    options.data.allowedRenderingsIds = allowedrenderingsIds;
    
    if (ds) {
      options.data.datasource = ds;
    }

    options.success = function (serverData) {
      var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);       
      var persistedLayout;
      if (data.layout) {
        var layoutCtrl = $sc("#scLayout");
        persistedLayout = layoutCtrl.val();
        layoutCtrl.val(data.layout);          
      }

      // sublayout
      if (data.url != null) {
        this._loadRenderingFromUrl(data.url, function(callbackData) {
          if (callbackData.error == null) {                            
            data.html = $sc(callbackData.renderingElement.combined).outerHtml();
            data.opening = callbackData.renderingElement.opening;
            data.content = callbackData.renderingElement.content;
            data.closing = callbackData.renderingElement.closing;
            Sitecore.PageModes.ChromeManager.select(null);
            this.insertRendering(data, openProperties);
          }
          else {
            if (persistedLayout) {
              $sc("#scLayout").val(persistedLayout).change();
            }

            alert(callbackData.error);
          } 
        });                   
      }
      // plain rendering, not a sublayout
      else {
        Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
        Sitecore.PageModes.ChromeManager.select(null);
        this.insertRendering(data, openProperties);
      }      
    };
      
    $sc.ajax(options);                  
  },
  
  deleteControl: function(chrome) {
    Sitecore.LayoutDefinition.remove(chrome.type.uniqueId());    
    
    Sitecore.PageModes.ChromeManager.select(null);
    Sitecore.PageModes.ChromeHighlightManager.stop();         
    
    var l = chrome.element.length;   
    chrome.element.fadeOut(200, $sc.proxy(function () {
        l = l - 1;
        if (l> 0) return;
        this._removeRendering(chrome);                      
        if (this.isEmpty()) {
          this.showEmptyLook();
        }

        Sitecore.PageModes.ChromeHighlightManager.resume();         
      }, this));
  },
  
  editProperties: function(chrome) {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();

    if (ribbon == null) {
      return;
    }
    
    Sitecore.PageModes.PageEditor.layoutDefinitionControl().value = Sitecore.PageModes.PageEditor.layout().val();
        
    Sitecore.PageModes.PageEditor.postRequest("webedit:editrenderingproperties(uniqueid=" + chrome.type.uniqueId() + ")");
  },
  
  editPropertiesResponse: function(renderingChrome) {
    if (!Sitecore.LayoutDefinition.readLayoutFromRibbon()) {
      return;
    }
    
    var commandName = "preview";        
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions(commandName);
    options.data.renderingUniqueId = renderingChrome.type.uniqueId();       
    options.data.url = window.location.href;
    this._addAnalyticsOptions(renderingChrome, options);
    if (options.data.variationId) {
      options.data.command += "variation";
    }
    else if (options.data.conditionId) {
      options.data.command += "condition";
    }
            
    options.context = this;                    
    options.success = function(serverData) {               
      var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);
      
      Sitecore.PageModes.ChromeHighlightManager.stop();                 
            
      if (data.url != null) {          
        this._loadRenderingFromUrl(data.url, function(callbackData) {
          if (callbackData.error == null) {
            Sitecore.PageModes.ChromeManager.select(null);            
            this._doUpdateRenderingProperties(renderingChrome, callbackData.renderingElement.combined.outerHtml());                        
          }
          else {
            console.log(callbackData.error);
          }
        }); 
      }
      else {
        Sitecore.PageModes.ChromeManager.select(null);
        Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        Sitecore.PageModes.Utility.tryAddScripts(data.scripts);                  
        this._doUpdateRenderingProperties(renderingChrome, data.html);                
      }                     
    };
     
    $sc.ajax(options);
  },

  editSettings: function() {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    if (ribbon == null) {
      return;
    }
        
    Sitecore.PageModes.PageEditor.layoutDefinitionControl().value = Sitecore.PageModes.PageEditor.layout().val();
    Sitecore.PageModes.PageEditor.postRequest("webedit:editplaceholdersettings(key=" + this.placeholderKey() + ")");    
  },

  editSettingsCompleted: function(isEditable, allowedRenderingIds) {
    Sitecore.LayoutDefinition.readLayoutFromRibbon();
    if (this.chrome.hasDataNode) {
      this.chrome.data.custom.editable = isEditable ? "true": "false";
      this.chrome.data.custom.allowedRenderings = allowedRenderingIds;      
    }

    Sitecore.PageModes.ChromeManager.select(null);
    this.reload();
    Sitecore.PageModes.ChromeManager.resetChromes();    
    Sitecore.PageModes.ChromeManager.select(this.chrome);     
  },
  
  getOpenProperties: function (data, openProperties) {
    return null;
  },


  /* used when new controls are being inserted (or if they replace other controls) when returned from the server */
  insertRendering: function (data, openProperties) {
    console.group("insertRendering");

    var _openProperties = this.getOpenProperties(data, openProperties);
    if (_openProperties != null) {
      openProperties = _openProperties;
    }

    var placeholder = this.chrome;          
    
    if (this.emptyLook()) {
      this.hideEmptyLook();
    }

    Sitecore.PageModes.ChromeHighlightManager.stop();

    var newElement = $sc(data.html);

    var position = this._insertPosition;
    this._insertPosition = null;

    var childRenderings = this.renderings();

    if (position == 0) {
      placeholder.prepend(newElement);
    }
    else if (childRenderings.length != 0 && position < childRenderings.length) {
      var rendering = childRenderings[position - 1];
      rendering.after(newElement);
    }
    else {
      placeholder.append(newElement);
    }

    Sitecore.PageModes.ChromeManager.resetChromes();
        
    var newRenderingUniqueId = newElement.attr("id").substring(2);
    var newRenderingChrome = this._getChildRenderingByUid(newRenderingUniqueId);

    if (data.content) {
      var containsChromeNodes = false;

      $sc.each(data.content, function() {
        if (this.nodeType == 1) {
          containsChromeNodes = true;
          return false;
        }
      });

      if (!containsChromeNodes) {
        this.handleEmptyRendering();
        return;
      }
    }

    Sitecore.PageModes.PageEditor.setModified(true);

    if (!newRenderingChrome) {
      if (newRenderingUniqueId && newRenderingUniqueId != "" && !data.content) {
        this.handleEmptyRendering();
        return;
      }

      console.error("Cannot find rendering chrome with unique id: " + newRenderingUniqueId);
      Sitecore.PageModes.ChromeHighlightManager.resume();
      return;
    }

    Sitecore.PageModes.PageEditor.setModified(true);
    var l = newRenderingChrome.element.length;   
    newRenderingChrome.element.fadeIn(500, function() {        
      if (--l > 0) return;
      if (!openProperties) {        
        Sitecore.PageModes.ChromeManager.select(newRenderingChrome);
        Sitecore.PageModes.ChromeHighlightManager.resume();          
      }        
    });
                                  
    if (openProperties && newRenderingChrome.isEnabled()) {
      Sitecore.PageModes.ChromeManager.setCommandSender(newRenderingChrome);                        
      this.editProperties(newRenderingChrome);            
    }

    console.groupEnd("insertRendering");
  },

  handleEmptyRendering: function () {
    console.log("Chrome rendering was added but can not be selected due to absence of editable elements.");
    Sitecore.PageModes.PageEditor.setModified(true);
  },

  /* used by design manager while moving controls around on the page */
  insertRenderingAt: function(control, position) { 
    Sitecore.PageModes.ChromeManager.ignoreDOMChanges = true;    
    var originalPlaceholder = control.type.getPlaceholder();
    if (this.emptyLook()) {
      this.hideEmptyLook();
    }

    Sitecore.PageModes.ChromeHighlightManager.stop();

    if (this.isEmpty()) {
      this.chrome.append(control);
    }
    else {
      var renderings = this.renderings();      
      
      if (position < renderings.length) {    
        var rendering = renderings[position];
        rendering.before(control);
      }
      else {
        this.chrome.append(control);
      }
    }
    
    control._placeholder = this;
    var l = control.element.length;   
    control.element.fadeIn(500, function() {     
      if (--l > 0) return;
      $sc.each(control.descendants(), function() { if (this.key() == "word field") this.type.initWord(); });
      control.detachElements();
      // The position of DOM nodes has change.
      // Rearange chromes position in the _chromes array to make the chromes reset method occurr in correct sequence
      Sitecore.PageModes.ChromeManager.rearrangeChromes();
      Sitecore.PageModes.ChromeManager.resetChromes();
      
      if (originalPlaceholder) {
        originalPlaceholder.type.reload();
      }

      Sitecore.PageModes.ChromeHighlightManager.resume();
      Sitecore.PageModes.ChromeManager.select(control);
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = false;
    });       
  },

  isEmpty: function () {
    return this.chrome.element.length === 0 || this.chrome.element.hasClass(Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass)
		|| this.isOnlyElementEmpty();
  },

  // extra check due to the EE 88374 bug
  isOnlyElementEmpty: function () {
    return this.chrome.element.length === 1 && this.chrome.element[0].innerText === "" && this.chrome.element[0].attributes
      && this.chrome.element[0].attributes["sc-part-of"] && this.chrome.element[0].attributes["sc-part-of"].value === "placeholder rendering"
      && this.chrome.element[0].style.display === "none";
  },

  isEnabled: function() {
    return this.base() &&
            this.selectable() &&
            this.chrome.data.custom.editable === "true" && 
            $sc.inArray(Sitecore.PageModes.Capabilities.design, Sitecore.PageModes.PageEditor.getCapabilities()) > -1;            
  },

  elements: function(domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='placeholder']")) {
      console.error("Unexpected domelement passed to PlaceholderChromeType for initialization:");
      console.log(domElement);
      
      throw "Failed to parse page editor placeholder demarked by script tags";
    }  

    return this._getElementsBetweenScriptTags(domElement);
  },
  
  emptyLook: function() {
    return this.chrome.element.filter(this._emptyLookSelector()).length > 0;
  },
    
  getContextItemUri: function() {
    return "";
  },
  
  handleMessage: function(message, params) {
    switch (message) {
      case "chrome:placeholder:addControl":
        this.addControl();
        break;
      case "chrome:placeholder:editSettings":
        this.editSettings();
        break;
      case "chrome:placeholder:editSettingscompleted":
        this.editSettingsCompleted(params.editable, params.allowedRenderingIds);
        break;
      case "chrome:placeholder:controladded":
        this.addControlResponse(params.id, params.openProperties, params.dataSource);
        break;
    }    
  },
  
  hideEmptyLook: function() {        
    this.chrome.element.filter(this._emptyLookSelector()).remove();
  },
    
  key: function() {
    return "placeholder";
  },
  
  load: function() {
    if (this.isEmpty()) {
      this.showEmptyLook();
    }

    var addCommand = $sc.first(this.chrome.commands(), function() { return this.click.indexOf("chrome:placeholder:addControl") > -1; });
    if (addCommand) {
      this._insertionEnabled = true;
      addCommand.hidden = true;
    }
  },

  loadRenderingFromUrl: function(url, callback) {
    this._loadRenderingFromUrl(url, callback);
  },

  morphRenderings: function(chrome, morphingRenderingsIds) {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();

    Sitecore.PageModes.PageEditor.layoutDefinitionControl().value = Sitecore.PageModes.PageEditor.layout().val();
    this._insertPosition = chrome.type.positionInPlaceholder();    
    Sitecore.PageModes.PageEditor.postRequest("webedit:addrendering(placeholder=" + this.placeholderKey() + ",renderingIds=" + 
                                                morphingRenderingsIds.join('|') + ")");
  },

  morphRenderingsResponse: function(renderingChrome, id, openProperties) {            
    if (id == "") {
      return;
    }
    
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("morph");
    options.data.morphedRenderingUid = renderingChrome.type.uniqueId();
    options.data.rendering =  id; 
    options.data.placeholderKey = this.placeholderKey();
    options.data.url = window.location.href       
    options.context = this;
    this._addAnalyticsOptions(renderingChrome, options, true);
    
    options.success = function(serverData) {               
      var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);
      var persistedLayout;
      
      if (data.layout) {
        var layoutCtrl = $sc("#scLayout");
        persistedLayout = layoutCtrl.val();
        layoutCtrl.val(data.layout);  
      }
        
      Sitecore.PageModes.ChromeManager.hideSelection();
        
      if (data.url != null) {          
        this._loadRenderingFromUrl(data.url, function(callbackData) {
          if (callbackData.error == null) {
            data.html = callbackData.renderingElement.combined.outerHtml();
            this._removeRendering(renderingChrome);
            this.insertRendering(data, openProperties);
          }
          else {
            if (persistedLayout) {
              $sc("#scLayout").val(persistedLayout).change();
            }

            alert(callbackData.error);
          } 
        });                   
      }
      else {
        this._removeRendering(renderingChrome);
        Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
        this.insertRendering(data, openProperties);
      }

      if (renderingChrome.type.hasVariations()) {        
        Sitecore.PageModes.PageEditor.refreshRibbon();   
      }
    };

    $sc.ajax(options);
  },

  onShow: function() {
    if (!this._insertionEnabled) {
      return;
    }

    if (this.isReadOnly()) {
      return;
    } 
       
    this.inserter = new Sitecore.PageModes.ChromeTypes.PlaceholderInsertion(this.chrome);
    this.inserter.activate();
  },

  onHide: function() {
    if (this.inserter) {
      this.inserter.deactivate();
      this.inserter = null;
    }
  },
        
  placeholderKey: function() {
    return this.chrome.openingMarker().attr("key");
  },
  
  removeChrome: function(chrome) {
    chrome.element.remove();
  },

  renderings: function () {
    return this.chrome.getChildChromes(function() { return this.key() == "rendering" });
  },

  renderingAllowed: function(renderingId) {
    var allowedRenderings = this.chrome.data.custom.allowedRenderings;
    return allowedRenderings.length == 0 || $sc.inArray(renderingId, allowedRenderings) > -1;
  },

  reload: function() {
    if (!this.isEmpty()) {
      return;
    }

    this.isEnabled() ? this.showEmptyLook() : this.hideEmptyLook();
  },
  
  sortingStart: function(rendering) {
    if (!this.renderingAllowed(rendering.type.renderingId())) {
      return;
    }

    if (this.isReadOnly()) {
      return;
    }
  
    this.sorter = new Sitecore.PageModes.ChromeTypes.PlaceholderSorting(this.chrome, rendering);
    this.sorter.activate(); 
  },
  
  sortingEnd: function() {
    if (!this.sorter) {      
      return;
    }
    
    this.sorter.deactivate();
    this.sorter = null;
  },
    
  showEmptyLook: function() {
    if (this.emptyLook()) {
      return;
    }

    if (!this.isEnabled()) {
      return;
    }
    
    var emptyLookFiller = $sc("<div class='scEnabledChrome' />")
                                .addClass(Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass)
                                .attr("sc-placeholder-id", this.controlId());

    this.chrome.append(emptyLookFiller);
    this.chrome.reset();
  },

  _addAnalyticsOptions: function(renderingChrome, options, useDefault) {
    var activeVariation, activeCondition;
    activeVariation = $sc.first(renderingChrome.type.getVariations(), function() { return useDefault || this.isActive; });
    if (!activeVariation) {              
      activeCondition = $sc.first(renderingChrome.type.getConditions(), function() { return useDefault? this.isDefault() : this.isActive; });      
    } 
           
    if (activeVariation) {
      options.data.variationId = activeVariation.id;
    }

    if (activeCondition) {
      options.data.conditionId = $sc.toShortId(activeCondition.id);
    } 
  },

  _doUpdateRenderingProperties: function(renderingChrome, html) {
    renderingChrome.type.update(html);            
    Sitecore.PageModes.ChromeManager.resetChromes();
    renderingChrome.reload();
    // Changing properies may effect appearance of other conditions or variations
    renderingChrome.type.clearCachedConditions();
    renderingChrome.type.clearCachedVariations();
    var chrome = this._getChildRenderingByUid(renderingChrome.type.uniqueId());
      
    if (chrome) {
      setTimeout(function() {           
        Sitecore.PageModes.ChromeHighlightManager.resume();
        Sitecore.PageModes.ChromeManager.select(chrome);          
      }, 100);
    }
    else {
      Sitecore.PageModes.ChromeHighlightManager.resume();
    }
  },

  _emptyLookSelector: function() {
    // Using only CSS class is not enough, becuase we can get the empty placeholder of some inner rendering by mistake.
    return "." + Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass + "[sc-placeholder-id='" + this.controlId() + "']";
  },

  _getChildRenderingByUid: function(uid) {
    return this.chrome.getChildChromes(function() { return this.key() == "rendering" && this.type.uniqueId() == uid; })[0];
  },
  
  _loadRenderingFromUrl: function(url, callback) {    
    if (!this._loadingFrame) {
      this._loadingFrame = $sc("<iframe id='scLoadingFrame'></iframe>").attr({ height:"0px", width:"0px"}).appendTo(document.body);
      this._loadingFrame.bind("load", $sc.proxy(this._frameLoaded, this));   
    }

    this._frameLoadedCallback = callback;
    this._loadingFrame[0].src = url + "&rnd=" + Math.random();       
  },

  _frameLoaded: function () {
    if (this._loadingFrame == null) {
      console.error("cannot load data from frame. Frame isn't defined");
      return;    
    }

    var frame = this._loadingFrame.get(0);
    var renderingUniqueId = $sc.parseQuery(frame.contentWindow.location.href)["sc_ruid"];
    var doc = frame.contentDocument || frame.contentWindow.document;
        
    var renderingDomElement = doc.getElementById("r_" + renderingUniqueId);

    var callbackData = new Object();   
    
    if (renderingDomElement != null) {      
      var start = $sc(renderingDomElement);
      
      if (!start.is("code[type='text/sitecore'][chromeType='rendering'][kind='open']")) {
         throw "Loaded unexpected element while trying to get rendering html from server. Expected opening script marker.";
      }
      
      var middle = this._getRenderingContent(start, "code[type='text/sitecore'][chromeType='rendering'][kind='close']");
      var end = middle.length > 0 ?
        $sc(middle.last()[0].nextSibling) :
        start.last().next();

      start = start.clone();
      middle = middle.clone();
      end = end.clone();     
      var elements = start.add(middle).add(end);

      if (!elements.last().is("code[type='text/sitecore'][chromeType='rendering'][kind='close']")) {
        console.error(elements);

        throw "Loaded unexpected element while trying to get rendering html from server. Expecting last tag to be closing script marker";
      }

      callbackData.renderingElement = {opening: start, content: middle, closing: end, combined: elements };
    }
    else
    {
      console.error("Could not find the rendering in the HTML loaded from server");

      if (frame.contentWindow.location.href.toLowerCase().indexOf("pagedesignererror.aspx") > -1) {     
        callbackData.error = Sitecore.PageModes.Texts.SublayoutWasInsertedIntoItself;
      }
      else {
        callbackData.error = Sitecore.PageModes.Texts.ErrorOcurred;
      }
    }
   
    if (this._frameLoadedCallback != null) {
      this._frameLoadedCallback(callbackData);
      this._frameLoadedCallback = null;
    }    
  },

  _getRenderingContent: function (openMarker, endSelector) {
    var renderingElements = [];
    var sibling = openMarker[0].nextSibling;
    while (sibling) {
      var element = $sc(sibling);
      if (element.is(endSelector)) {
        break;
      }

      renderingElements.push(sibling);
      sibling = sibling.nextSibling;
    }

    return $sc(renderingElements);
  },
  
  _removeRendering: function(renderingChrome) {
    if (renderingChrome == null || renderingChrome.key() != "rendering") return;
    if (Sitecore.PageModes.Personalization) {
      Sitecore.PageModes.Personalization.ConditionStateStorage.remove(renderingChrome.type.uniqueId());
    }

    renderingChrome.remove();
    Sitecore.PageModes.ChromeManager.resetChromes();
  }
},
{
  emptyLookFillerCssClass: "scEmptyPlaceholder",
  getDefaultAjaxOptions: function (commandName) {
    var options = {
      type: "POST",
      url: "/sitecore/shell/Applications/WebEdit/Palette.aspx",     
      dataType: "html",
      data: {
        command: commandName,
        itemid: Sitecore.PageModes.PageEditor.itemId(),
        language: Sitecore.PageModes.PageEditor.language(),
        layout: $sc("#scLayout").val(),
        deviceid:$sc("#scDeviceID").val(),
        siteName: $sc("#scSite").val()
      },

      beforeSend: function (xhr) {
        Sitecore.PageModes.ChromeManager.onChromeUpdating();
      },

      complete: function () {
        Sitecore.PageModes.ChromeManager.onChromeUpdated();  
      },
      error: function(xhr, error) {       
        alert(Sitecore.PageModes.Texts.ErrorOcurred);
      },

      global: false
    };

    return options;
  }
});