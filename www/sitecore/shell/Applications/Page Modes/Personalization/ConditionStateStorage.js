if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @static
* @class Represents the persistent(cookie based) page-level storage for states of rendering condition.
* @description Persists the RenderingUniqueId:ConditionId pairs in cookie. Default conditions are omitted.
*/
Sitecore.PageModes.Personalization.ConditionStateStorage = new function() {
  this.storage = null;
  this.cookieName = "pe_conditions_";
  this.keyValueDelimiter = "@";
  this.pairsDelimiter = "_";
    
  /**
  * @description Clears the storage
  */
  this.clear = function() {
    this.storage = {};
  };

  /**
  * @description Removes the storage cookies related to other pages
  */
  this.deleteOtherPageStorage = function() {
    var cookieSet = document.cookie;
    if (cookieSet) {
      var cookies = cookieSet.split(";");
      var currentPageCookieName = this.getCookieName();
      for (var i = 0; i < cookies.length; i++) {
        var cookie = $sc.trim(cookies[i]);
        if (cookie.indexOf(this.cookieName) === 0 && cookie.indexOf(currentPageCookieName) !== 0) {
          var name = cookie.split("=")[0];
          if (name) {
            $sc.util().removeCookie(name);
          }
        }
      } 
    }
  };

  /**
  * @description Defines if the specified condition of the specified rendering has active state in the storage
  * @param {String} renderingId - the renderings unique id
  * @param {String} conditionId - the condition id
  * @return {Boolean} The value indicating if rendering is active
  */
  this.isConditionActive = function(renderingId, conditionId) {
    if (!this.storage) {
      this.populateStorage();
    }

    return this.storage[renderingId] === conditionId;
  };

  /**
  * @description Gets the name of the cookie to store the values in
  * @return {String} The cookie name
  */
  this.getCookieName = function() {
    var itemId = Sitecore.PageModes.PageEditor.itemId();
    var lang = Sitecore.PageModes.PageEditor.language();
    return this.cookieName + itemId + "_" + lang;
  };

  /**
  * @description Parses thes cookie value
  * @return {Object} The renderingid-conditionid HashTable 
  */
  this.parse = function(value) {
    var result = {}, parts, renderingId, conditionId;
    var pairs = value.split(this.pairsDelimiter);
    for (var i = 0; i < pairs.length; i++) {
      parts = pairs[i].split(this.keyValueDelimiter);
      renderingId = parts[0];
      conditionId = $sc.toId(parts[1]);
      
      if (renderingId && conditionId) {
        result[renderingId] = conditionId;
      }
    }

    return result;
  };

  /**
  * @description Popupates the storage from the cookie
  */
  this.populateStorage = function() {    
    var cookieName = this.getCookieName();
    var cookieValue = $sc.util().getCookie(cookieName);
    if (cookieValue) {
      this.storage = this.parse(cookieValue);
    }
    else {
      this.storage = {};
    }
  };

  /**
  * @description Removes the key-value pair for the specified rendering from the storage
  * @param {String} renderingId The rendering unique Id
  */
  this.remove = function(renderingId) {
    if (this.storage) {
      delete this.storage[renderingId];
    }
  };

  /**
  * @description Saves the storage to cookie
  */
  this.save = function() {
    var cookieName = this.getCookieName();
    var value = this.serialize(true/*Default condition shouldn't be saved in a cookie*/);       
    if (value) {
      $sc.util().setCookie(cookieName, value, "");
    }
    else {
      $sc.util().removeCookie(cookieName);
    }
  };

  /**
  * @description Serializes the storage to a string
  * @param {Boolean} omitDefault - If set to true omits default condition while serializing
  * @return {String} The serialized storage
  */
  this.serialize = function(omitDefault) {
    if (this.storage) {
      var result = "";
      for (var renderingId in this.storage) {
        var conditionId = this.storage[renderingId];
        if (omitDefault && conditionId === Sitecore.PageModes.Personalization.Condition.defaultId) {
          continue;
        }

        if (result) {
          result += this.pairsDelimiter;
        }

        result += (renderingId + this.keyValueDelimiter + $sc.toShortId(conditionId));
      }
      
      return result;
    }

    return null;
  };

  /**
  * @description Sets the sepcified condition as an active one for the specified rendering
  * @param {String} renderingId - the renderings unique id
  * @param {String} conditionId - the condition id
  */
  this.setConditionActive = function(renderingId, conditionId) {
    if (!this.storage) {
      this.populateStorage();
    }

    this.storage[renderingId] = conditionId;
  };

  Sitecore.PageModes.PageEditor.onSave.observe($sc.proxy(this.save, this));
  $sc(window).load($sc.proxy(this.deleteOtherPageStorage, this)); 
};