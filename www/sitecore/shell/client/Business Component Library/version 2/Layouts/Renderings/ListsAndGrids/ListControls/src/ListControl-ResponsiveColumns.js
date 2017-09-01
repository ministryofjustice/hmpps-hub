define("ListControl/ResponsiveColumns", ["sitecore"], function() {
  var ResponsiveColumns = function () { };

  ResponsiveColumns.prototype.getVisibleColumns = function (columns) {
    return Array.prototype.filter.call(columns, function (column) { return column.style.display !== "none"; });
  };

  ResponsiveColumns.prototype.getLastVisibleColumn = function (columns) {
    var visibleColumns = this.getVisibleColumns(columns);
    return visibleColumns[visibleColumns.length - 1];
  };

  ResponsiveColumns.prototype.getHiddenColumns = function (columns) {
    return Array.prototype.filter.call(columns, function (column) { return column.style.display === "none"; });
  };

  ResponsiveColumns.prototype.getFirstHiddenColumn = function (columns) {
    return this.getHiddenColumns(columns)[0];
  };

  ResponsiveColumns.prototype.getMinWidth = function(element) {
    var minWidth = element.style.minWidth || window.getComputedStyle(element, null).getPropertyValue("min-width");
    return parseInt(minWidth);
  };

  ResponsiveColumns.prototype.getMinWidths = function (elements) {
    return Array.prototype.map.call(elements, this.getMinWidth, this);
  };

  ResponsiveColumns.prototype.getSum = function (values) {
    return values.reduce(function (a, b) { return a + b;  }, 0);
  };

  ResponsiveColumns.prototype.isWidthExceeded = function (element, columns) {
    var elementWidth = element.clientWidth;
    return elementWidth < this.getSum(this.getMinWidths(columns));
  };

  ResponsiveColumns.prototype.isWidthBigEnoughForMore = function (element, columns) {
    var elementWidth = element.clientWidth;
    var visibleColumns = this.getVisibleColumns(columns);
    var firstHiddenColumn = this.getFirstHiddenColumn(columns);
    var columnsToCheck = visibleColumns.concat(firstHiddenColumn);

    return elementWidth >= this.getSum(this.getMinWidths(columnsToCheck));
  };

  ResponsiveColumns.prototype.getFirstHeaderColumns = function (element) {
    var header = element.querySelector("thead");

    if (!header) {
      return [];
    }

    return header.querySelector("tr").children;
  };

  ResponsiveColumns.prototype.getColumnIndex = function (column) {
    return Array.prototype.indexOf.call(column.parentNode.children, column);
  };

  ResponsiveColumns.prototype.getFirstHiddenBodyColumnCells = function (element) {
    var headerColumns = this.getFirstHeaderColumns(element),
      bodyRows = element.querySelector("tbody").children,
      firstHiddenColumn = this.getFirstHiddenColumn(headerColumns);

    if (!firstHiddenColumn || bodyRows[0].classList.contains("sc-nodata-row")) {
      return [];
    }

    var firstHiddenColumnIndex = this.getColumnIndex(firstHiddenColumn);

    return Array.prototype.map.call(bodyRows, function (row) { return row.children[firstHiddenColumnIndex]; });
  };

  ResponsiveColumns.prototype.getLastVisibleBodyColumnCells = function (element) {
    var headerColumns = this.getFirstHeaderColumns(element),
      bodyRows = element.querySelector("tbody").children,
      lastVisibleColumn = this.getLastVisibleColumn(headerColumns);

    if (!lastVisibleColumn || bodyRows[0].classList.contains("sc-nodata-row")) {
      return [];
    }

    var lastVisibleColumnIndex = this.getColumnIndex(lastVisibleColumn);

    return Array.prototype.map.call(bodyRows, function (row) { return row.children[lastVisibleColumnIndex]; });
  };

  ResponsiveColumns.prototype.render = function (element, viewModel, callback) {
    var headerColumns = this.getFirstHeaderColumns(element);

    if (element.offsetParent) {
      this.hideColumns(element, headerColumns, viewModel.isCheckModeEnabled());
      this.showColumns(element, headerColumns);
    }

    callback(element, viewModel, this.getHiddenColumns(headerColumns));
  };

  ResponsiveColumns.prototype.hideColumns = function (element, headerColumns, isCheckModeEnabled) {
    var visibleHeaderColumns = this.getVisibleColumns(headerColumns);
    var minimumRows = isCheckModeEnabled ? 2 : 1;

    while (visibleHeaderColumns.length > minimumRows && this.isWidthExceeded(element, visibleHeaderColumns)) {
      var lastVisibleBodyColumnCells = this.getLastVisibleBodyColumnCells(element);

      Array.prototype.forEach.call(lastVisibleBodyColumnCells, function (column) { column.style.display = "none"; });
      this.getLastVisibleColumn(headerColumns).style.display = "none";
      visibleHeaderColumns = this.getVisibleColumns(headerColumns);
    }
  };

  ResponsiveColumns.prototype.showColumns = function (element, headerColumns) {
    var hiddenHeaderColumns = this.getHiddenColumns(headerColumns);

    while (hiddenHeaderColumns.length > 0 && this.isWidthBigEnoughForMore(element, headerColumns)) {
      var firstHiddenBodyColumnCells = this.getFirstHiddenBodyColumnCells(element);

      Array.prototype.forEach.call(firstHiddenBodyColumnCells, function (column) { column.style.display = ""; });
      this.getFirstHiddenColumn(headerColumns).style.display = "";
      hiddenHeaderColumns = this.getHiddenColumns(headerColumns);
    }
  };

  return ResponsiveColumns;
});