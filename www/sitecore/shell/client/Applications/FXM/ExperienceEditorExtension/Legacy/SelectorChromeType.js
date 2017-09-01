define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js"
], function (_sc, _scl, $sc, _fxm) {
    _scl.PageModes.ChromeTypes.FxmSelector = _scl.PageModes.ChromeTypes.Placeholder.extend({
        
        _selectedNodeClass: _fxm.selectedNodeClass,

        addControl: function(position) {
            if (this.inserter) {
                this.inserter.addControl(position);
            } else {
                this.base(position);
            }
        },

        load: function () {
            if (this.isEmpty()) {
                this.showEmptyLook();
            }
        },

        onShow: function() {
            if (this.isReadOnly()) {
                return;
            }

            if (_fxm.isActive(_fxm.PlaceholderCapability)) {
                this.inserter = new _scl.PageModes.ChromeTypes.ReplacerInserter(this.chrome);
            } else {
                this.inserter = new _scl.PageModes.ChromeTypes.ClientActionInserter(this.chrome);
            }
            
            this.inserter.activate();
        },

        isEmpty: function() {
            return this.chrome.element.length === 0;
        },

        elements: function(domElement) {
            if (!domElement.is("code[type='text/sitecore'][chromeType='" + _fxm.selectorKey +"']")) {
                console.error("Unexpected domElement passed to Fxm SelectorChromeType for initialization:");
                console.error(domElement);

                throw "Failed to parse page editor placeholder demarked by script tags";
            }

            return this._getElementsBetweenScriptTags(domElement);
        },

        handleMessage: function (message, params) {
            switch (message) {
                case "chrome:placeholder:removeFxmPlaceholder":
                    this.removePlaceholder();
                    return;
            }

            this.base(message, params);
        },

        key: function() {
            return _fxm.selectorKey;
        }
    });
});