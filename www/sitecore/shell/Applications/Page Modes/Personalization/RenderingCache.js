if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @static
* @class Represents the HTML cache
*/
Sitecore.PageModes.Personalization.RenderingCache = new function() {
  this.innerCache = new Sitecore.PageModes.Cache();

  /**
  * @description Gets the key for the cache
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition
  * @returns {String} The key
  */
  this.getConditionKey = function(renderingChrome, condition) {
    if (!renderingChrome || renderingChrome.key() != "rendering") {
      return null;
    }

    if (!condition) {
      return null;
    }

    return renderingChrome.type.uniqueId() + "$" + ($sc.type(condition) === "string" ? condition : condition.id);
  };

   /**
  * @description Addes to cache the html of the specified rendering in specified contition
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition
  * @returns {Boolean} The value indicating if the instance was succesfully added to the cache 
  */
  this.cacheCondition = function (renderingChrome, condition, value) {
    var key = this.getConditionKey(renderingChrome, condition);
    if (key !== null) {
      this.innerCache.setValue(key, value);
      return true;
    }
    
    return false;    
  };

  /**
  * @description Gets the html of the specified rendering in specified contition
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition
  * @returns {String} The html 
  */
  this.getCachedCondition = function(renderingChrome, condition) {
    var key = this.getConditionKey(renderingChrome, condition);
    if (key !== null) {
      return this.innerCache.getValue(key);      
    }
    
    return null; 
  };

  /**
  * @description Removes the html of the specified rendering in specified contition from the cache
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition  
  */
  this.removeCondition = function(renderingChrome, condition) {
    var key = this.getConditionKey(renderingChrome, condition);
    if (key !== null) {
      this.innerCache.clear(key);      
    }
  };

  /**
  * @description Removes all instances from the cache
  */
  this.clear = function() {
    this.innerCache.clearAll();
  };

  Sitecore.PageModes.PageEditor.onSave.observe($sc.proxy(this.clear, this));
};