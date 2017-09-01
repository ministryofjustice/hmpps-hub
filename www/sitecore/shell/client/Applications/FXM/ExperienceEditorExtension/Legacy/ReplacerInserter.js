define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Commands/CreateReplacer.js" // used through legacy selector 
], function (_sc, _scl, $sc, _fxm, TranslationUtil) {

    var translator = null;

    var beforeKey = "{B8F49EBF-2542-4CB0-B3BB-63858918CE8B}",
        afterKey = "{18F0F47F-2214-4F23-B6FA-F2D86A0C9E5A}",
        replaceKey = "{FDBF46B4-5B52-4C7A-A254-B588EC52944E}";

    _scl.PageModes.ChromeTypes.ReplacerInserter = _scl.PageModes.ChromeTypes.PlaceholderInsertion.extend({
        constructor: function (placeholder) {
            this.base(placeholder);
            this.command = null;
        },

        activate: function () {
            this.addTarget('top', this.placeholder, beforeKey, {
              tooltip: TranslationUtil.translateTextByServer("Add a new placeholder before the element"),
              header: TranslationUtil.translateTextByServer("Add before")
            });
            
            this.addTarget('middle', this.placeholder, replaceKey, {
              tooltip: TranslationUtil.translateTextByServer("Add a new placeholder instead of the element"),
              header: TranslationUtil.translateTextByServer("Replace")
            });
            
            this.addTarget('after', this.placeholder, afterKey, {
              tooltip: TranslationUtil.translateTextByServer("Add a new placeholder after the element"),
              header: TranslationUtil.translateTextByServer("Add after")
            });

            // Fix markup
            $sc(".scInsertionHandleCenter").css('height', 'auto');
        },

        addTarget: function(where, chrome, insertPosition, command) {
            // set command for the base call
            this.command = command;
            // call base method
            this.base(where, chrome, insertPosition);

            //need to move 'middle' option
            if (where === 'middle') {
                var offset = chrome.position.offset();
                var dimensions = chrome.position.dimensions();

                var lastHandle = this.handles[this.handles.length - 1];
                lastHandle.css({
                    top: offset.top + (dimensions.height / 2),
                    left: offset.left - 20
                });
            }
        },

        addControl: function(position) {
            var path = _fxm.getChromePath(this.placeholder.element);
            var self = this;

            var callback = function (data) {
                //TODO handle null/canceled window
                if (data) {
                    _fxm.updateNodeToPlaceholder($sc(self.placeholder.element), data, position);
                }
            }
            var context = { callback: callback, selector: path, position: position };
            _sc.Commands.executeCommand('Sitecore.Speak.Commands.CreateReplacer', context);
        }
    });

    return {
        initialize: function (translations) {
            translator = translations;
        }
    };
});