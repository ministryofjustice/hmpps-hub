(function(speak) {
  speak.component(["bclCollection", "bclSelection"], function(Collection, Selection) {
    var getComputedItems = function(renderVertically, columnCount) {
      var isFullWidth = this.IsFullWidth,
        items = this.Items,
        rows = Math.ceil(items.length / columnCount),
        cells = [],
        width = isFullWidth ? "100%" : "auto",
        rowIndex = 0,
        cellIndex;

      if (!columnCount) {
        return [{ data: items, width: width }];
      }

      width = isFullWidth ? (100 / columnCount) + "%" : "auto";

      for (var i = 0; i < items.length; i++) {
        cellIndex = renderVertically ? i % rows : rowIndex;
        if (!cells[cellIndex]) {
          cells[cellIndex] = { data: [], width: width }
        }
        cells[cellIndex].data.push(items[i]);
        rowIndex += i % columnCount === (columnCount - 1);
      }

      return cells;
    };
 

    var render = function() {
      var renderVertically = this.IsRenderedVertically;
      var columnCount = this.Columns === 0 && renderVertically ? 1 : this.Columns;

      this.RenderAsOneLine = columnCount ? false : !renderVertically;
      this.ComputedItems = getComputedItems.call(this, renderVertically, columnCount);
    };

    return speak.extend({}, Collection.prototype, Selection.prototype, {
      initialized: function() {
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);
        this.IsSelectionRequired = false;

        this.defineProperty("RenderAsOneLine", null);
        this.defineProperty("ComputedItems", null);

        this.on("change:DynamicData change:Columns change:IsFullWidth change:IsRenderedVertically", render, this);
        this.on("itemsChanged", render, this);
        render.call(this);
      }
    });
  }, "RadioButtonList");
})(Sitecore.Speak);