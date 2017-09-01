if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

/**
* @static
* @class Represents the HTML cache for variations
*/
Sitecore.PageModes.Testing.RenderingCache = new function() {
  this.innerCache = new Sitecore.PageModes.Cache();
 
  this.getVariationKey = function(renderingChrome, variation) {
    if (!renderingChrome || renderingChrome.key() != "rendering") {
      return null;
    }

    if (!variation) {
      return null;
    }

    return renderingChrome.type.uniqueId() + "$" + ($sc.type(variation) === "string" ? variation : variation.id);
  };
  
  this.cacheVariation = function (renderingChrome, variation, value) {
    var key = this.getVariationKey(renderingChrome, variation);
    if (key !== null) {
      this.innerCache.setValue(key, value);
      return true;
    }
    
    return false;    
  };
 
  this.getCachedVariation = function(renderingChrome, variation) {
    var key = this.getVariationKey(renderingChrome, variation);
    if (key !== null) {
      return this.innerCache.getValue(key);      
    }
    
    return null; 
  };
  
  this.removeVariation = function(renderingChrome, variation) {
    var key = this.getVariationKey(renderingChrome, variation);
    if (key !== null) {
      this.innerCache.clear(key);      
    }
  };
 
  this.clear = function() {
    this.innerCache.clearAll();
  };

  Sitecore.PageModes.PageEditor.onSave.observe($sc.proxy(this.clear, this));
};