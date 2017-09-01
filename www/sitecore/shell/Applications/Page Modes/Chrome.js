if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

Sitecore.PageModes.Chrome = Base.extend({
  constructor: function(domElement, type) {
    this._originalDOMElement = domElement;

    this.type = type;
    type.chrome = this;
    this._parseElements();
    this._level = -1;
    var dataNode = this.type.dataNode(domElement);
    this.setData(dataNode);
    this.data.errors = [];
    this.data.hasFieldErrors = false;
    this.data.currentChromeErrorClass = "";
    // force init display name. Chrome data may change(i.e. when changing variations or conditions), but the name 
    // of the chrome should be the same during all the lifetime.
    this.displayName();
    this.position = new Sitecore.PageModes.Position(this);
    this._clickHandler = $sc.proxy(this._clickHandler, this);
    this._mouseEnterHandler = $sc.proxy(this._mouseEnterHandler, this);
    this._mouseLeaveHandler = $sc.proxy(this._mouseLeaveHandler, this);

    $sc.util().log("initialized new chrome: " + this.type.key());
    this.removeSpansFromChromeValue(domElement[0]);
  },

  removeSpansFromChromeValue: function (chromeElement) {
    if (!chromeElement) {
      return;
    }


    if (chromeElement.nodeName != "SPAN") {
      return;
    }


    var fieldType = chromeElement.getAttribute("scFieldType");
    if (!fieldType || fieldType != "rich text") {
      return;
    }

    chromeElement.addEventListener('DOMNodeInserted', function(e) {
      if (!e.target.tagName) {
        return;
      }

      if (e.target.tagName != "FONT") {
        return;
      }

      if (Sitecore.PageModes.Utility.isIE) {
        return;
      }

      var parentElement = e.target.parentNode;
      parentElement.removeChild(e.target);

      parentElement.innerHTML = "<br />";
      var range = document.createRange();
      var selection = window.getSelection();
      range.setStart(parentElement, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  },

  /* DOM manipulation */

  after: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.closingMarker().after(elements);
  },

  append: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.closingMarker().before(elements);
  },

  before: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.openingMarker().before(elements);
  },

  empty: function() {
    this.element.remove();
  },

  prepend: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.openingMarker().after(elements);
  },

  update: function(elements) {
    if (!(elements instanceof $sc)) {
      throw "Unexpected elements";
    }

    this.empty();
    this.append(elements);
    this.element = elements;
  },

  /* End DOM manipulation */

  ancestors: function() {
    var result = new Array();

    var parent = this.parent();

    while (parent) {
      result.push(parent);
      parent = parent.parent();
    }

    return result;
  },

  setValidStatus: function (isValid, error) {
    this.data.hasFieldErrors = isValid;
    if (error) {
      this.data.errors.push(error);
    }

    if (this.data.currentChromeErrorClass != "") {
      this.element.removeClass(this.data.currentChromeErrorClass);
    }

    var notValidChromeClassName = "chromeWithErrors";
    if (isValid) {
      this.element.removeClass(notValidChromeClassName);
      this.data.errors = [];
    } else {
      this.element.addClass(notValidChromeClassName);
      var maxErrorPriority = this.getMaxErrorPriority();
      var priorityClassName = "warningChromeError";
      if (maxErrorPriority < 3) {
        priorityClassName = "notificationChromeError";
      }

      if (maxErrorPriority == 3) {
        priorityClassName = "warningChromeError";
      }

      if (maxErrorPriority > 3) {
        priorityClassName = "errorChromeError";
      }

      this.data.currentChromeErrorClass = priorityClassName;
      this.element.addClass(priorityClassName);
    }
  },

  getMaxErrorPriority: function () {
    var priorities = [];
    for (var e = 0; e < this.data.errors.length; e++) {
      priorities.push(this.data.errors[e].Priority);
    }

    return Math.max.apply(null, priorities);
  },

  attachEvents: function() {
    this.element.click(this._clickHandler);
    this.element.mouseenter(this._mouseEnterHandler);
    this.element.mouseleave(this._mouseLeaveHandler);
  },

  detachEvents: function() {
    this.element.unbind("click", this._clickHandler);
    this.element.unbind("mouseenter", this._mouseEnterHandler);
    this.element.unbind("mouseleave", this._mouseLeaveHandler);
  },

  detachElements: function() {
    this.element.data("scChromes", null);
  },

  // Returns currently enabled child chromes.  
  descendants: function() {          
     var deep = true;
     return this.getChildChromes(function() { return this && this.isEnabled();}, deep);                    
  },

  // Returns currently enabled child chromes, immediate descentants of the current chrome.
  // The returning value is cached.
  children: function() {
    if (!this._children) {      
      this._children = this.getChildChromes(function() { return this && this.isEnabled();});            
    }

    return this._children;
  },
  
  closingMarker: function() {
    return this._closingMarker;
  },

  commands: function () {
    var commands = this.data.commands ? this.data.commands : new Array();
    return this.filterCommands(commands);
  },

  restrictedCommands: [],

  filterCommands: function (commands) {
    var filteredCommands = new Array();
    for (var i = 0; i < commands.length; i++) {
      var command = commands[i];
      if ($sc.inArray(command.click, this.restrictedCommands) < 0) {
        filteredCommands.push(command);
      }
    }

    return filteredCommands;
  },

  controlId: function() {
    return this.type.controlId();
  },

  displayName: function() {
    if (this._displayName != null) {
      return this._displayName;
    }

    this._displayName = this.data.displayName ? this.data.displayName : Sitecore.PageModes.Texts.NotSet;
    return this._displayName;
  },

  elementsAndMarkers: function() {
    return this.openingMarker().add(this.element).add(this.closingMarker());
  },

  expand: function() {
    var excludeFakeParents = true;
    var parent = this.parent(excludeFakeParents);
    if (parent) {
      Sitecore.PageModes.ChromeManager.select(parent);
    }
    else {
      console.error("no parent - nowhere to expand");
    }
  },
    
  // Returns child chromes, immediate descentants of the current chrome, which match the specified predicate.
  // If deep = true, all descendant chromes are returned, otherwise only immediate children are returned.
  getChildChromes: function(predicate, deep) {    
    if (typeof(predicate) == "undefined" || !predicate) {
      predicate = function() { return this; };
    }
   
    var result = [];

    /* first checking all DOMElements that are a part of this chrome to see if they have other chromes associated with them */
    for (var i = 0; i < this.element.length; i++) {
      var part = $sc(this.element[i]);

      var chromes = part.data("scChromes");
      if (!chromes || chromes.length == 0) {
        continue;
      }
      
      if (chromes.length < 2) {
        continue;
      }

      var index = $sc.inArray(this, chromes);
      if (index < 0) {
        throw "The chrome must be present in scChrome collections of its DOM elements";
      }

      /* if the chrome is last in collection, it means it doesn't have any children bound to same DOM elements */
      if (index == chromes.length - 1) {
        continue;
      }

      for (var j = index + 1; j < chromes.length; j++) {
        var childChrome = chromes[j];
        
        if (!predicate.call(childChrome, childChrome)) {
          continue;
        }
        
        if ($sc.inArray(childChrome, result) >= 0) {
          continue;
        }
        
        result.push(childChrome);        
      }
    }
    
    /* then we traverse the DOM tree to get child (or descendant) chromes */
    var selector = ".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']";
    
    var elements = this.element.find(selector);
    var l = elements.length;     
     
    for (var i = 0; i < l; i++) {
      var currentElem = $sc(elements[i]);
      var chrome = Sitecore.PageModes.ChromeManager.getChrome(currentElem);
        
      if (!deep) {
        /* if dom node's parent chrome is not this chrome, it means there is a chrome in between, so we disregard it a descendant, but not a child. */
        if (chrome.parent(false, false) != this) {
          continue;
        }
      }  
      
      if (!chrome || !predicate.call(chrome, chrome)) {
        continue;
      }

      result.push(chrome);
    }
   
    return result;
  },

  handleMessage: function(message, params, sender) {   
    this.type.handleMessage(message, params, sender);
    Sitecore.PageModes.ChromeManager.handleRegisteredMessage(message, params, sender);
  },

  icon: function() {
    return this.type.icon();
  },

  isEnabled: function() {
    return this.type.isEnabled();
  },

  isReadOnly: function() {
    return this.type.isReadOnly();
  },

  setReadOnly: function() {
    this.type.setReadOnly();
  },
  
  isFake: function() {
    if (this.key() == "field") {
      var childField = $sc.first(this.children(), function() { return this.key() == "field"; });
      return !!childField;
    }

    return false;
  },

  key: function() {
    return this.type.key();
  },

  level: function() {
    if (this._level <= 0) {           
      this._level = this.ancestors().length + 1;
    }

    return this._level;
  },

  load: function() {
    this.attachEvents();       
    if (this.type.load) {
      this.type.load();
    }

    var parent = this.parent(false, false);
    if (parent != null && parent.isReadOnly()) {
      this.setReadOnly();
    }

    this._fixCursor();
  },

  openingMarker: function() {
    return this._openingMarker;
  },

  setData: function(dataNode) {
    if (dataNode && $sc.trim(dataNode.text()) !== "") {
      this.hasDataNode = true;     
      var json = dataNode.get(0).innerHTML;      
      this.data = $sc.evalJSON(json);
    }
    else {
      this.hasDataNode = false;
      this.data = {};
      this.data.custom = {};      
    }
  },

  showHover: function() {
    if (!this._selected) {
      Sitecore.PageModes.ChromeManager.hoverFrame().show(this);
    }
  },
 
  hideHover: function() {
    Sitecore.PageModes.ChromeManager.hoverFrame().hide();
  },
  
  //excludeFake determines if we should consider fake parents (if field chrome A has nested field chrome B, then A is fake parent)
  //enabledOnly - defines if only enabled chromes may be retuned as a parent
  parent: function(excludeFake, enabledOnly) {
    var includeDisabled = false;
    if (typeof(enabledOnly) != "undefined") {
      includeDisabled = !enabledOnly;
    }

    var chrome = null;

    // checks if more then one chrome is associated with a given dom node. if so, return next chrome in stack.
    var chromes = this.element.data("scChromes");

    if (typeof(chromes) == "undefined") {
      if (this.element.length > 0) {
        console.warn("Chrome elements do not have scChrome collection assigned");
        console.log(this.element);
      }

      chromes = new Array();
    }

    if (chromes.length > 1) {
      var index = $sc.inArray(this, chromes);
      if (index < 0) {
        throw new "A chrome must be found in the elements chrome collection";
      }

      if (index > 0) {
        if (includeDisabled) {
          return chromes[index - 1];
        }

        var ancestor = $sc.last(chromes.slice(0 , index), function() { return this.isEnabled(); });
        if (ancestor) {
          return ancestor;
        } 
      }
    }

    // traverses DOM tree to find parent chromes
    var node = this.element.parent();
    var partOf = "";

    while (node.length > 0) {
      partOf = node.attr("sc-part-of");
        
      if (typeof(partOf) != "undefined" && partOf.length > 0) {
        chrome = Sitecore.PageModes.ChromeManager.getChrome(node);
        if (!chrome) {
          console.error("Any [sc-part-of] node is expected to have its scChromes collection");
          console.log(node.data("scChromes"));
          return null;
        }

        if (partOf == "field") {
          if (includeDisabled || chrome.isEnabled()) {
            if (excludeFake) {
              if (!chrome.isFake()) return chrome;
            }
            else return chrome;
          }

        }
        else {
          if (includeDisabled || chrome.isEnabled()) return chrome;
          return chrome.parent(excludeFake, enabledOnly);
        }
      }

      node = node.parent();
    }

    return null;
  },

  showHighlight: function (type) {
    if (this._selected) return;
    
    if (!this._highlight) {
      this._highlight = type;
    }
    
    if (!this._highlight) {
      this._highlight = new Sitecore.PageModes.HighlightFrame();
    }

    this._highlight.show(this);
  },

  hideHighlight: function() {
    if (this._highlight) {      
      this._highlight.hide();
    }
  },
  
  showSelection: function() {
    this._selected = true;
    this.hideHover();
    this.hideHighlight();
        
    if (this.type.onShow) {
      this.type.onShow();
    }
  },

  hideSelection: function() {
    this._selected = false;
    if (Sitecore.PageModes.ChromeHighlightManager.isHighlightActive(this)) {
      this.showHighlight();
    }
        
    if (this.type.onHide) {
      this.type.onHide();
    }
  },

  getContextItemUri: function() {
    return this.type.getContextItemUri();
  },

  previous: function() {
    if (!this.parent()) {
      return;
    }

    var children = this.parent().children();

    var index = $sc.inArray(this, children);
    if (index == 0) {
      return;
    }

    return children[index - 1];
  },

  next: function() {
    if (!this.parent()) {
      return;
    }

    var children = this.parent().children();

    var index = $sc.inArray(this, children);
    if (children.length <= index + 1) {
      return;
    }

    return children[index + 1];
  },

  reload: function() {
    this._fixCursor();

    if (this.type.reload) {
      this.type.reload();
    }
  },
  
  reset: function() {
    this._children = null;
    
    this.detachEvents();

    this._parseElements();
    
    this.attachEvents();
    
    this.position.reset();
  },

  remove: function() {
    this.onDelete();
    this.openingMarker().remove();
    this.element.remove();
    this.closingMarker().remove();
    this._removed = true;    
  },

  removed: function() {
    return this._removed ? true : false;
  },
    
  onDelete: function(preserveData) {
    if (this._highlight) {
      this._highlight.dispose();
    }
        
    this.type.onDelete(preserveData);
  },
  
  _fixCursor: function() {
    var l = this.element.length, 
        i = 0,
        isEnabled = this.isEnabled();
    
    for (i; i < l; i++) {
      var element = $sc(this.element[i]);
      var chrome = Sitecore.PageModes.ChromeManager.getChrome(element);
      if (chrome != this) {
        continue;
      }

      if (isEnabled) {
        element.addClass("scEnabledChrome");
      }
      else {
        element.removeClass("scEnabledChrome");
      }
    }  
  },

  /* event handlers */
  _clickHandler: function(e) {
    if (!this.isEnabled()) {
      return;
    }

    if (e.ctrlKey) return;               
    e.stopPropagation();
        
    if (Sitecore.PageModes.ChromeManager.selectedChrome() != this || this.key() == "field" ) {          
      e.preventDefault();         
    }

    var target = $sc(e.target);
    target = target.closest("[sc-part-of]");

    if (!target.attr("sc-part-of")) {
      console.warn("this element wasn't supposed to get the click event");
      console.log(e.target);
      return;
    }

    var chromes = $sc(target).data("scChromes") || $sc(target).parent().data("scChromes") || $sc(target).parent().parent().data("scChromes");
    if (!chromes || chromes.length < 1) {
      console.log(target);
      throw "DOM element is expected to have a non-empty chromes collection.";
    }

    var enabledChrome = $sc.last(chromes, function() { return this.isEnabled(); });
    Sitecore.PageModes.ChromeManager.select(enabledChrome ? enabledChrome : this);
    var chr = enabledChrome ? enabledChrome : this;
  },

  _mouseEnterHandler: function(e) { 
    if (!this.isEnabled()) {
      return;
    }

    Sitecore.PageModes.ChromeManager.onMouseOver(this);
  },

  _mouseLeaveHandler: function() {
    if (!this.isEnabled()) {
      return;
    }

    Sitecore.PageModes.ChromeManager.onMouseOut(this);
  },
  
  /* establishes connection between DOM elements and chrome objects. */
  _markElements: function() {
    var chrome = this;

    if (this.openingMarker() && !this.openingMarker().data("scChromes")) {
      var chromes = new Array();
      chromes.push(this);
      this.openingMarker().data("scChromes", chromes);
    }

    this.element.each(function(index, raw) {
      var element = $sc(raw);

      if (!element.is("[sc-part-of*=" + chrome.type.key() + "]")) {
        var attr = element.attr("sc-part-of");
        if (typeof(attr) == "undefined") {
          attr = "";
        }

        if (attr.length > 0) {
            attr += " ";
        }
      
        attr += chrome.type.key();
        element.attr("sc-part-of", attr);
      }

      var chromes = element.data("scChromes");
      if (!chromes) {
        chromes = new Array();
      }

      if ($sc.inArray(chrome, chromes) < 0) {
        chromes.push(chrome);
      }

      element.data("scChromes", chromes);     
    });
  },

  _parseElements: function () {
    /* if this is an orphan chrome that is being deleted, not do anything */
    if (!this._originalDOMElement || this._originalDOMElement.parent().length == 0) {
      return;
    }

    var elements = this.type.elements(this._originalDOMElement);
    
    this.element = elements.content;
    this._openingMarker = elements.opening;
    this._closingMarker = elements.closing;

    this._markElements();
  }
});