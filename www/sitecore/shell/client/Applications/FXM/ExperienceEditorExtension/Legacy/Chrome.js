define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js"
], function (_scl, $sc, _fxm) {

  function remove() {
    this.onDelete();
    this.detachEvents();
    this.detachElements();
    this.openingMarker().remove();
    this.closingMarker().remove();
    this.element.next('code[chrometype=' + this.key() + ']').remove();
    this.element.prev('code[chrometype=' + this.key() + ']').remove();
    if (this.element.hasClass('scEmptyPlaceholder')) {
      this.element.remove();
    } else {

      if (this.element.attr("sc-part-of") === 'placeholder rendering') {
        this.element.remove();
      } else {
        this.element.removeClass('scEnabledChrome');
        this.element.removeAttr('sc-selector-id');
        this.element.removeAttr('sc-part-of');
      }
    }

    this._removed = true;
    var self = this;
    _scl.PageModes.ChromeManager._chromes = $sc.grep(_scl.PageModes.ChromeManager._chromes, function (value) {
      return value.element !== self.element;
    });
  };

  function clickHandler(element) {
    if (!element) {

      return false;
    }

    this.__clickHandler(element);

    var target = $sc(element.target);
    if (target.hasClass('scEmptyPlaceholder')) {
      return false;
    }
  };


  // reassign methods
  if (!_scl.PageModes.Chrome.prototype._remove) {
    _scl.PageModes.Chrome.prototype._remove = _scl.PageModes.Chrome.prototype.remove;
    _scl.PageModes.Chrome.prototype.remove = remove;
  }

  if (!_scl.PageModes.Chrome.prototype.__clickHandler) {
    _scl.PageModes.Chrome.prototype.__clickHandler = _scl.PageModes.Chrome.prototype._clickHandler;
    _scl.PageModes.Chrome.prototype._clickHandler = clickHandler;
  }
});
