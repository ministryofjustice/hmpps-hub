define([], function () {

  var lastSelectedValueStart, lastSelectedValueEnd;

  var RangeSelection = function () { };
  RangeSelection.prototype.constructor = RangeSelection;

  RangeSelection.prototype.initialized = function () {
    this.on("change:SelectedItems", this.selectRange, this);
    this.on("change:SelectedValueStart", valueChanged, this);
    this.on("change:SelectedValueEnd", valueChanged, this);
    this.on("itemsChanged", selectDefault, this);

    if (this.hasData()) {
      selectDefault.call(this);
    }
  };

  function valueChanged() {
    if (this.SelectedValueStart && this.SelectedValueEnd) {
      var selectResult = this.selectRangeByValues(this.SelectedValueStart, this.SelectedValueEnd);
      if (selectResult === null) {
        this.set("SelectedValueStart", lastSelectedValueStart, true);
        this.set("SelectedValueEnd", lastSelectedValueEnd, true);
      } else
        lastSelectedValueStart = this.SelectedValueStart;
        lastSelectedValueEnd = this.SelectedValueEnd;
    }
  }

  function selectDefault() {
    if (this.hasData()) {
      var startIsContained = containsValueInData.call(this, this.SelectedValueStart);
      var endIsContained = containsValueInData.call(this, this.SelectedValueEnd);

      if (startIsContained && endIsContained) {
        this.selectRangeByValues(this.SelectedValueStart, this.SelectedValueEnd);
      } else {
        this.set("SelectedValueStart", "", true);
        this.set("SelectedValueEnd", "", true);
        this.selectRange([this.at(0), this.at(this.Items.length - 1)]);
      }
    } else {
      this.SelectedValueStart = "";
      this.SelectedValueEnd = "";
      this.SelectedItems = [];
    }
  }

  function containsValueInData(value) {
    if (!this.Items || !value) {
      return false;
    }

    for (var i = 0; i < this.Items.length; i += 1) {
      if (this.getValue(this.Items[i]).toString() === value.toString()) {
        return true;
      }
    }
    return false;
  }

  RangeSelection.prototype.selectRangeAt = function (indexes) {
    var items = indexes.map(this.at, this);
    this.selectRange(items);
  };

  RangeSelection.prototype.selectRangeByValues = function (start, end) {
    if (!this.hasData()) {
      return null;
    }

    var modelStart = this.getByValue(start) || this.getByValue(lastSelectedValueStart);
    var modelEnd = this.getByValue(end) || this.getByValue(lastSelectedValueEnd);

    if (!modelStart || !modelEnd) {
      return null;
    }

    return this.selectRange([modelStart, modelEnd]);
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

  RangeSelection.prototype.selectRange = function (items) {
    if (this.SelectedItems && items && !isArraysEqual(this.SelectedItems, items)) {
      this.SelectedItems = items;
    }
    if (this.hasData()) {
      var newValues = items.map(this.getValue, this);
      var startIsContained = containsValueInData.call(this, newValues[0]);
      var endIsContained = containsValueInData.call(this, newValues[1]);

      if (startIsContained && endIsContained) {
        this.SelectedItems = items;
        this.SelectedValueStart = newValues[0];
        this.SelectedValueEnd = newValues[1];
      } else {       
        this.SelectedValueStart = lastSelectedValueStart;
        this.SelectedValueEnd = lastSelectedValueEnd;
      }
    }
  };

  return RangeSelection;
});