define("bclChecking", [], function () {
  var Checking = function() {};
  Checking.prototype.constructor = Checking;

  Checking.prototype.initialized = function () {
    var privateVars = {
      checkedValuesWasSet: false,
      defaultCheckedValues: (typeof this.CheckedValues) === "string" ? JSON.parse(this.CheckedValues) : this.CheckedValues
    };

    this.CheckedValues = [];
    
    this.on("itemsChanged", checkDefault.bind(this, privateVars));
    this.on("change:CheckedValues", this.setCheckedValues, this);
    this.on("change:CheckedItems", this.setCheckedItems, this);

    checkDefault.call(this, privateVars);
  };

  function checkDefault(that) {
    var hasData = this.hasData();

    if (hasData && !that.checkedValuesWasSet && !this.CheckedValues.length) {
      that.checkedValuesWasSet = true;
      this.checkByValues(that.defaultCheckedValues);
    } else if (hasData) {
      var checked = this.CheckedValues;
      this.uncheckAll();
      this.checkByValues(checked);
    } else {
      this.uncheckAll();
    }
  }

  function getItemsByIndexes(indexes) {
    return indexes.map(this.at, this);
  }

  function getCheckedValues() {
    return this.CheckedItems.map(this.getValue, this);
  }

  function isIdentical(arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;

    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i])
        return false;
    }

    return true;
  }

  Checking.prototype.toggleAll = function (checkAll) {
    if (checkAll === true) {
      this.checkAll();
      return;
    }

    if (checkAll === false || this.isAllChecked()) {
      this.uncheckAll();
    } else {
      this.checkAll();
    }
  };

  Checking.prototype.isAllChecked = function () {
    return this.CheckedItems.length === this.Items.length;
  };

  Checking.prototype.checkAll = function () {
    this.check(this.Items);
  };

  Checking.prototype.uncheckAll = function () {
    this.setCheckedItems([]);
  };

  Checking.prototype.isChecked = function (item) {
    return this.CheckedItems.indexOf(item) !== -1;
  };

  Checking.prototype.toggleCheckAt = function (index) {
    this.toggleCheck(this.at(index));
  };

  Checking.prototype.toggleCheck = function (item) {
    if (this.isChecked(item)) {
      this.uncheck([item]);

      return;
    }

    this.check([item]);
  };

  Checking.prototype.checkAt = function (indexes) {
    var items = getItemsByIndexes.call(this, indexes);

    this.check(items);
  };

  Checking.prototype.uncheckAt = function (indexes) {
    var items = getItemsByIndexes.call(this, indexes);

    this.uncheck(items);
  };

  Checking.prototype.uncheck = function (items) {
    var newItems = _.difference(this.CheckedItems, items);
    this.setCheckedItems(newItems);
  };

  Checking.prototype.checkByValues = function (values) {
    var items = values.map(this.getByValue, this).filter(function(value) {
      return value !== void (0);
    });
    
    this.check(items);
  };

  Checking.prototype.check = function (items) {
    var newItems = _.union(this.CheckedItems, items);

    this.setCheckedItems(newItems);
  };

  Checking.prototype.setCheckedValues = function(values) {
    var items = values.map(this.getByValue, this);
    this.setCheckedItems(items);
  };

  Checking.prototype.setCheckedItems = function(items) {
    if (!isIdentical(this.CheckedItems, items)) {
      this.CheckedItems = items;
    }

    var newValues = getCheckedValues.call(this);

    if (!isIdentical(this.CheckedValues, newValues)) {
      this.CheckedValues = newValues;
    }
  };

  Checking.prototype.hasCheckedItems = function () {
    return this.CheckedItems.length > 0;
  };

  return Checking;
});