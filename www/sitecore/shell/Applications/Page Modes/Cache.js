if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* @class Reperesents a cache
*/
Sitecore.PageModes.Cache = Base.extend({
  _cacheInstance: {},
  
  /**
  * @description Adds the specified value under the specified key
  * @param {String} key The key
  * @param {} value The value
  */
  setValue: function(key, value) {
    this._cacheInstance[key] = value;
  },

  /**
  * @description Gets the value from the cache
  * @param {String} key The key
  * @returns The value or 'undefined' if the value under the specified key is not in the cache
  */
  getValue: function(key) {
    return this._cacheInstance[key];
  },

  /**
  * @description Removes the value from the cache
  * @param {String} key The key  
  */
  clear: function(key) {
    delete this._cacheInstance[key];
  },

  /**
  * @description Removes all instances from the cache
  */
  clearAll: function() {
    this._cacheInstance = {};
  }
});