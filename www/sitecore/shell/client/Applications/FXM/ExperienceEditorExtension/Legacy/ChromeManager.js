define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js"
], function (_scl, $sc, _fxm) {

  function getChromeType(domElement) {
    if (domElement.hasClass(_fxm.selectedNodeClass)) {
      return new _scl.PageModes.ChromeTypes.FxmSelector();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='" + _fxm.clientActionKey + "']")) {
      return new _scl.PageModes.ChromeTypes.ClientAction();
    }

    return this._getChromeType(domElement);
  };

  // Not the most elegant of all methods.
  // If the domElement is an editFrame or field root node, but the this.getChrome doesn't return the corresponding chrome, this means that this
  // dom element hasn't been initialized as corrseponding chrome.
  // The reason this method is here, is because the same domElement might have been initialized as a part of placeholder or rendering, which would give it an scChromes
  // collection.
  function isElementButNotInitializedYet(domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='" + _fxm.selectorKey + "']")) {
      return this._isElementButNotInitializedYet(domElement);
    }

    return true;
  };

  if (!_scl.PageModes.ChromeManager._getChromeType) {
    _scl.PageModes.ChromeManager._getChromeType = _scl.PageModes.ChromeManager.getChromeType;
    _scl.PageModes.ChromeManager.getChromeType = getChromeType;
  }

  if (!_scl.PageModes.ChromeManager._isElementButNotInitializedYet) {
    _scl.PageModes.ChromeManager._isElementButNotInitializedYet = _scl.PageModes.ChromeManager.isElementButNotInitializedYet;
    _scl.PageModes.ChromeManager.isElementButNotInitializedYet = isElementButNotInitializedYet;
  }
});