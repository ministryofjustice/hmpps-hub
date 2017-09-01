Sitecore.PageModes.ChromeTypes.Rendering = Sitecore.PageModes.ChromeTypes.ChromeType.extend({
  constructor: function() {
    this.base();
  },
  
  deleteControl: function() {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {     
      placeholder.type.deleteControl(this.chrome);      
    }
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
  
  editProperties: function() {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.editProperties(this.chrome);
    }
  },

  editPropertiesCompleted: function() {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.editPropertiesResponse(this.chrome);
    }
  },

  elements: function (domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='rendering']")) {
      console.error("Unexpected domelement passed to RenderingChromeType for initialization:");
      console.log(domElement);
      throw "Failed to parse page editor rendering demarked by script tags";
    }  

    return this._getElementsBetweenScriptTags(domElement);
  },

  clearCachedConditions: function() {
    var conditions = this.getConditions();
    for (var i = 0; i < conditions.length; i++) {
      Sitecore.PageModes.Personalization.RenderingCache.removeCondition(this.chrome, conditions[i]);
    }
  },
  
  clearCachedVariations: function() {
    var chrome = this.chrome;
    $sc.each(this.getVariations(), function() {Sitecore.PageModes.Testing.RenderingCache.removeVariation(chrome, this);});
  }, 
  
  getConditions: function() {
    if (this._conditions) {
      return this._conditions;
    }

    this._conditions = Sitecore.LayoutDefinition.getRenderingConditions(this.uniqueId());        
    var isActiveConditionSpecified = $sc.exists(this._conditions, function(){ return this.isActive})
    if (!isActiveConditionSpecified) {
      var defaultCondition = $sc.first(this._conditions, function(){ return this.isDefault();});
      if (defaultCondition) {
        defaultCondition.isActive = true;
      }
    }
                               
    return this._conditions;
  },

  resetConditions: function() {        
    this._conditions = null;    
  },
  
  getControl: function(placeholder) {
    var element = this.chrome.element;
    
    return $sc.first(placeholder.controls(), function() {
      return this.element == element;
    });
  },
  
  getPlaceholder: function() {
    var result = this.chrome.parent(false, false);

    if (!result) {
      return null;
    }
    
    if (result.type.key() != "placeholder") {
      var parentElement = result.parent();
      if (!parentElement || parentElement.type.key() != "placeholder") {
        console.warn(result.element);
        console.log();
        throw "Rendering must have placeholder chrome as its parent. Got '" + result.type.key() + "' instead";
      }

      result = parentElement;
    }

    return result;
  },

  getVariations: function() {
    return this._variations;
  },
     
  handleMessage: function(message, params, sender) {
    switch (message) {
      case "chrome:rendering:sort":
        this.sort();
        break;
      case "chrome:rendering:properties":
        this.editProperties();
        break;
      case "chrome:rendering:propertiescompleted":
        this.editPropertiesCompleted();
        break;
      case "chrome:rendering:delete": 
        this.deleteControl();
        break;
      case "chrome:rendering:morph":
        this.morph(params);
        break;
      case "chrome:rendering:morphcompleted":
        this.morphCompleted(params.id, params.openProperties);
        break;
      case "chrome:rendering:personalize":
        if (Sitecore.PageModes.Personalization) {
          this.personalize(params.command);
        }
        break;
      case "chrome:rendering:personalizationcompleted":
        if (Sitecore.PageModes.Personalization) {
          this.presonalizationCompleted(params, sender);
        }                
        break;
      case "chrome:personalization:conditionchange":
        if (Sitecore.PageModes.Personalization) {
          this.changeCondition(params.id, sender);
        }
        break;      
      case "chrome:rendering:editvariations":
        if (Sitecore.PageModes.Testing) {
          this.editVariations(params.command, sender);
        }
        break;
      case "chrome:rendering:editvariationscompleted":
        if (Sitecore.PageModes.Testing) {
          this.editVariationsCompleted(params, sender);
        }
        break;
      case "chrome:testing:variationchange":
        if (Sitecore.PageModes.Testing) {
          this.changeVariation(params.id, sender);
        }        
        break;         
    }
  },

  editVariations: function(commandName, sender) {
    if (!this.hasVariations()) {      
      if (this.chrome.getChildChromes(function () {return this.key() == "rendering" && this.type.hasVariations();}, true).length) {
        alert(Sitecore.PageModes.Texts.Analytics.TestSetUpOnDescendant);
        return;
      }
      
      var ancestors = this.chrome.ancestors();
      if ($sc.first(ancestors, function() {return this.key() == "rendering" && this.type.hasVariations()})) {
        alert(Sitecore.PageModes.Texts.Analytics.TestSetUpOnAscendant);
        return;
      }
    }

    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    Sitecore.PageModes.PageEditor.layoutDefinitionControl().value = Sitecore.PageModes.PageEditor.layout().val();
    var controlId = this.controlId();
    if (sender) {
      controlId = sender.controlId(); 
    }

    Sitecore.PageModes.PageEditor.postRequest(commandName + "(uniqueId=" + this.uniqueId() + ",controlId=" + controlId + ")");
  },

  editVariationsCompleted: function (parameters, sender) {
    var variations = parameters.variations;     
    Sitecore.LayoutDefinition.readLayoutFromRibbon(); 
    // reset command
    if (variations.length == 0) {
      var chrome = this.chrome;
      //Clear caches
      $sc.each(this.getVariations(), function() {Sitecore.PageModes.Testing.RenderingCache.removeVariation(chrome, this);});      
      this._variations = [];
      // TODO: change this. Currently changing rendering properties doesn't update chrome data.
      this.editPropertiesCompleted();      
      // Update ribbon controls which display testing components     
      Sitecore.PageModes.PageEditor.refreshRibbon();      
      return;        
    }
 
    var activeVariation = $sc.first(this.getVariations(), function() { return this.isActive;});           
    // By default last variation is active
    variations[variations.length - 1].isActive = true;    
    var activeVariationId;
    if (activeVariation) {
      activeVariationId = activeVariation.id
      for (var i = 0; i < variations.length; i++) {        
        if (variations[i].id === activeVariationId) {
          //Reset default active variation
          variations[variations.length - 1].isActive = false;
          variations[i].isActive = true;
          break;
        }        
      }
    }
    else {
      // Component is testable now.
      // Update ribbon controls which display testing components 
      Sitecore.PageModes.PageEditor.refreshRibbon();
    }

    var isActiveVariationModified = false;
    var modifiedVariations = parameters.modifiedIds;
    for (var i = 0; i < modifiedVariations.length; i++) {
      Sitecore.PageModes.Testing.RenderingCache.removeVariation(this.chrome,  modifiedVariations[i]);
      if (modifiedVariations[i] === activeVariationId) {
        isActiveVariationModified = true;
      }
    }
    
    this._variations = variations;
    if (isActiveVariationModified || activeVariation == null) {
      var newActiveVariation = $sc.first(this.getVariations(), function() { return this.isActive;});
      if (newActiveVariation) {
        var preserveCacheUpdating = true;                            
        this.changeVariation(newActiveVariation.id, sender, preserveCacheUpdating);
        return;
      }        
    }

    if (Sitecore.PageModes.ChromeManager.selectedChrome() != null) {
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();
    }
    else {
      Sitecore.PageModes.ChromeManager.select(this.chrome);
    } 
  },

  isEnabled: function() {
    return  this.base() &&
            this.selectable() &&
            this.chrome.data.custom.editable === "true" &&             
            $sc.inArray(Sitecore.PageModes.Capabilities.design, Sitecore.PageModes.PageEditor.getCapabilities()) > -1;            
  },

  hasVariations: function() {
    return this._variations.length > 0;
  },
  
  hasConditions: function () {
    if (!this._conditions) {
      return false;
    }
    
    var length = this._conditions.length;
    if (length > 1) {
      return true;
    }

    if (length == 1) {
      return !this._conditions[0].isDefault();
    }

    return false;
  },

  key: function() {
    return "rendering";
  },

  morph: function(morphingRenderings) {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.morphRenderings(this.chrome, morphingRenderings);
    }
  },

  morphCompleted: function(mophedRenderingId, openProperties) {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.morphRenderingsResponse(this.chrome, mophedRenderingId, openProperties);
    }
  },

  personalize: function(commandName) {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    Sitecore.PageModes.PageEditor.layoutDefinitionControl().value = Sitecore.PageModes.PageEditor.layout().val();
    Sitecore.PageModes.PageEditor.postRequest(commandName + "(uniqueId=" + this.uniqueId() +")");
  },

  presonalizationCompleted: function(modifiedConditions, sender) {    
    if (!Sitecore.LayoutDefinition.readLayoutFromRibbon()) {
      return;
    }
    var previousActiveCondition = $sc.first(this.getConditions(), function() {return this.isActive;});
    this.resetConditions();
    var activeCondition = $sc.first(this.getConditions(), function() {return this.isActive});
    var isActiveConditionModified = false;
    for (var i = 0; i < modifiedConditions.length; i++) {
      Sitecore.PageModes.Personalization.RenderingCache.removeCondition(this.chrome,  modifiedConditions[i]);
      if (modifiedConditions[i] == activeCondition.id) {
        isActiveConditionModified = true;
      }
    }
                      
    var activeConditionChanged = previousActiveCondition && activeCondition && previousActiveCondition.id !== activeCondition.id;
    if (activeConditionChanged || isActiveConditionModified) {
      var preserveCacheUpdating = true;                            
      this.changeCondition(activeCondition.id, sender, preserveCacheUpdating);
      return;
    }

    if (Sitecore.PageModes.ChromeManager.selectedChrome() != null) {
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();
    }
    else {
      Sitecore.PageModes.ChromeManager.select(this.chrome);
    }          
  },

  load: function() {    
    this.canUpdateRenderingCache = true;

    if (Sitecore.PageModes.Personalization) {        
      Sitecore.PageModes.ChromeControls.registerCommandRenderer("chrome:rendering:personalize", Sitecore.PageModes.ChromeTypes.Rendering.renderPersonalizationCommand, this);
    }

    this._variations = [];
    if (Sitecore.PageModes.Testing) {        
      Sitecore.PageModes.ChromeControls.registerCommandRenderer("chrome:rendering:editvariations", Sitecore.PageModes.ChromeTypes.Rendering.renderEditVariationsCommand, this);
              
      if (this.chrome.hasDataNode && this.chrome.data.custom.testVariations) {
        this._variations = this.chrome.data.custom.testVariations;
        if (Sitecore.PageModes.PageEditor.isTestRunning()) {
          this.setReadOnly();
        }
      }
    }

    this.queryCommands();
    this.saveHandler = $sc.proxy(this.onSave, this);
    this.resetHandler = $sc.proxy(this.onReset, this);
    Sitecore.PageModes.ChromeManager.chromesReseted.observe(this.resetHandler);
    Sitecore.PageModes.PageEditor.onSave.observe(this.saveHandler);    
  },

  queryCommands: function() {
    var morphCommand = $sc.first(this.chrome.commands(), function() { return this.click && this.click.toLowerCase().indexOf("chrome:rendering:morph") > -1; });
    var chrome = this.chrome;
    var placeholder = this.getPlaceholder();
    var hasVariations = this.hasVariations();
    if (morphCommand && placeholder) {
      var hasAllowedMorphingRenderings = false;
      var click = Sitecore.PageModes.Utility.parseCommandClick(morphCommand.click);
      var morphingRenderingsIds = click.params;
      
      for (var i = 0; i < morphingRenderingsIds.length; i++) {
        if (placeholder.type.renderingAllowed(morphingRenderingsIds[i])) {
          hasAllowedMorphingRenderings = true;
          break;
        }
      }
     
      //None of the morphing rendering is not allowed in this placeholder due to its setting. Don't show the morph command.
      if (!hasAllowedMorphingRenderings) {
        morphCommand.disabled = true;
      }       
    }
       
    var isPlaceholderDisabled = placeholder && !placeholder.isEnabled();   
      $sc.each(chrome.commands(), function() { 
        if (!this.click) return;
        var click = this.click.toLowerCase();
        if (click.indexOf("chrome:rendering:sort") > -1) {
          this.disabled = !Sitecore.PageModes.DesignManager.canMoveRendering(chrome);
        }

        if (click.indexOf("chrome:rendering:delete") > -1) {
          this.disabled = isPlaceholderDisabled || hasVariations;
        }
      });    
  },
      
  onHide: function() {
    this.base();
    if (this._sorting) {
      this.sortingEnd();
    }
  },

  onReset: function() {    
    this.queryCommands();
  },

  onSave: function() {
    this.canUpdateRenderingCache = false;
  },

  positionInPlaceholder: function() {    
    var placeholder = this.getPlaceholder();    
    return placeholder ? Sitecore.LayoutDefinition.getRenderingPositionInPlaceholder(placeholder.type.placeholderKey(), this.uniqueId()) : -1;    
  },

  changeCondition: function(id, sender, preserveCacheUpdating) {
    var fieldId;
    if (sender && sender.key() == "field")
    {
      fieldId = sender.type.id();
    }

    var conditions = this.getConditions();
    if (!preserveCacheUpdating) {
      this.updateConditionCache($sc.first(conditions, function() { return this.isActive; }));
    }
                         
    Sitecore.PageModes.ChromeManager.chromeUpdating.fire(this.chrome);
    Sitecore.PageModes.ChromeOverlay.showOverlay(this.chrome);
   
    var cachedElements = Sitecore.PageModes.Personalization.RenderingCache.getCachedCondition(this.chrome, id);
    if (cachedElements) {
      Sitecore.PageModes.ChromeHighlightManager.stop();      
      this.updateOnConditionActivation(id, cachedElements, fieldId);
      Sitecore.PageModes.ChromeHighlightManager.resume();
      return;
    }
        
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("activatecondition");
    options.data.renderingUniqueId = this.uniqueId(); 
    options.data.conditionId = $sc.toShortId(id);
    options.data.url = window.location.href;       
    options.context = this;
    options.beforeSend = $sc.noop();
    options.complete = $sc.noop();
    options.error = function(xhr, error) {
      console.error(xhr.statusText + ":" + error);
      this._endActivation("changecondition");
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();      
    };

    options.success = function(serverData) {               
        var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);        
        Sitecore.PageModes.ChromeHighlightManager.stop();
        if (data.url != null) {          
           this.getPlaceholder().type.loadRenderingFromUrl(data.url, $sc.proxy(function(callbackData) {
              if (callbackData.error == null) {                                                
                this.updateOnConditionActivation(id, callbackData.renderingElement.combined, fieldId);
              }
              else {
                console.error(callbackData.error);
                this._endActivation("changecondition");
                Sitecore.PageModes.ChromeManager.resetSelectionFrame();
              }

              Sitecore.PageModes.ChromeHighlightManager.resume();
            }, this)); 
        }
        else {            
          Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
          Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
          this.updateOnConditionActivation(id, $sc(data.html), fieldId);
          Sitecore.PageModes.ChromeHighlightManager.resume();
        }
    };

    $sc.ajax(options);
  },

  changeVariation: function(id, sender, preserveCacheUpdating) {
    var fieldId;
    if (sender && sender.key() == "field")
    {
      fieldId = sender.type.id();
    }
    
    if (!preserveCacheUpdating) {
      this.updateVariationCache($sc.first(this.getVariations(), function() { return this.isActive; }));
    }

    Sitecore.PageModes.ChromeManager.chromeUpdating.fire(this.chrome);
    Sitecore.PageModes.ChromeOverlay.showOverlay(this.chrome);
    var cachedElems = Sitecore.PageModes.Testing.RenderingCache.getCachedVariation(this.chrome, id);
    if (cachedElems) {
      Sitecore.PageModes.ChromeHighlightManager.stop();      
      this.updateOnVariationActivation(id, cachedElems, fieldId);
      Sitecore.PageModes.ChromeHighlightManager.resume();
      return;
    }

    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("activatevariation");
    options.data.renderingUniqueId = this.uniqueId(); 
    options.data.variationId = $sc.toShortId(id);
    options.data.url = window.location.href;       
    options.context = this;
    options.beforeSend = $sc.noop();
    options.complete = $sc.noop();
    options.error = function(xhr, error) {
      console.error(xhr.statusText + ":" + error);
      this._endActivation("changevariation");
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();      
    };

    options.success = function(serverData) {               
        var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);        
        Sitecore.PageModes.ChromeHighlightManager.stop();
        if (data.url != null) {          
           this.getPlaceholder().type.loadRenderingFromUrl(data.url, $sc.proxy(function(callbackData) {
              if (callbackData.error == null) {                                                
                this.updateOnVariationActivation(id, callbackData.renderingElement.combined, fieldId);
              }
              else {
                console.error(callbackData.error);
                this._endActivation("changevariation");
                Sitecore.PageModes.ChromeManager.resetSelectionFrame();
              }

              Sitecore.PageModes.ChromeHighlightManager.resume();
            }, this)); 
        }
        else {            
          Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
          Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
          this.updateOnVariationActivation(id, $sc(data.html), fieldId);
          Sitecore.PageModes.ChromeHighlightManager.resume();
        }
    };

    $sc.ajax(options);
  },

  onDelete: function (preserveData) {
    this.base(preserveData);
    if (!preserveData) {
      if (this.saveHandler) {
        Sitecore.PageModes.PageEditor.onSave.stopObserving(this.saveHandler);
      }

      if (this.resetHandler) {
        Sitecore.PageModes.PageEditor.onSave.stopObserving(this.resetHandler);
      }
    }   
  },
  
  renderingId: function() {
    return this.chrome.data.custom.renderingID;
  },
   
  sort: function() {        
    Sitecore.PageModes.DesignManager.sortingStart(this.chrome);
    this._sorting = true;
    
    Sitecore.PageModes.ChromeManager.selectionFrame().controls.hide();        
    Sitecore.PageModes.ChromeManager.moveControlFrame().show(this.chrome);
  },
  
  sortingEnd: function() {
    Sitecore.PageModes.DesignManager.sortingEnd();
    Sitecore.PageModes.ChromeManager.moveControlFrame().hide();
    this._sorting = false;
  },
  
  uniqueId: function() {
    return this.chrome.openingMarker().attr("id").substring(2);
  },
  
  update: function(data) {
    var html, updateChromeData = false;
    
    if ($sc.type(data) === "string") {
      html = data;
    }
    else {
      html = data.html;
      updateChromeData = data.updateChromeData;
    }
    
    if (!html) {
      throw "Argument 'html' cannot be empty";
    }

    var fragmnet = document.createDocumentFragment();
    var newElements = $sc(html).appendTo(fragmnet);        
    if (!newElements) {
      return;
    }

    var elements = this.elements($sc(newElements[0]));            
    this.chrome.onDelete(true);   
    /* todo: rewrite to avoid going too much into Chrome's responsibility. */
    if (updateChromeData) {
      var dataNode = this.dataNode(elements.opening);
      this.chrome.setData(dataNode);
      var marker = this.chrome.openingMarker();
      if (marker && dataNode) {
        // Dirty hack. Persist the chrome data html into a DOM node in order it could be successfully
        // placed into html cache.
        marker[0].innerHTML = dataNode[0].innerHTML;
      }      
    }
        
    this.chrome.empty();
    this.chrome.append(elements.content);                
    this.canUpdateRenderingCache = true;
  },

  updateConditionCache: function(condition) {
    if (!this.canUpdateRenderingCache) {
      return;
    }

    if (condition) {
      var nodes = this.chrome.elementsAndMarkers().clone(false,false);      
      Sitecore.PageModes.Personalization.RenderingCache.cacheCondition(this.chrome, condition, nodes);
    }
  },
  
  updateVariationCache: function(variation) {
    if (!this.canUpdateRenderingCache) {
      return;
    }

    if (variation) {
      var nodes = this.chrome.elementsAndMarkers().clone(false,false);
      Sitecore.PageModes.Testing.RenderingCache.cacheVariation(this.chrome, variation, nodes);
    }
  }, 
  
  updateOnConditionActivation: function(conditionId, markersAndElements, fieldId) {            
    var conditions = this.getConditions();
    for (var i = 0; i < conditions.length; i++) {
      if (conditions[i].id === conditionId) {
        conditions[i].isActive = true;
        Sitecore.PageModes.Personalization.ConditionStateStorage.setConditionActive(this.uniqueId(), conditionId);        
      }
      else {
        conditions[i].isActive = false;
      }
    }
    
    this._startActivation(markersAndElements, "changecondition", fieldId);       
  },

  updateOnVariationActivation: function(variationId, markersAndElements, fieldId) {
    for (var i = 0; i < this._variations.length; i++) {
      this._variations[i].isActive = this._variations[i].id === variationId;
    }
   
    this._startActivation(markersAndElements, "changevariation", fieldId);
  },

  _endActivation: function(startReason) {
    Sitecore.PageModes.ChromeManager.onChromeUpdated(this.chrome, startReason);
    Sitecore.PageModes.ChromeOverlay.hideOverlay();
  },

  _startActivation: function(markersAndElements, reason, fieldId) {
    var delay = Sitecore.PageModes.ChromeOverlay.getShowingDuration();       
    
    setTimeout($sc.proxy(function() {   
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = true;
      Sitecore.PageModes.ChromeHighlightManager.stop();          
      Sitecore.PageModes.ChromeManager.select(null);                       
      
      this.update({html: markersAndElements, updateChromeData: this.selectable()});                                                  
      
      Sitecore.PageModes.ChromeManager.resetChromes();
      
      this.chrome.reload();
      if (!fieldId) {
        Sitecore.PageModes.ChromeManager.select(this.chrome); 
      }
           
      // If condition activation was initiated by the the field try to select it.
      if (fieldId) {           
        var deep = true;
        var field = this.chrome.getChildChromes(function() {
                                                return this && this.key() == "field" && 
                                                        this.isEnabled() && this.type.id() == fieldId;
                                                }, deep)[0];
        if (field) {
          Sitecore.PageModes.ChromeManager.select(field);       
        }
        else {
          Sitecore.PageModes.ChromeManager.select(this.chrome);       
        }                                   
      }
                  
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = false;
      Sitecore.PageModes.ChromeHighlightManager.resume();
      this._endActivation(reason);
    }, this), delay); 
  }
},
{
  renderPersonalizationCommand : function(command, isMoreCommand, chromeControls) {        
    command.enabledWhenReadonly = true;    
    command.disabled = false;
    var showVariations = this.hasVariations();
    if (showVariations || !Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
      command.disabled = true;
      if (showVariations) {
        return false; 
      }          
    }
        
    if (isMoreCommand) {
      return false;
    }

    if (this.getConditions().length <= 1) {
      if (!Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
        return null;        
      }

      return false;
    }

    if (!Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar) {      
      Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar = new Sitecore.PageModes.RichControls.Bar(
        new Sitecore.PageModes.Personalization.Panel(),
        new Sitecore.PageModes.Personalization.DropDown()
      );
    }
    
    var context = new Sitecore.PageModes.Personalization.ControlsContext(this.chrome, chromeControls, command);
    if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
      return Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.renderHidden(
        context,        
        Sitecore.PageModes.Texts.Analytics.ChangeCondition, 
        "/sitecore/shell/~/icon/Office/16x16/users3.png");
    }
    
    var ctrl = Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.render(context)
    chromeControls.commands.append(ctrl);     
    return false;    
  },

  renderEditVariationsCommand: function (command, isMoreCommand, chromeControls) {
    command.enabledWhenReadonly = true;
    command.disabled = false;
    var showConditions = this.hasConditions();
    if (showConditions || Sitecore.PageModes.PageEditor.isTestRunning() || !Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      command.disabled = true;
      if (showConditions) {
        return false;
      }
    }

    if (isMoreCommand) {
      return false;
    }
   
    if (this.getVariations().length <= 1) {      
      if (!Sitecore.PageModes.PageEditor.isTestingAccessible()) {
        return null;        
      }

      return false;
    }

    if (!Sitecore.PageModes.ChromeTypes.Rendering.testingBar) {      
      Sitecore.PageModes.ChromeTypes.Rendering.testingBar = new Sitecore.PageModes.RichControls.Bar(
        new Sitecore.PageModes.Testing.Panel("scTestingPanel"),
        new Sitecore.PageModes.Testing.DropDown()
      );
    }
    
    var context = new Sitecore.PageModes.Testing.ControlsContext(this.chrome, chromeControls, command);
    if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
      return Sitecore.PageModes.ChromeTypes.Rendering.testingBar.renderHidden(
        context,
        Sitecore.PageModes.Texts.Analytics.ChangeVariation        
       );
    }
    
    var ctrl = Sitecore.PageModes.ChromeTypes.Rendering.testingBar.render(context)
    chromeControls.commands.append(ctrl);     
    return false;
  }
});