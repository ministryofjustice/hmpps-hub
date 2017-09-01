(function (speak) {
  speak.component(["bclCollection", "bclChecking"], function (Collection, Checking) {
    var getComputedItems = function (renderVertically, columnCount) {
      var isFullWidth = this.IsFullWidth,
        items = this.Items,
        rows = Math.ceil(items.length / columnCount),
        arr = [],
        width = "",
        obj = {};

      if (columnCount) {
        var rowIndex = 0;

        width = isFullWidth ? (100 / columnCount) + "%" : "auto";

        // Create first dimension of array for each row
        for (var j = 0; j < rows; j++) {
          obj = {
            data: [],
            width: width
          };

          arr.push(obj);
        }

        // Adds data for each cell depending on the IsRenderedVertically property
        for (var i = 0; i < items.length; i++) {
          if (renderVertically) {
            arr[i % rows].data.push(items[i]);
          } else {
            arr[rowIndex].data.push(items[i]);

            if (i % columnCount === (columnCount - 1)) {
              rowIndex++;
            }
          }
        }
      } else {
        width = isFullWidth ? "100%" : "auto";
        obj = {
          data: items,
          width: width
        };

        arr.push(obj);
      }

      return arr;
    };

    var render = function() {
      var renderVertically = this.IsRenderedVertically;
      var columnCount = this.Columns === 0 && renderVertically ? 1 : this.Columns;

      this.RenderAsOneLine = columnCount ? false : !renderVertically;
      this.ComputedItems = getComputedItems.call(this, renderVertically, columnCount);
    };

    return speak.extend({}, Collection.prototype, Checking.prototype, {
      initialized: function () {
        Collection.prototype.initialized.call(this);
        Checking.prototype.initialized.call(this);

        this.defineProperty("RenderAsOneLine", null);
        this.defineProperty("ComputedItems", null);

        this.on("change:DynamicData change:Columns change:IsFullWidth change:IsRenderedVertically", render, this);
        this.on("itemsChanged", render, this);
        render.call(this);
      }
    });
  }, "CheckBoxList");
})(Sitecore.Speak);