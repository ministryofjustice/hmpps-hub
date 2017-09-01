define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/FxmChromeUtil.js"
], function (_sc, _scl, $sc, _fxm, _fxmChromeUtil) {

  // utilities
  var TRACKING_FIELD = "{B0A67B2A-8B07-4E0B-8809-69F751709806}";
  var FINAL_LAYOUT_FIELD = "{04BF00DB-F5FB-41F7-8AB7-22408372A981}";
  var getItemUri = function (chrome) {
    return new _scl.ItemUri(chrome.element.attr('data-sc-id'), _scl.PageModes.PageEditor.language(), chrome.element.attr('data-sc-version'), chrome.element.attr('data-sc-revision'));
  }

  // implementation
  _scl.PageModes.ChromeTypes.ClientAction = _scl.PageModes.ChromeTypes.Placeholder.extend({

    elements: function (domElement) {
      if (!domElement.is("code[type='text/sitecore'][chromeType='" + _fxm.clientActionKey + "']")) {
        console.error("Unexpected domElement passed to Fxm ClientActionChromeType for initialization:");
        console.error(domElement);

        throw "Failed to parse page editor client action demarked by script tags";
      }

      return this._getElementsBetweenScriptTags(domElement);
    },

    handleMessage: function (message, params) {
      switch (message) {
        case "chrome:placeholder:removeFxmClientAction":
          this.removeClientAction();
          return;
        case "chrome:placeholder:clientActionProperties":
          _fxmChromeUtil.openEditClientActionPropertiesDialog(this.chrome);
          return;
      }

      this.base(message, params);
    },

    key: function () {
      return _fxm.clientActionKey;
    },

    isEmpty: function () {
      return this.chrome.element.length === 0;
    },

    removeClientAction: function () {
      if (!this.chrome || !this.chrome.element) {
        return;
      }

      var placehoderOpenCode = this.chrome.element.prevAll("code[chrometype=placeholder][kind=open]").eq(0);
      if (!placehoderOpenCode) {
        return;
      }

      var key = placehoderOpenCode.attr("key");
      var content = $sc("[placeholderkey=" + key + "]");
      if (content) {
        var display = content.attr("displayAttr");
        content.css("display", display);
        content.removeAttr("dynamic");
        content.removeAttr("displayAttr");
        content.removeAttr("wasselected");
        content.removeAttr("placeholderkey");
      }

      var itemUri = getItemUri(this.chrome);
      _scl.PageModes.ChromeManager.setFieldValue(itemUri, FINAL_LAYOUT_FIELD, 'delete');

      if (this.chrome) {
        _scl.PageModes.ChromeManager.hideSelection();

        this.chrome.remove();
        _scl.PageModes.ChromeManager.resetChromes();
      }
    },

    remove: function (chrome) {
      chrome.onDelete();
      chrome.detachEvents();
      chrome.detachElements();
      chrome.openingMarker().remove();
      chrome.closingMarker().remove();
      chrome.element.next('code[chrometype=' + chrome.key() + ']').remove();
      chrome.element.prev('code[chrometype=' + chrome.key() + ']').remove();
      chrome.element.removeClass('scEmptySelector');
      chrome.element.removeClass('scEnabledChrome');
      chrome.element.removeAttr('sc-selector-id');
      chrome.element.removeAttr('sc-part-of');
      chrome._removed = true;
      _scl.PageModes.ChromeManager._chromes = $sc.grep(_scl.PageModes.ChromeManager._chromes, function (value) {
        return value.element !== chrome.element;
      });
    }
  });
});
