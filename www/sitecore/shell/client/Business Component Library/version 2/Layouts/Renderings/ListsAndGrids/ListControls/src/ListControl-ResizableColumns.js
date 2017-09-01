define("ListControl/ResizableColumns", ["underscore", "jquery", "jqueryui"], function (_, $) {

  $.widget("sc.resizableColumns", {
    options: {
      selectors: {
        headerColumn: "thead th:visible",
        column: "table.sc-listcontrol-body > tbody > tr > td",
        handle: ".sc-rc-handle",
        border: ".sc-rc-handle-border"
      },
      templates: {
        handleContainer: "<div class='sc-rc-handle-container' />",
        border: "<div class='sc-rc-handle-border-container'><div class='sc-rc-handle-border' /></div>"
      },
      minWidth: null,
      columnWidths: null,
      dragOnlyHandlers: false
    },

    // All widget events which triggered with _trigger method will have this prefix (this._trigger("resized") -> "columnsresized")
    widgetEventPrefix: "columns",

    $table: null,
    $handles: null,
    $headers: null,
    $columns: null,
    $handleContainer: null,
    $borderContainer: null,
    $border: null,
    tableWidth: null,
    tableIsVisibleOnCreate: true,

    _create: function () {
      var selectors = this.options.selectors;

      this.$table = this.element.is("table") ? this.element : this.element.find("table").eq(0);
      this.$headers = this.$table.find(selectors.headerColumn);
      this.$columns = this.element.find(selectors.column);
      // Check table visibility
      this.tableIsVisibleOnCreate = this.$table.is(":visible");

      if (this.$table.length && this.$headers.length) {
        this._render();
        this._initEventHandlers();
      }
    },

    _initEventHandlers: function () {
      // All handlers which bunded with _on method would be unbinded automaticaly when widget will be destroyed
      this._on(this.$handleContainer, {
        "dragstart": "_onDragStart",
        "drag": "_onDrag",
        "dragstop": "_onDragStop"
      });

      this._on(window, { "resize": _.debounce(_.bind(this.adjustHandles, this)) });
      // If table is hidden on create then add handler on mouseenter to recalculate widths, when table becomes visible
      if (!this.tableIsVisibleOnCreate) {
        this._on(this.$table, { "mouseenter": "_onMouseEnter" });
      }
    },

    _render: function () {
      var selectors = this.options.selectors,
        templates = this.options.templates;

      this.$handleContainer = $(templates.handleContainer);
      this.element.prepend(this.$handleContainer.zIndex(this.$table.zIndex() + 1));
      this.tableWidth = this.$table.outerWidth();

      if (this.options.dragOnlyHandlers) {
        this.$borderContainer = $(templates.border);
        this.$border = this.$borderContainer.find(selectors.border);
        this.element.prepend(this.$borderContainer.zIndex(this.$table.zIndex() + 1));
      }

      if (this._isColumnsWidthsCorrect()) {
        this.setWidths(this.options.columnWidths);
      } else {
        if (this.element.is(":visible")) {
          this.setWidths(this._calculateWidth());
        }
      }

      this._createHandles();
    },

    _createHandles: function () {
      this.$handles = null;
      this.$handleContainer.empty();

      _.each(_.initial(this.$headers), _.bind(function (headColumn) {
        var handle = $("<div />", { "class": 'sc-rc-handle' })
          .data('th', $(headColumn))
          .appendTo(this.$handleContainer);

        handle.draggable({
          axis: "x",
          containment: "parent"
        });

        this.$handles = this.$handles ? this.$handles.add(handle) : handle;
        this._adjustHandle(handle);
      }, this));
    },

    _onDragStart: function (e) {
      this.tableWidth = this.$table.outerWidth();

      if (!this.columnsWidths) {
        this.setWidths(this.options.columnWidths || this._calculateWidth());
      }

      if (this.options.dragOnlyHandlers) {
        this.$borderContainer.show();
        this.$border.show().height(this.element.height());
      }

      var left = $(e.target).data('th'),
        right = left.next(),
        leftIndex = indexOfElementInCollection(left, this.$headers),
        rightIndex = indexOfElementInCollection(right, this.$headers),
        leftMinWidth = this.getMinWidth(this.options.minWidths[leftIndex], left),
        rightMinWidth = this.getMinWidth(this.options.minWidths[rightIndex], right);
      // Store information regarding currently resized columns
      this.currentlyResized = {
        left: {
          index: leftIndex,
          element: left,
          minWidthPx: leftMinWidth,
          widthPx: left.outerWidth(),
          widthPercents: this.columnsWidths[leftIndex]
        },
        right: {
          index: rightIndex,
          element: right,
          minWidthPx: rightMinWidth,
          widthPx: right.outerWidth(),
          widthPercents: this.columnsWidths[rightIndex]
        }
      };
    },

    _onDrag: function (e, ui) {
      var difference = ui.originalPosition.left - ui.position.left;

      if (this._isResizeAllowed(difference)) {
        this._updateColumnsWidths(difference);

        if (this.options.dragOnlyHandlers) {
          this.$border.css({ left: ui.position.left });
        } else {
          this._applyResize(this.currentlyResized.left.index);
          this._applyResize(this.currentlyResized.right.index);
        }
      }
    },

    _onDragStop: function (e) {
      this._trigger("resized", e, { columnWidths: this.getWidths() });

      if (this.options.dragOnlyHandlers) {
        this.$borderContainer.hide();
        this._applyResize(this.currentlyResized.left.index);
        this._applyResize(this.currentlyResized.right.index);
      }

      this.adjustHandles();
    },
    // Recalculate widths and remove mouseneter handler (only if table is not visible on initialization step)
    _onMouseEnter: function () {
      if (!this.columnsWidths) {
        this.setWidths(this.options.columnWidths || this._calculateWidth());
      }
      this.adjustHandles();
      this._off(this.$table, "mouseenter");
    },

    _applyResize: function (index) {
      this.$headers.eq(index)
        .add(this.$columns.eq(index))
        .css({ width: this.columnsWidths[index] + "%" });
    },

    _isResizeAllowed: function (difference) {
      var leftWidth = this.currentlyResized.left.widthPx - difference,
          rightWidth = this.currentlyResized.right.widthPx + difference;

      return leftWidth >= this.currentlyResized.left.minWidthPx && rightWidth >= this.currentlyResized.right.minWidthPx;
    },
    // Columns width considered as correct, only if number of widths is the same as number of headers and values is not null
    _isColumnsWidthsCorrect: function () {
      var columnWidthIsCorrect = true;

      if (!this.options.columnWidths ||
        $.type(this.options.columnWidths) !== 'array' ||
        this.options.columnWidths.length !== this.$headers.length ||
        _.contains(this.options.columnWidths, null)) {
        columnWidthIsCorrect = false;
      }

      return columnWidthIsCorrect;
    },

    _updateColumnsWidths: function (difference) {
      var differencePercent = percentOf(difference, this.tableWidth),
          leftWidthPercent = this.currentlyResized.left.widthPercents - differencePercent,
          rightWidthPercent = this.currentlyResized.right.widthPercents + differencePercent;

      this.columnsWidths[this.currentlyResized.left.index] = leftWidthPercent;
      this.columnsWidths[this.currentlyResized.right.index] = rightWidthPercent;
    },

    _calculateWidth: function () {
      this.tableWidth = this.$table.outerWidth();
      return _.map(this.$headers, _.bind(function (header) {
        var $header = $(header);
        var outerWidth = $(header).outerWidth();
        var minWidth = parseInt($header.css("min-width").replace("px", ""), 10);
        var useWidth = outerWidth > minWidth ? outerWidth : minWidth;

        return percentOf(useWidth, this.tableWidth);
      }, this));
    },

    _destroy: function () {
      if (this.$handleContainer) {
        this.$handleContainer.remove();
      }

      if (this.$borderContainer && this.options.dragOnlyHandlers) {
        this.$borderContainer.remove();
      }
    },

    _adjustHandle: function (handle) {
      handle = $(handle);

      if (handle.data('th')) {
        handle.css({
          left: handle.data('th').outerWidth() + (handle.data('th').offset().left - this.$handleContainer.offset().left),
          height: handle.data('th').outerHeight()
        });
      }
    },

    adjustHandles: function () {
      _.each(this.$handles, _.bind(this._adjustHandle, this));
    },

    setWidths: function (columnWidths) {
      this.columnsWidths = [];
      _.each(this.$headers, _.bind(function (header, index) {

        var $header = $(header),
            $column = $(this.$columns[$header.index()]),
            widthPercents;

        if (columnWidths && columnWidths[index]) {
          widthPercents = typeof columnWidths[index] === "string" ?
            parseFloat(columnWidths[index].replace("%", "")) :
            columnWidths[index];

          $header.add($column).css({ width: widthPercents + "%" });
          this.columnsWidths.push(widthPercents);
        }

      }, this));
    },

    getWidths: function () {
      return this.columnsWidths;
    },

    getMinWidth: function (definedMinWidth, $el) {
      return definedMinWidth || parseInt($el.css("min-width").replace("px", ""), 10);
    }

  });

  var percentOf = function (num, total) {
    return parseFloat(((num / total) * 100).toFixed(2));
  }

  var indexOfElementInCollection = function (element, collection) {
    var index = -1;
    _.each(collection, function (inCollection, inCollectionIndex) {
      if (element.is(inCollection)) {
        index = inCollectionIndex;
      }
    });
    return index;
  };

  return {
    render: function (internalListControlData, el, viewModel) {
      var $el = $(el);

      if ($el.is(":visible") && $el.resizableColumns) {
        if ($el.is(":data('sc-resizableColumns')")) {
          $el.resizableColumns("destroy");
        }

        if (!viewModel.isColumnWidthFixed()) {
          $el.resizableColumns({
            columnWidths: null,
            dragOnlyHandlers: true,
            minWidths: _.map(internalListControlData.Settings.DetailList.ColumnDefinitionItems, function (columns) { return columns.ColumnMinWidth; }),
            resized: function (e, columns) {
              viewModel.updateColumnsWidths(columns.columnWidths);
            }
          });
        }
      }
    }
  };

});