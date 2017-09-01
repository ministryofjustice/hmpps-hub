define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
], function (_scl, $sc, _fxm, TranslationUtil) {

    var translator = null;

    function renderExpandCommand() {
        if (_fxm.isSelector(this.chrome.type.key())) {

            var parent = this.chrome.element.parent();
            var isSelectAllowed = false;
            var displayName = TranslationUtil.translateTextByServer("You cannot select parent. It may contain other controls.");

            if (parent && _fxm.isSelectionAllowed(parent)) {
                isSelectAllowed = true;
                displayName = _scl.PageModes.Texts.SelectParentElement.replace("{0}", _fxm.generateShortName(parent));
            }

            var container = $sc("<span class='scChromeComboButton' ></span>");

            var tag = $sc("<a href='#' class='scChromeCommand'></a>").attr("title", displayName);


            tag.click($sc.proxy(function (e) {
                e.stop();
                if (!isSelectAllowed) {
                    return false;
                }
                _fxm.toggleSelection(parent);
            }, this));

            var icon = $sc("<img />").attr({
                src: "/sitecore/shell/~/icon/ApplicationsV2/16x16/nav_up_left_blue.png.aspx",
                alt: _fxm.generateShortName(parent)
            });
            tag.append(icon);

            container.append(tag);
            if (isSelectAllowed) {
                container.append(this.renderExpandDropdown());
            }

            if (!isSelectAllowed) {
                container.children("a.scChromeCommand").addClass('scDisabled scEditButton');
                container.attr('style', 'background:none;border:none;cursor:default;');
                container.removeClass('scChromeComboButton').addClass('scChromeButton');
            }

            return container;
        }
        return this._renderExpandCommand();
    }

    function renderAncestors() {
        if (!_fxm.isSelector(this.chrome.type.key())) {
            return this._renderAncestors();
        }

        this.ancestorList.update("");
        var ancestors = this.chrome.element.parentsUntil('#' + _fxm.rootNodeId).map(function () {
            if (_fxm.isSelectionAllowed($sc(this))) {
                return $sc(this);
            }
        });

        ancestors = ancestors.get().reverse();

        for (var i = ancestors.length - 1; i >= 0; i--) {
            var level = ancestors.length - i - 1;
            this.ancestorList.append(this.renderAncestor(ancestors[i], level));
        }

        return this.ancestorList;
    };

    function renderAncestor(ancestor, level) {
        if (!_fxm.isSelector(this.chrome.type.key())) {
            return this._renderAncestor();
        }

        var paddingValue = 16;
        var row = $sc("<a class='scChromeDropDownRow' href='#'></a>");
        if (level > 0) {
            var levelConnection = $sc("<img src='/sitecore/shell/themes/standard/images/pageeditor/corner.gif' class='scLevelConnection' />");
            levelConnection.css("padding-left", (level - 1) * paddingValue + "px");
            row.append(levelConnection);
        }

        $sc("<img class='scChromeAncestorIcon' />").attr("src", this.chrome.icon()).appendTo(row);
        $sc("<span></span>").text(_fxm.generateShortName($sc(ancestor))).appendTo(row);


        row.click($sc.proxy(function (e) {
            e.stop();
            this.hideAncestors();
            _fxm.toggleSelection($sc(ancestor));
        }, this));

        return row;
    };

    // reassign prototype
    if (!_scl.PageModes.ChromeControls.prototype._renderExpandCommand) {
      _scl.PageModes.ChromeControls.prototype._renderExpandCommand = _scl.PageModes.ChromeControls.prototype.renderExpandCommand;
      _scl.PageModes.ChromeControls.prototype.renderExpandCommand = renderExpandCommand;
    }

    if (!_scl.PageModes.ChromeControls.prototype._renderAncestors) {
      _scl.PageModes.ChromeControls.prototype._renderAncestors = _scl.PageModes.ChromeControls.prototype.renderAncestors;
      _scl.PageModes.ChromeControls.prototype.renderAncestors = renderAncestors;
    }

    if (_scl.PageModes.ChromeControls.prototype._renderAncestor) {
      _scl.PageModes.ChromeControls.prototype._renderAncestor = _scl.PageModes.ChromeControls.prototype.renderAncestor;
      _scl.PageModes.ChromeControls.prototype.renderAncestor = renderAncestor;
    }

    return {
        initialize: function(translations) {
            translator = translations;
        }
    };
});