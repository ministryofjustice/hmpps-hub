(function (Speak) {
  define("ListControl/ViewModel", [], function () {
    var ViewModel = function (model) {
      function onItemSelected(item) {
        var itemIndex = model.indexOf(item),
          index = (itemIndex === -1) && model.IsSelectionRequired && !model.hasCheckedItems() ? 0 : itemIndex;

        this.trigger("change:SelectedItem", index);
      }

      function onItemsChecked(items) {
        var indexes = items.map(model.indexOf, model);

        this.trigger("change:CheckedItems", indexes, model.CheckedItems.length === this.getItems().length);
      }

      function onHeightModeChange() {
        this.trigger("change:HeightMode");
      }

      function onScrollNearBottom() {
        if (model.IsEndlessScrollEnabled) this.scrollEnded();
      }

      this.checkItems = function () {
        if (model.CheckedItems.length !== 0) {
          onItemsChecked.call(this, model.CheckedItems);
        }
      };

      this.toggleCheckAll = function (checkAll) {
        if (checkAll) {
          model.checkAll();

          return;
        }

        model.uncheckAll();
      };

      this.toggleCheck = function (index) {
        var item = model.at(index);

        model.toggleCheck(item);
      };

      this.toggleCheckOverSelect = function (index) {
        var item = model.at(index);

        if (model.hasCheckedItems()) {
          model.toggleCheck(item);
        } else {
            var beforeSelectionObject = {
                isSelectionAborted: false,
                item: item
            };
            model.trigger("BeforeSelectedItem", beforeSelectionObject);

            if (!beforeSelectionObject.isSelectionAborted) {
                model.toggleSelect(item);
            }          
        }
      };

      this.getItems = function () {
        return model.Items;
      };

      this.isColumnWidthFixed = function () {
        return model.IsColumnWidthFixed;
      };

      this.updateScroll = function() {
        model.updateScroll();
      };

      this.isCheckModeEnabled = function () {
        return model.IsCheckModeEnabled;
      };

      this.isSelectionDisabled = function () {
        return model.IsSelectionDisabled;
      };

      this.isSelectionRequired = function () {
        return model.IsSelectionRequired;
      };

      this.getSelectedIndex = function () {
        return model.indexOf(model.SelectedItem);
      };

      this.getNumberOfRows = function () {
        return (model.MaxRows && model.MinRows > model.MaxRows) ? model.MaxRows : model.MinRows;
      };

      this.getNumberOfItems = function () {
        return model.getNumOfItems();
      };

      this.getNumberOfFillers = function () {
        if (this.associatedListPage()) return 0;

        var numItems = this.getNumberOfItems(),
          numRows = this.getNumberOfRows();

        //acount for no-data row
        numItems = (numItems) ? numItems : 1;

        return (numRows > numItems) ? numRows - numItems : 0;
      };

      this.getHeightMode = function () {
        if (model.IsHeightInherited) {
          return "inherited";
        } else if (model.MinRows || model.MaxRows) {
          return "rowHeight";
        } else {
          return "default";
        }
      };

      this.getTileCssPath = function () {
        return model.TileCssPath;
      };

      this.getTileTemplatePath = function () {
        return model.TileTemplatePath;
      };

      this.getTileWidth = function () {
        return model.TileWidth;
      };

      this.getIconFieldName = function () {
        return model.IconFieldName;
      };

      this.getIconLinkFieldName = function () {
        return model.IconLinkFieldName;
      };

      this.getIconSize = function () {
        return model.IconSize;
      };

      this.getIconTitleFieldName = function () {
        return model.IconTitleFieldName;
      };

      this.getTextAlignment = function () {
        return model.TextAlignment;
      };

      this.getId = function () {
        return model.id;
      };

      this.getEmptyText = function () {
        return model.EmptyText;
      };

      this.maxRows = function () {
        return model.MaxRows;
      };

      this.minRows = function () {
        return model.MinRows;
      };

      this.associatedListPage = function() {
        if (model.IsHeightInherited) return "";

        return this.getNumberOfItems() > this.maxRows() ? model.AssociatedListPage : "";
      };

      this.updateColumnsWidths = function(columnWidths) {
        columnWidths.forEach(function (value, index) {
          if (this.isCheckModeEnabled() && index === 0) return;
            
          var idx = this.isCheckModeEnabled() ? index - 1 : index;
          model.ColumnDefinitionItems[idx].ColumnStoredWidth = value;
        }, this);
        model.trigger("change:ColumnWidths");
      };

      this.setScrollElement = function (element) {
        model.ScrollElement = element ? element : model.ScrollElement;
      };

      this.scrollPosition = function(value) {
        if (arguments.length > 0) {
          model.scrollTo(value);
        } 
        return model.ScrollPosition;
      };

      this.scrollEnded = function () {
        this.invocation(model.ScrollEnded);
      };

      this.click = function (index) {
        model.ClickedItem = model.at(index);
        this.invocation(model.ItemClick);
      };

      this.invocation = function (invocation) {
        if (invocation) {
          var i = invocation.indexOf(":");
          if (i <= 0) {
            throw "Invocation is malformed (missing 'handler:')";
          }

          Speak.module("pipelines").get("Invoke").execute({
            control: model,
            app: model.app,
            handler: invocation.substr(0, i),
            target: invocation.substr(i + 1)
          });
        }
      };

      this.swapColumns = function (indexA, indexB) {
        model.swapColumns(indexA, indexB);
      };

      this.getSortingValue = function (column) {
        var mainDataId;

        switch (column.ColumnType) {
          case "link":
            mainDataId = "LinkTextFieldName";
            break;
          case "image":
            mainDataId = "ImageFieldName";
            break;
          case "htmltemplate":
            mainDataId = "HtmlTemplate";
            break;
          case "progressbar":
            mainDataId = "ProgressFieldName";
            break;
          default:
            mainDataId = "DataFieldName";
            break;
        }

        return column[mainDataId];
      };

      this.setItemSortDirections = function (columnDefinitionItems) {
        var sortingStrings = model.IsMultipleColumnSortEnabled ? model.Sorting.split("|") : model.Sorting.split("|").slice(0, 1);

        columnDefinitionItems.forEach(function (item) {
          var sortingValue = this.getSortingValue(item);

          item.SortDirection = "no-sorting";

          sortingStrings.forEach(function(str) {
            if ("d" + sortingValue === str) {
              item.SortDirection = "descending";
              return;
            } else if ("a" + sortingValue === str) {
              item.SortDirection = "ascending";
              return;
            }
          });
        }, this);

        return columnDefinitionItems;
      };

      this.setSorting = function(index, direction) {
        var sortingArr = model.Sorting && model.IsMultipleColumnSortEnabled ? model.Sorting.split("|") : [],
          column = model.ColumnDefinitionItems[index],
          sortingValue = this.getSortingValue(column),
          sortingString = direction.substr(0, 1) + sortingValue;

        sortingArr = sortingArr.filter(function (item) { return item !== "d" + sortingValue && item !== "a" + sortingValue; });

        if (direction !== "no-sorting") {
          sortingArr.push(sortingString);
        }

        model.Sorting = sortingArr.join("|");
      };

      this.toggleSorting = function (index) {
        var directions = ["no-sorting", "ascending", "descending"],
          column = model.ColumnDefinitionItems[index],
          currentSortDirection = column.SortDirection,
          sortIndex = directions.indexOf(currentSortDirection),
          newSortDirection = sortIndex === (directions.length - 1) ? directions[0] : directions[sortIndex + 1];

        this.setSorting(index, newSortDirection);
      };

      model.on("change:SelectedItem", onItemSelected, this);
      model.on("change:CheckedItems", onItemsChecked, this);
      model.on("change:IsHeightInherited change:MinRows change:MaxRows change:AssociatedListPage", onHeightModeChange, this);
      model.on("passedNearBottom", onScrollNearBottom, this);
    };

    Speak.extend(ViewModel.prototype, Speak.utils.Events);

    return ViewModel;
  });
})(Sitecore.Speak);