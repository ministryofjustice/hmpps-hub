define("bclSelection",[], function () {
  var Selection = function () { };
  Selection.prototype.constructor = Selection;

  Selection.prototype.initialized = function () {
    this.defineProperty("lastSelectedItem", "");

    this.on("change:SelectedItem", this.select, this);
    this.on("change:SelectedValue", this.selectByValue, this);
    this.on("itemsChanged", selectDefault.bind(this));

    if (this.hasData()) {
      selectDefault.call(this);
    }
  };

  function selectDefault() {
    var item = this.getByValue(this.SelectedValue) || this.getDefaultSelection();
    this.select(item);
  }

  Selection.prototype.getDefaultSelection = function() {
    var isSelectionRequired = (this.IsSelectionRequired === undefined) ? true : this.IsSelectionRequired;

    if (!isSelectionRequired || !this.hasData()) {
      return "";
    }

    if (this.lastSelectedItem && this.contains(this.lastSelectedItem) && this.isSelectable(this.lastSelectedItem)) {
      return this.lastSelectedItem;
    }

    return this.find(this.isSelectable);
  };
  

  Selection.prototype.isSelectable = function (item) {
    return !!item;
  };

  Selection.prototype.selectAt = function (index) {
    var item = this.at(index);
    this.select(item);
  };

  Selection.prototype.selectByValue = function (value) {
    if (!this.hasData()) {
      return;
    }

    var item = this.getByValue(value);
    this.select(item);
  };

  Selection.prototype.select = function (item) {
    if (!this.isSelectable(item)) {
      item = this.getDefaultSelection();
    }

    this.SelectedItem = item;

    if (this.hasData()) {
      this.SelectedValue = this.SelectedItem ? this.getValue(this.SelectedItem) : "";
    }

    this.lastSelectedItem = this.SelectedItem;
  };

  Selection.prototype.toggleSelect = function (item) {
    if (this.SelectedItem === item && !this.IsSelectionRequired) {
      this.select();

      return;
    }

    this.select(item);
  };

  return Selection;
});