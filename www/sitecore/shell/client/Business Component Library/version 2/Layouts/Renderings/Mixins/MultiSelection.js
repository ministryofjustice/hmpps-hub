
define("bclMultiSelection", [], function () {

  var Selection = function () { };
  Selection.prototype.constructor = Selection;

  Selection.prototype.initialized = function () {
    this.on("change:SelectedItems", this.select, this);
    this.on("change:SelectedValues", this.selectByValue, this);
    this.on("itemsChanged", selectDefault, this);

    if (this.hasData()) {
      selectDefault.call(this);
    }
  };

  function selectDefault() {
    if (containsSelectedValuesInData.call(this)) {
      this.selectByValue(this.SelectedValues);
      return;
    }

    if (this.hasData()) {
      var isSelectionRequired = (this.IsSelectionRequired === undefined) ? true : this.IsSelectionRequired;
      if (isSelectionRequired) {
        this.select([this.at(0)]);
      }
    }
  }

  function containsSelectedValuesInData() {
    var items = this.SelectedValues.map(this.getByValue, this);
    return this.SelectedValues.length && _.contains(items, void (0)) == false;
  }

  Selection.prototype.selectAt = function (index) {
    var items = index.map(this.at, this);
    this.select(items);
  };

  Selection.prototype.selectByValue = function (values) {
    values = values || [];

    if (this.hasData()) {
      var items = values.map(this.getByValue, this);
      this.select(items);
    }
  };

  function isArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;

    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i])
        return false;
    }

    return true;
  }

  Selection.prototype.select = function (items) {
    if (!isArraysEqual(this.SelectedItems, items)) {
      this.SelectedItems = items;
    }

    if (this.hasData()) {
      var newValues = items.map(this.getValue, this);

      if (!isArraysEqual(this.SelectedValues, newValues)) {
        this.SelectedValues = newValues;
      }
    }
  };

  return Selection;
});