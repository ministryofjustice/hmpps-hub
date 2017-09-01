if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* The enumeration for availablle page editor's capabilities. 
* @enum {String}
*/
Sitecore.PageModes.Capabilities = {
  design: "design",
  edit: "edit",
  personalization: "personalization",
  testing: "testing"
};


/**
* @static
* @class represents Page Editor
*/
Sitecore.PageModes.PageEditor = new function() {
  /** @private */
  this._capabilities = [];  
  this.onSave = new Sitecore.Event();
  this.onWindowScroll = new Sitecore.Event();
  this.onCapabilityChanged = new Sitecore.Event();
  this.onControlBarStateChanged = new Sitecore.Event();
  this.notificationBar = new Sitecore.PageModes.NotificationBar(); 
  this.onLoadComplete = new Sitecore.Event();
    
  /**
  * @description enables/disables Page Editor's capability. @see Sitecore.PageModes.Capabilities
  * @param {String} capability The name of the capability
  * @param {Boolean} enabled Determines if capability should be enabled or disabled
  */
  this.changeCapability = function(capability, enabled) {
    if (!this.editing()) {
        return;
    }
        
    if (!enabled) {         
      this._capabilities = $sc.grep(this._capabilities, function (val) {
        return val != capability;
      });
    }
    else {      
      this._capabilities.push(capability);
    }

    this.onCapabilityChanged.fire();
  };

  /**
  * @description enables/disables Page Editor's controls highlight.  
  * @param {Boolean} enabled Determines if highlight should be enabled or disabled
  */
  this.changeShowControls = function(enabled) {
    if (!this.editing()) {
        return;
    }

    if (!enabled) {
      Sitecore.PageModes.ChromeHighlightManager.deactivate();
    }
    else {
      Sitecore.PageModes.ChromeHighlightManager.activate();
    } 
  };
    

  this.changeShowOptimization = function (enabled) {
      if (!this.editing()) {
          return;
      }

      if (!enabled) {
          Sitecore.PageModes.ChromeOptimizationView.deactivate();
      }
      else {
          Sitecore.PageModes.ChromeOptimizationView.activate();
      }
  };

  this.changeVariations = function(combination, selectChrome) {    
    Sitecore.PageModes.ChromeManager.batchChangeVariations(combination, selectChrome);              
  };

  this.debug = function() {
    return window.location.href.indexOf("pedebug=1") >= 0 || this._debug;
  };

  this.editVariationsComplete = function(controlId, params) {
    var component = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { 
      return this.controlId() === controlId;
    });

    if (component) {
      Sitecore.PageModes.ChromeManager.select(component);      
      component.handleMessage("chrome:rendering:editvariationscompleted", params); 
    }
  };

  /**
  * @description Gets the currently enabled capabilities. See @Sitecore.PageModes.Capabilities
  * @returns {String[]} The names of enbled capabilities
  */
  this.getCapabilities = function() {
    return this._capabilities;
  };

  this.getTestingComponents = function() {
    var result = {};
    $sc.each(Sitecore.PageModes.ChromeManager.chromes(), function() {
      if (this.key() === "rendering") {
        var variations = this.type.getVariations();
        if (variations.length > 0) {
          var arr = [];
          $sc.each(variations, function() {
            arr.push({id: this.id, isActive: this.isActive, value: this.value});            
          });

          result[this.type.uniqueId()] = arr;
        }
      }
    });

    return result;
  };

  /**
  * @description Indicates if analytics is enabled
  * @returns {Boolean} The value indicating if analytics is enabled
  */
  this.isAnalyticsEnabled = function() {
    return !!Sitecore.WebEditSettings.anlyticsEnabled;
  };

  /**
  * @description Indicates if the ribbon is displayed in fixed position (on top of the screen), or is running in the legacy placeholder mode. 
  * @return {Boolean} The value indicating if the ribbon is fixed.
  */
  this.isFixedRibbon = function() {
    var ribbon = $sc(this.ribbon());

    return ribbon.hasClass("scFixedRibbon");
  };

  /**
  * @description Indicates if there are unsaved changes in Page Editor
  * @returns {Boolean} The value indicating if there are unsaved changes
  */
  this.isModified = function() {
    var form = this.ribbonForm();
    if (!form) {
      return !!this.modified;
    }

    return form.modified;
  };

  this.isTestRunning = function() {
    if (this._isTestRunning != null) {
      return this._isTestRunning;
    }
        
    var testRunningFlag = document.getElementById("scTestRunningFlag");
    if (!testRunningFlag) {
      this._isTestRunning = false;
      return false;
    }

    this._isTestRunning = testRunningFlag.value === "true";
    return this._isTestRunning;
  };

  /**
  * @description Indicates if Page Editor editing is allowed.
  * @returns {Boolean} The value indicating if Page Editor editing is allowed.
  */
  this.editing = function() {
    return !!Sitecore.WebEditSettings.editing;
  };
  
  this.controlBarStateChange = function() {
     Sitecore.PageModes.ChromeManager.resetSelectionFrame();
     this.onControlBarStateChanged.fire();
  };

  /**
  * @description Defines if personalization bar is visible
  * @returns {Boolean} value indicating whether personalization bar is visisble or not
  */
  this.isControlBarVisible = function() {
    var ribbon = this.ribbon();
    return ribbon && ribbon.contentWindow && ribbon.contentWindow.scControlBar;
  };

  /**
  * @description Defines if Page Editor is loaded
  * @returns {Boolean} value indicating whether Page Editor is loaded or not
  */
  this.isLoaded = function() {
    return !!this._isLoaded;
  }; 

  /**
  * @description Defines if personalization feature is accesible for the user
  * @returns {Boolean} value indicating whether personalization feature is enabled
  */
  this.isPersonalizationAccessible = function() {
     return $sc.inArray(Sitecore.PageModes.Capabilities.personalization, this._capabilities) > -1;
  };

  /**
  * @description Defines if testing feature is accesible for the user
  * @returns {Boolean} value indicating whether testing feature is enabled
  */
  this.isTestingAccessible = function() {
     return $sc.inArray(Sitecore.PageModes.Capabilities.testing, this._capabilities) > -1;
  };

  /**
  * @description Gets the id of the context item
  * @returns {String} The short id
  */
  this.itemId = function() {
    return $sc("#scItemID").val()
  };

  this.itemID = function () {
    var itemId = this.itemId();
    if (itemId && itemId.length == 32) {
      return "{" + Sitecore.PageModes.PageEditor.itemId().substring(0, 8) + "-"
        + Sitecore.PageModes.PageEditor.itemId().substring(8, 12) + "-"
        + Sitecore.PageModes.PageEditor.itemId().substring(12, 16) + "-"
        + Sitecore.PageModes.PageEditor.itemId().substring(16, 20) + "-"
        + Sitecore.PageModes.PageEditor.itemId().substring(20, 32) + "}";
    }
  };

   /**
  * @description Gets the content language
  * @returns {String} The language
  */
  this.language = function() {
    return $sc("#scLanguage").val()
  };

  /**
  * @description Gets the language CSS class
  * @returns {String} The language CSS class
  */
  this.languageCssClass = function () {
    return $sc("#scLanguageCssClass").val()
  };

  /**
  * @description Gets the client device id
  * @returns {String} The device id
  */
  this.deviceId = function() {
    return $sc("#scDeviceID").val();
  };

  /**
  * @description Gets the current layout definition
  * @returns {String} The Layout definition (in JSON notation)
  */
  this.layout = function() {
    return $sc("#scLayout").val();
  };

  /**
  * @description Action performed on saving action.  
  */
  this.onSaving = function() {    
    this.notificationBar.removeNotification("fieldchanges");
    this.notificationBar.show();
    this.onSave.fire();
  };

  /**
  * @description Makes a request to Sitecore
  * @param request Request parameters
  * @param {Function} [callback] A callback function to be called after request is complete.
  * @param {Boolean} [async=true] The value indicating if the request should be asynchronous.
  */
  this.postRequest = function(request, callback, async) {
    var form = this.ribbonForm();
    if (!form) {
      return;
    }

    isAsync = (typeof (async) == 'undefined') ? true : async;
    form.postRequest("", "", "", request, callback, isAsync);
  };

  /**
  * @description Refreshes the ribbon  
  */
  this.refreshRibbon = function() {
    this.postRequest("ribbon:update", null, true);
  };

  /**
  * @description Gets the Page Editor's ribbon instance
  * @returns {Node} The iframe containing the ribbon.
  */
  this.ribbon = function() {
    return $sc("#scWebEditRibbon")[0];
  };

  this.ribbonBody = function () {
    var ribbon = this.ribbon();
    if (ribbon && ribbon.contentWindow && ribbon.contentWindow.jQuery) {
      return ribbon.contentWindow.jQuery(window.document.body);
    }

    return null;
  };

  this.ExperienceEditor = function() {
    return window.top.ExperienceEditor;
  };

  this.layoutDefinitionControl = function () {
    var iframeLayoutDefinition = Sitecore.PageModes.PageEditor.ribbon().contentWindow.$("scLayoutDefinition");
    if (iframeLayoutDefinition.value == null) {
      return $sc("#scLayoutDefinition")[0];
    }

    return iframeLayoutDefinition;
  };

  this.layout = function () {
    return $sc("#scLayout");
  };

  /**
  * @description Gets the ribbon's Sitecore form instance
  * @returns {scSitecore} The sitecore form. @see scSitecore.
  */
  this.ribbonForm = function() {
    var ribbon = this.ribbon();
    if (!ribbon) {
      return null;
    }
    
    if (!ribbon.contentWindow) {
      return null;
    }

    if (!ribbon.contentWindow.scForm) {
      ribbon.contentWindow.scForm = scForm;
    }

    return ribbon.contentWindow.scForm;
  };
    
  /**
  * @description Saves the changes
  * @param {String} postaction The post action to be performed afer saving.
  */
  this.save = function(postaction) {    
    var command = "webedit:save";
    if (postaction) {
      command += "(postaction=" + postaction + ")";
    }
        
    this.onSaving();
    this.postRequest(command, null, false);
  };
  
  this.selectElement = function(id) {
    var element = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { return this.controlId() === id; });
    if (element) {           
      Sitecore.PageModes.ChromeManager.scrollChromeIntoView(element);
      Sitecore.PageModes.ChromeManager.select(element);
      return element;
    }

    return null;
  };

  this.highlightElement = function(id) {
    var element = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { return this.controlId() == id; });
    if (element) {
      element.showHover();
      return element;
    }

    return null;
  };

  this.stopElementHighlighting = function(id) {
    var element = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { return this.controlId() == id; });
    if (element) {
      element.hideHover();
      return element;
    }

    return null;
  };
  
  /**
  * @description Shows the notification bar  
  */
  this.showNotificationBar = function() {    
    if (!this.notificationBar.hasPosition()) {
      var ribbon = this.ribbon();
      if (ribbon) {
        var $ribbon = $sc(ribbon);
        var top = 0;
        if ($ribbon.hasClass("scFixedRibbon")) {
          var height = $ribbon.outerHeight();          
          top = parseInt($ribbon.css("top")) + height;
        }

        this.notificationBar.setPosition({top: top, left: 0});
      }      
    }
        
    this.notificationBar.show();
  };

  /**
  * @description Updates the specified field with specified values
  * @param {String} id - The id. (i.e "fld_ItemId_filedId_lang_ver")
  * @param {String} htmlValue - The field's rendered value
  * @param {String} plainValue - The field's raw value
  * @param {Boolean} [preserveInnerContent] - Instead of setting whole innerHtml only setting needed attributes    
  */
  this.updateField = function(id, htmlValue, plainValue, preserveInnerContent) {
    Sitecore.PageModes.ChromeManager.updateField(id, htmlValue, plainValue, preserveInnerContent);
  };
 
  /**
  * @description Sets a value indicating if Page editor has unsaved  changes or not
  * @param {Boolean} value indicating if Page Editor has unsaved changes
  */
  this.setModified = function(value) {   
    this.modified = value;
    var form = this.ribbonForm();
    if (!form) {
      return;
    }

    form.setModified(value);
  };

  /**
    @description Shows all places in a page where a new rendering can be inserted
  */
  this.showRenderingTargets = function() {
    Sitecore.PageModes.DesignManager.insertionStart();
  };
       
  /** @private */
  this._fixStyles = function() {
    if ($sc.browser.msie) {
      return;
    }

    // min-height and min-width are added to prevent browser form setting height and with of contenteditable elements to 0 when they have no content.        
    $sc.util().addStyleSheet("body .scWebEditInput { display: inline-block;}\r\n.scWebEditInput[contenteditable=\"true\"] { min-height: 1em;}");
  };
  /** @private */
  this._initCapabilities = function() {            
    var capabilities =  document.getElementById("scCapabilities");
    var enabledCapabilities = [];
    if (capabilities && capabilities.value) {
      enabledCapabilities = capabilities.value.split("|");
    }
    
    for (var n in Sitecore.PageModes.Capabilities) {        
      if ($sc.inArray(Sitecore.PageModes.Capabilities[n], enabledCapabilities) > -1) {
        this._capabilities.push(Sitecore.PageModes.Capabilities[n]);
      }
    }    
  };

   /** @private */  
  this.onDocumentClick = function (e) {
    e = e || window.event;
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    // fix for copy-paste problem in Firefox
    if (ribbon != null) {
      var browser = typeof (scForm) != "undefined" ? scForm.browser : null;
      if (!browser) {
        browser = ribbon.contentWindow.scForm.browser;
      }

      if (browser.isFirefox) {
        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
          isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera 
          isRightMB = e.button == 2;

        if (isRightMB) {
          return;
        }
      }
    }

    Sitecore.PageModes.ChromeManager.select(null);
  };
  /** @private */
  this.onDomLoaded = function() {
    if (!this.editing()) {
      return;
    }

    this._fixStyles();
    this._initCapabilities();
    Sitecore.PageModes.ChromeManager.init();
    var $doc = $sc(document);
    $doc.click($sc.proxy(this.onDocumentClick, this));
    $doc.keydown($sc.proxy(this.onKeyDown, this));
    $doc.keyup($sc.proxy(this.onKeyUp, this));
    if ($sc.browser.mozilla) {
       $doc.keypress($sc.proxy(this.onKeyPress, this));      
    }    

    $sc(".scWebEditInput[contenteditable='true']").live("mouseup", function(e) {
      if (e.target.tagName.toUpperCase() === "IMG") {
        fixImageParameters(e.target, Sitecore.WebEditSettings.mediaPrefixes.split("|"));
      }
      else {
        $sc.each($sc(e.target).find("img"), function(index, value) {
          fixImageParameters(value, Sitecore.WebEditSettings.mediaPrefixes.split("|"));
        })
      }
    });
  };
  /** @private */
  this.onKeyDown = function(e) {     
    //Escape    
    if (e.keyCode == 27) {
      Sitecore.PageModes.ChromeManager.hideSelection();
      return;      
    }

    //Ctrl+S
    if (e.keyCode == 83 && e.ctrlKey) {            
      e.preventDefault();            
      this.save();
      return;
    }

    if (e.keyCode == 17 && !this.ctrlPressed) {
      this.ctrlPressed = true;
      Sitecore.PageModes.ChromeManager.hoverFrame().deactivate();
      Sitecore.PageModes.ChromeManager.selectionFrame().deactivate();
      return;
    }
    
    // Workaround for browser's shortcuts, e.q. Ctrl + Shift + Del
    // In such cases keydown event is fired, but keyup is not, hence Ctrl got stuck.
    if (e.ctrlKey && e.keyCode != 17 && this.ctrlPressed) {      
      this.ctrlPressed = false;
      Sitecore.PageModes.ChromeManager.hoverFrame().activate();
      Sitecore.PageModes.ChromeManager.selectionFrame().activate();
      return;
    }    
  };
  /** @private */
  this.onKeyPress = function(e) {         
    // Preventing FF from showing standard "Save as" dialog when clicking <Ctrl>+<S>   
    if (e.ctrlKey && String.fromCharCode(e.which).toLowerCase() == "s") {          
      e.preventDefault();
    }
  };
  /** @private */
  this.onKeyUp = function(e) {
    if (e.keyCode == 17) {
      this.ctrlPressed = false;
      Sitecore.PageModes.ChromeManager.hoverFrame().activate();
      Sitecore.PageModes.ChromeManager.selectionFrame().activate();
    }
        
    if (e.keyCode == 27) {
      if (Sitecore.PageModes.DesignManager.sorting) {
        Sitecore.PageModes.DesignManager.sortingEnd();
      }

      if (Sitecore.PageModes.DesignManager.inserting) {
        Sitecore.PageModes.DesignManager.insertionEnd();
      }
    }    
  };
  /** @private */
  this.onPageLoaded = function() {
    if (Sitecore.WebEditSettings.disableAnimations) {
      $sc.fx.off = true;
    }

    var ribbon = this.ribbon();   
    if (!ribbon) {
      return;
    }        
    
    $sc(ribbon.contentWindow).resize($sc.proxy(this.onRibbonResize, this));

    if (typeof (ribbon.contentWindow) != "undefined" && ribbon.contentWindow) {
      if (this.editing()) {
        $sc(window).bind("scroll", $sc.proxy(this.onWindowScroll.fire, this.onWindowScroll));
        if (typeof(ribbon.contentWindow.scShowControls) != "undefined" && ribbon.contentWindow.scShowControls) {
          setTimeout($sc.proxy(Sitecore.PageModes.ChromeHighlightManager.activate, Sitecore.PageModes.ChromeHighlightManager), 100);
        }

        if (typeof (ribbon.contentWindow.scShowOptimization) != "undefined" && ribbon.contentWindow.scShowOptimization) {
          setTimeout($sc.proxy(Sitecore.PageModes.ChromeOptimizationView.activate, Sitecore.PageModes.ChromeOptimizationView), 100);
        }
      }

      var $ribbonDoc = $sc(ribbon.contentWindow.document);
      $ribbonDoc.keyup($sc.proxy(this.onKeyUp, this));
      $ribbonDoc.keydown($sc.proxy(this.onKeyDown, this));
    }

    // Hide loading indicator
    $sc("#scPeLoadingIndicator").hide();
    this._isLoaded = true;
    this.onLoadComplete.fire();      
  };
  /** @private */
  this.onRibbonResize = function() {
    if (!this.editing() || Sitecore.PageModes.DesignManager.sorting) {
      return;
    }

    if (this.notificationBar.visible()) {      
      this.notificationBar.resetPosition();
      this.showNotificationBar();
    }
    
    Sitecore.PageModes.ChromeManager.resetSelectionFrame();   
    Sitecore.PageModes.ChromeHighlightManager.planUpdate();
  };

  $sc(document).ready($sc.proxy(this.onDomLoaded, this));
  $sc(window).load($sc.proxy(this.onPageLoaded, this));      
};