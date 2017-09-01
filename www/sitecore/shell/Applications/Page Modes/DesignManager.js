Sitecore.PageModes.DesignManager = new function() {      
  this.inserting = false;
  this.sorting = false;
  Sitecore.PageModes.ChromeManager.chromesReseting.observe($sc.proxy(function() { this._placeholders = null;}, this))

  this.insertionStart = function() {
    Sitecore.PageModes.ChromeManager.hideSelection();
    if (this.inserting) return;

    $sc.each(this.placeholders(), function() {
      this.type.onShow();
    });

    this.inserting = true;
  };

  this.insertionEnd = function() {
     $sc.each(this.placeholders(), function() {
      this.type.onHide();
    });

    this.inserting = false;
  };
  
  this.moveControlTo = function(rendering, placeholder, position) {
    var descendants = rendering.descendants();       
    
    if ($sc.exists(descendants, function() { return this.key() == "word field" && this.type.hasModifications();} )) {
      if (confirm(Sitecore.PageModes.Texts.ThereAreUnsavedChanges)) {
        placeholder.type.insertRenderingAt(rendering, position);        
        Sitecore.LayoutDefinition.moveToPosition(rendering.type.uniqueId(), placeholder.type.placeholderKey(), position);
      }   
    }
    else {
      placeholder.type.insertRenderingAt(rendering, position);        
      Sitecore.LayoutDefinition.moveToPosition(rendering.type.uniqueId(), placeholder.type.placeholderKey(), position);
    }
  };
      
  this.placeholders = function() {
    if (!this._placeholders) {
      this._placeholders = $sc.grep(Sitecore.PageModes.ChromeManager.chromes(), function(chrome) { return chrome.key() == "placeholder" && chrome.isEnabled(); });
    }
    
    return this._placeholders;
  };

  this.onSelectionChanged = function(chrome) {
    if (this.inserting) {
      this.insertionEnd();
    }
  };

  this.canMoveRendering = function(rendering) {    
    var originalPlaceholder, placeholderRenderings, placeholders, renderingId;
            
    if (!rendering) {
      return false;
    }

    originalPlaceholder = rendering.type.getPlaceholder();
    if (!originalPlaceholder) {
      return false;
    }

    // Original placeholder is not editable. Do not allow move rendering away from it
    if (!originalPlaceholder.isEnabled()) {
      return false;
    }

    placeholderRenderings = originalPlaceholder.type.renderings();
    // We can move rendering inside the same placeholder
    if (placeholderRenderings.length > 1) {
      return true;
    }

    placeholders = this.placeholders();
    renderingId = rendering.type.renderingId();
    for (var i = 0, l = placeholders.length; i < l; i++) {
      if (placeholders[i] == originalPlaceholder) {
        continue;
      }

      if (placeholders[i].type.renderingAllowed(renderingId)) {
        return true;
      }
    }

    return false;
  };
  
  this.sortingStart = function(rendering) {
    if (this.sorting) return;

    $sc.each(this.placeholders(), function() {
      this.type.sortingStart(rendering);
    });
    
    this.sorting = true;
    this.sortableRendering = rendering;
    
  };
  
  this.sortingEnd = function() {
    if (!this.sorting) {
      return;
    }
    
    this.sorting = false;
    
    this.sortableRendering.type.sortingEnd();
  
    $sc.each(this.placeholders(), function() {
      this.type.sortingEnd();
    });
  };

  Sitecore.PageModes.ChromeManager.selectionChanged.observe($sc.proxy(this.onSelectionChanged, this));
};