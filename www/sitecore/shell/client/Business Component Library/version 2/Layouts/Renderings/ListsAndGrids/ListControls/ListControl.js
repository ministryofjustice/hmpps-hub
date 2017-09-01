(function (Speak) {
  
  Speak.component(["bclCollection", "bclSelection", "bclChecking", "bclScrollable", "ListControl/UserProfile", "ListControl/ViewModel", "ListControl/DetailList", "ListControl/TileList", "ListControl/IconList"], function (Collection, Selection, Checking, Scrollable, UserProfile, ViewModel, DetailList, TileList, IconList) {
    var view,
      viewModel,
      isSelectionRequired,
      

      ValueFieldCollection = Collection.assemble({ ValueFieldName: true }),

      initListeners = function () {
        this.on("change:ViewMode change:EmptyText change:IdFieldName change:ColumnDefinitionItems change:IconFieldName change:IconLinkFieldName change:IconTitleFieldName change:IconSize change:TextAlignment", this.render, this);
        this.on("itemsChanged", this.render, this);
        this.on("change:CheckedItems", function () {
          this.IsSelectionRequired = this.hasCheckedItems() ? false : isSelectionRequired;
          this.select(null);
        }, this);
      };

    return Speak.extend({}, ValueFieldCollection.prototype, Selection.prototype, Checking.prototype, Scrollable.prototype, UserProfile.prototype, {
      initialize: function() {
        Collection.prototype.initialize.call(this);
        Scrollable.prototype.initialize.call(this);
      },

      initialized: function () {

        this.ColumnDefinitionItems = typeof this.ColumnDefinitionItems === "string" ? JSON.parse(this.ColumnDefinitionItems) : JSON.parse(JSON.stringify(this.ColumnDefinitionItems));
        
        viewModel = new ViewModel(this);
        isSelectionRequired = this.IsSelectionRequired;
        
        UserProfile.prototype.initialized.call(this);
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this, this.IsSelectionRequired);
        Checking.prototype.initialized.call(this);
        Scrollable.prototype.initialized.call(this);
        initListeners.call(this);
      },

      swapColumns: function (indexA, indexB) {
        var temp = this.ColumnDefinitionItems[indexB];

        this.ColumnDefinitionItems[indexB] = this.ColumnDefinitionItems[indexA];
        this.ColumnDefinitionItems[indexA] = temp;

        this.trigger("change:ColumnDefinitionItems");
      },

      

      render: function () {
        switch (this.ViewMode) {
          case "DetailList":
            view = new DetailList(viewModel, this.el, this.ColumnDefinitionItems);
            break;
          case "TileList":
            view = new TileList(viewModel, this.el);
            break;
          case "IconList":
            view = new IconList(viewModel, this.el);
            break;
          default:
            throw "Cannot find ViewMode " + this.ViewMode;
        }
      }
    });
  }, "ListControl");
})(Sitecore.Speak);
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
define("ListControl/DetailList",
  [
    "ListControl/TemplateHelper",
    "ListControl/ResizableColumns",
    "ListControl/DetailListHeightFactory",
    "ListControl/ResponsiveColumns",
    "ListControl/DetailListHeader",
    "bclUtils"
  ],

  function (TemplateHelper, ResizableColumns, DetailListHeightFactory, ResponsiveColumns, DetailListHeader, Utils) {
    var consts = {
      selectors: {
        check: ".sc-listcontrol-checking",
        item: ".sc-listcontrol-item",
        items: ".sc-listcontrol-body-wrapper",
        listpage: ".sc-associated-listpage",
        tablebody: ".sc-listcontrol-body tbody"
      }
    };

    var View = function (viewModel, el, columnDefinitionItems) {
      this.setModelListeners(viewModel, columnDefinitionItems, el);
      this.render(viewModel, columnDefinitionItems, el);
      this.setSelected.call(this, el, viewModel.getSelectedIndex(), viewModel.isSelectionRequired());
      this.setViewListeners(viewModel, el);
    };

    View.prototype.click = function (viewmodel, event) {
      viewmodel.click(Utils.dom.index(event.currentTarget));
    };

    View.prototype.setHeader = function (element, viewModel, hiddenColumns) {
      var header = new DetailListHeader(element, viewModel, hiddenColumns);

      return header;
    };

    View.prototype.setHeightHandler = function (el, viewModel) {
      if (this.heightHandler) {
        this.heightHandler.destroy();
      }

      this.heightHandler = DetailListHeightFactory.create(el, viewModel);
      this.heightHandler.render();
      this.setAssociatedListPage(el, viewModel);
    };

    View.prototype.setAssociatedListPage = function (el, viewModel) {

      var scrollContainer = el.querySelector(consts.selectors.items),
        associatedListPage = el.querySelector(consts.selectors.listpage),
        link = el.querySelector(consts.selectors.listpage + " a");

      if (!scrollContainer.classList.contains("sc-hide-scrollbar")) {
        scrollContainer.classList.toggle("sc-hide-scrollbar", viewModel.associatedListPage());
      }

      link.href = viewModel.associatedListPage();
      associatedListPage.classList.toggle("hide", !viewModel.associatedListPage());

    };

    View.prototype.toggleCheck = function (viewmodel, event) {
      event.stopPropagation();
      viewmodel.toggleCheck(Utils.dom.index(event.currentTarget.parentNode));
    };

    View.prototype.toggleCheckAll = function (viewmodel, event) {
      event.stopPropagation();
      var checkbox = event.currentTarget.querySelector("input[type='checkbox']");

      if (event.target.nodeName === "TH") {
        checkbox.checked = !checkbox.checked;
      }

      viewmodel.toggleCheckAll(checkbox.checked);
    };

    View.prototype.toggleCheckOverSelect = function (viewmodel, event) {
      if (!viewmodel.isSelectionDisabled()) {
        viewmodel.toggleCheckOverSelect(Utils.dom.index(event.currentTarget));
      }
    };

    View.prototype.setChecked = function (el, indexes, allItemsAreChecked) {
      var checkedRows = el.querySelectorAll(consts.selectors.tablebody + " > tr.checked"),
        headerCheckbox = el.querySelector(consts.selectors.check + "-all input[type='checkbox']");

      Utils.dom.nodeListToArray(checkedRows).forEach(function (row) {
        row.classList.remove("checked");
        row.querySelector(consts.selectors.check + " > input[type=checkbox]").checked = false;
      });

      headerCheckbox.checked = allItemsAreChecked;

      if (indexes.length === 0) {
        return;
      }

      indexes.forEach(function (index) {
        var row = el.querySelectorAll(consts.selectors.tablebody + " > tr")[index];

        if (row) {
          row.classList.add("checked");
          row.querySelector(consts.selectors.check + " > input[type=checkbox]").checked = true;
        }
      });
    };

    View.prototype.setSelected = function (el, index) {
      var selectedElements = el.querySelectorAll(consts.selectors.tablebody + " > tr.selected");

      Utils.dom.nodeListToArray(selectedElements).forEach(function (row) {
        row.classList.remove("selected");
      });

      if (index === -1) {
        return;
      }

      if (el.querySelectorAll(consts.selectors.tablebody + " > tr") && el.querySelectorAll(consts.selectors.tablebody + " > tr")[0].classList.contains("sc-nodata-row") === false) {
        el.querySelectorAll(consts.selectors.tablebody + " > tr")[index].classList.add("selected");
      }

    };

    View.prototype.getViewModeSettings = function (viewModel, columnDefinitionItems, el) {
      if (columnDefinitionItems.length === 0) {
        console.warn("ListControl error: ColumnDefinitionItems are not set");
      }

      columnDefinitionItems = viewModel.setItemSortDirections(columnDefinitionItems);
      
      var viewModeSettings = {
        DetailList: {
          ColumnDefinitionItems: columnDefinitionItems
        },
        EmptyText: viewModel.getEmptyText(),
        IsCheckModeEnabled: viewModel.isCheckModeEnabled,
        AssociatedListPage: viewModel.associatedListPage(),
        Texts: {
          Sorted: {
            ascending: el.getAttribute("data-sc-sorted-ascending"),
            descending: el.getAttribute("data-sc-sorted-descending")
          }
        }
      };

      return viewModeSettings;
    };

    View.prototype.setModelListeners = function (viewModel, columnDefinitionItems, el) {
      // update view
      viewModel.off("change:CheckedItems change:SelectedItem change:HeightMode");
      viewModel.on("change:CheckedItems", this.setChecked.bind(this, el));
      viewModel.on("change:SelectedItem", this.setSelected.bind(this, el));
      viewModel.on("change:HeightMode", this.setHeightHandler.bind(this, el, viewModel));
    };

    View.prototype.setViewListeners = function (viewModel, el) {
      var $el = $(el);

      $el.off("click.listcontrol:click click.listcontrol:toggleCheckOverSelect click.listcontrol:toggleCheck click.listcontrol:toggleCheckAll");
      $el.on("click.listcontrol:click", consts.selectors.item, this.click.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheckOverSelect", consts.selectors.item, this.toggleCheckOverSelect.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheck", consts.selectors.check, this.toggleCheck.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheckAll", consts.selectors.check + "-all", this.toggleCheckAll.bind(this, viewModel));
    };

    View.prototype.updateDOM = function (oldScrollPosition, internalData, el, viewModel) {
      this.setHeightHandler.call(this, el, viewModel);
      viewModel.setScrollElement(el.querySelector(consts.selectors.items));
      viewModel.scrollPosition(oldScrollPosition);
      ResponsiveColumns.prototype.render(el, viewModel, this.setHeader);
      ResizableColumns.render(internalData, el, viewModel);
    };

    View.prototype.render = function (viewModel, columnDefinitionItems, el) {

      el.className = "sc-listcontrol sc-detaillist";

      var internalData = {
        Items: viewModel.getItems(),
        Settings: this.getViewModeSettings(viewModel, columnDefinitionItems, el)
      };

      //scroll position before (re-)render
      var oldScrollPosition = viewModel.scrollPosition();

      TemplateHelper.prototype.setupTemplates(el);
      TemplateHelper.prototype.render("detaillist", internalData, el);

      viewModel.checkItems();

      this.updateDOM(oldScrollPosition, internalData, el, viewModel);

      // To prevent too many calculations at once
      var windowResizeHandler = _.debounce(function () {
        this.updateDOM(viewModel.scrollPosition(), internalData, el, viewModel);
      }, 100, false).bind(this);

      window.addEventListener("resize", windowResizeHandler);

      var isCurrentlyVisible = true;
      var hiddenCounter = setInterval(function () {
        if (el.offsetParent === null) {
          isCurrentlyVisible = false;
        } else {
          if (!isCurrentlyVisible) {
            this.updateDOM(viewModel.scrollPosition(), internalData, el, viewModel);

            isCurrentlyVisible = true;
          }
        }
      }.bind(this), 1000);
    };

    return View;
  }
 );
define("ListControl/TileList",
  [
    "handlebars",
    "ListControl/TemplateHelper",
    "ListControl/TileListHeightFactory",
    "bclUtils"
  ],

  function (handlebars, TemplateHelper, TileListHeightFactory, Utils) {
    var consts = {
      selectors: {
        check: ".sc-listcontrol-tile-check",
        item: ".sc-listcontrol-tile",
        items: ".sc-listcontrol-tiles",
        listpage: ".sc-associated-listpage"
      }
    };

    var View = function (viewModel, el) {
      this.setModelListeners(viewModel, el);

      // init    
      this.render(viewModel, el);
    };

    View.prototype.click = function (viewmodel, event) {
      viewmodel.click(Utils.dom.index(event.currentTarget));
    };

    View.prototype.setHeightHandler = function (el, viewModel, oldScrollPosition) {
      this.heightHandler = TileListHeightFactory.create(el, viewModel);
      this.heightHandler.heightChangedCallback = function () {
        viewModel.updateScroll();
        viewModel.setScrollElement(el.querySelector(consts.selectors.items));
        viewModel.scrollPosition(oldScrollPosition);

        this.setAssociatedListPage(el, viewModel);
      }.bind(this);

      this.heightHandler.render();
    };

    View.prototype.setAssociatedListPage = function (el, viewModel) {
      var scrollContainer = el.querySelector(consts.selectors.items),
        associatedListPageElement = el.querySelector(consts.selectors.listpage),
        associatedListPage = viewModel.associatedListPage(),
        link = el.querySelector(consts.selectors.listpage + " a");

      if (scrollContainer.offsetHeight < scrollContainer.scrollHeight) {
        link.href = associatedListPage;
        associatedListPageElement.classList.toggle("hide", !associatedListPage);
        scrollContainer.classList.toggle("sc-hide-scrollbar", associatedListPage);
      }
    };

    View.prototype.toggleCheck = function (viewmodel, event) {
      event.stopPropagation();
      viewmodel.toggleCheck(Utils.dom.index(event.currentTarget.parentNode));
    };

    View.prototype.toggleCheckOverSelect = function (viewmodel, event) {
      if (!viewmodel.isSelectionDisabled()) {
        viewmodel.toggleCheckOverSelect(Utils.dom.index(event.currentTarget));
      }
    };

    View.prototype.setChecked = function (componentElement, indexes) {
      var checkedItems = componentElement.querySelectorAll(consts.selectors.items + " > " + consts.selectors.item + ".checked");

      Utils.dom.nodeListToArray(checkedItems).forEach(function (item) {
        item.classList.remove("checked");
        item.querySelector(consts.selectors.check + " > input[type=checkbox]").checked = false;
      });

      if (indexes.length === 0) {
        return;
      }

      indexes.forEach(function (index) {
        var element = componentElement.querySelectorAll(consts.selectors.items + " > " + consts.selectors.item)[index];

        if (element) {
          element.classList.add("checked");
          element.querySelector(consts.selectors.check + " > input[type=checkbox]").checked = true;
        }
      });
    };

    View.prototype.setSelected = function (componentElement, index) {
      var selectedElements = componentElement.querySelectorAll(consts.selectors.items + " > div" + consts.selectors.item + ".selected");

      Utils.dom.nodeListToArray(selectedElements).forEach(function (item) {
        item.classList.remove("selected");
      });

      if (index === -1) {
        return;
      }

      componentElement.querySelectorAll(consts.selectors.items + " > div" + consts.selectors.item)[index].classList.add("selected");
    };

    View.prototype.getViewModeSettings = function (viewModel) {
      var tileWidth = viewModel.getTileWidth();

      return {
        Id: viewModel.getId(),
        TileList: {
          TileWidth: tileWidth ? tileWidth + "px" : "100%"
        },
        EmptyText: viewModel.getEmptyText(),
        IsCheckModeEnabled: viewModel.isCheckModeEnabled,
        AssociatedListPage: viewModel.associatedListPage()
      }
    };

    View.prototype.applyCss = function (viewModel) {
      var cssPath = viewModel.getTileCssPath();

      if (cssPath && !document.querySelector('link[href="' + cssPath + '"]')) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = cssPath;
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    };

    View.prototype.applyTemplate = function (viewModel, el, callback) {
      var templatePath = viewModel.getTileTemplatePath();

      if (templatePath) {
        $.ajax(templatePath)
          .fail(function () {
            TemplateHelper.prototype.throwError("Tiletemplate \"" + templatePath + "\" was not found.");
          })
          .done(function (template) {
            if (!handlebars.templates["template-tilelist-" + el.getAttribute("data-sc-id")]) {
              handlebars.templates["template-tilelist-" + el.getAttribute("data-sc-id")] = handlebars.compile(template);
            }

            callback();
          });

        return;
      }

      TemplateHelper.prototype.throwError("TileTemplatePath was not defined.");
    };

    View.prototype.setModelListeners = function (viewModel, el) {
      // update view
      viewModel.off("change:CheckedItems change:SelectedItem change:HeightMode");
      viewModel.on("change:CheckedItems", this.setChecked.bind(this, el));
      viewModel.on("change:SelectedItem", this.setSelected.bind(this, el));
      viewModel.on("change:HeightMode", this.setHeightHandler.bind(this, el, viewModel));
    };

    View.prototype.setViewListeners = function (viewModel, el) {
      var $el = $(el);

      $el.off("click.listcontrol:click click.listcontrol:toggleCheckOverSelect click.listcontrol:toggleCheck");
      $el.on("click.listcontrol:click", consts.selectors.item, this.click.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheckOverSelect", consts.selectors.item, this.toggleCheckOverSelect.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheck", consts.selectors.check, this.toggleCheck.bind(this, viewModel));
    };

    View.prototype.updateDOM = function (oldScrollPosition, el, viewModel) {
      this.setHeightHandler.call(this, el, viewModel, oldScrollPosition);
    };

    View.prototype.render = function (viewModel, el) {
      el.className = "sc-listcontrol sc-tilelist";
      TemplateHelper.prototype.setupTemplates(el);

      this.applyCss(viewModel);
      this.applyTemplate(viewModel, el, function () {
        var internalData = {
          Items: viewModel.getItems(),
          Settings: this.getViewModeSettings(viewModel)
        };

        //scroll position before (re-)render
        var oldScrollPosition = viewModel.scrollPosition();

        TemplateHelper.prototype.render("tilelist", internalData, el);
        viewModel.checkItems();

        this.updateDOM(oldScrollPosition, el, viewModel);

        // To prevent too many calculations at once
        var windowResizeHandler = _.debounce(function () {
          this.updateDOM(oldScrollPosition, el, viewModel);
        }, 100, false).bind(this);

        window.addEventListener("resize", windowResizeHandler);

        this.setSelected.call(this, el, viewModel.getSelectedIndex(), viewModel.isSelectionRequired());
        this.setViewListeners(viewModel, el);
      }.bind(this));
    };

    return View;
  });
define("ListControl/IconList",
  [
    "handlebars",
    "ListControl/TemplateHelper",
    "ListControl/IconListHeightFactory",
    "bclUtils"
  ],

  function (handlebars, TemplateHelper, IconListHeightFactory, Utils) {
    var consts = {
      selectors: {
        check: ".sc-listcontrol-icon-check",
        item: ".sc-listcontrol-icon",
        items: ".sc-listcontrol-icons",
        listpage: ".sc-associated-listpage"
      }
    };

    var View = function (viewModel, el) {
      this.setModelListeners(viewModel, el);

      // init    
      this.render(viewModel, el);
    };

    View.prototype.click = function (viewmodel, event) {
      viewmodel.click(Utils.dom.index(event.currentTarget));
    };

    View.prototype.setHeightHandler = function (el, viewModel, oldScrollPosition) {
      this.heightHandler = IconListHeightFactory.create(el, viewModel);
      this.heightHandler.heightChangedCallback = function () {
        viewModel.updateScroll();
        viewModel.setScrollElement(el.querySelector(consts.selectors.items));
        viewModel.scrollPosition(oldScrollPosition);

        this.setAssociatedListPage(el, viewModel);
      }.bind(this);

      this.heightHandler.render();
    };

    View.prototype.setAssociatedListPage = function (el, viewModel) {
      var scrollContainer = el.querySelector(consts.selectors.items),
        associatedListPageElement = el.querySelector(consts.selectors.listpage),
        associatedListPage = viewModel.associatedListPage(),
        link = el.querySelector(consts.selectors.listpage + " a");

      if (scrollContainer.offsetHeight < scrollContainer.scrollHeight) {
        link.href = associatedListPage;
        associatedListPageElement.classList.toggle("hide", !associatedListPage);
        scrollContainer.classList.toggle("sc-hide-scrollbar", associatedListPage);
      }
    };

    View.prototype.toggleCheck = function (viewmodel, event) {
      event.stopPropagation();
      viewmodel.toggleCheck(Utils.dom.index(event.currentTarget.parentNode));
    };

    View.prototype.toggleCheckOverSelect = function (viewmodel, event) {
      if (!viewmodel.isSelectionDisabled()) {
        viewmodel.toggleCheckOverSelect(Utils.dom.index(event.currentTarget));
      }
    };

    View.prototype.setChecked = function (componentElement, indexes) {
      var checkedItems = componentElement.querySelectorAll(consts.selectors.items + " > " + consts.selectors.item + ".checked");

      Utils.dom.nodeListToArray(checkedItems).forEach(function (item) {
        item.classList.remove("checked");
        item.querySelector(consts.selectors.check + " > input[type=checkbox]").checked = false;
      });

      if (indexes.length === 0) {
        return;
      }
      
      indexes.forEach(function (index) {
        var element = componentElement.querySelectorAll(consts.selectors.items + " > " + consts.selectors.item)[index];

        if (element) {
          element.classList.add("checked");
          element.querySelector(consts.selectors.check + " > input[type=checkbox]").checked = true;
        }
      });
    };

    View.prototype.setSelected = function (componentElement, index) {
      var selectedElements = componentElement.querySelectorAll(consts.selectors.items + " > div" + consts.selectors.item + ".selected");

      Utils.dom.nodeListToArray(selectedElements).forEach(function (item) {
        item.classList.remove("selected");
      });

      if (index === -1) {
        return;
      }

      componentElement.querySelectorAll(consts.selectors.items + " > div" + consts.selectors.item)[index].classList.add("selected");
    };

    View.prototype.getViewModeSettings = function (viewModel) {
      return {
        Id: viewModel.getId(),
        IconList: {
          IconFieldName: viewModel.getIconFieldName(),
          IconLinkFieldName: viewModel.getIconLinkFieldName(),
          IconSize: viewModel.getIconSize(),
          IconTitleFieldName: viewModel.getIconTitleFieldName(),
          TextAlignment: viewModel.getTextAlignment()
        },
        EmptyText: viewModel.getEmptyText(),
        IsCheckModeEnabled: viewModel.isCheckModeEnabled,
        AssociatedListPage: viewModel.associatedListPage()
      }
    };

    View.prototype.setModelListeners = function (viewModel, el) {
      // update view
      viewModel.off("change:CheckedItems change:SelectedItem");
      viewModel.on("change:CheckedItems", this.setChecked.bind(this, el));
      viewModel.on("change:SelectedItem", this.setSelected.bind(this, el));
      viewModel.on("change:HeightMode", this.setHeightHandler.bind(this, el, viewModel));
    };

    View.prototype.setViewListeners = function (viewModel, el) {
      var $el = $(el);

      $el.off("click.listcontrol:toggleCheckOverSelect click.listcontrol:click click.listcontrol:toggleCheck");
      $el.on("click.listcontrol:click", consts.selectors.item, this.click.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheckOverSelect", consts.selectors.item, this.toggleCheckOverSelect.bind(this, viewModel));
      $el.on("click.listcontrol:toggleCheck", consts.selectors.check, this.toggleCheck.bind(this, viewModel));
    };

    View.prototype.updateDOM = function (oldScrollPosition, el, viewModel) {
      this.setHeightHandler.call(this, el, viewModel, oldScrollPosition);
    };

    View.prototype.render = function (viewModel, el) {
      el.className = "sc-listcontrol sc-iconlist";

      var internalData = {
        Items: viewModel.getItems(),
        Settings: this.getViewModeSettings(viewModel)
      };

      TemplateHelper.prototype.setupTemplates(el);

      //scroll position before (re-)render
      var oldScrollPosition = viewModel.scrollPosition();

      TemplateHelper.prototype.render("iconlist", internalData, el);

      viewModel.checkItems();

      this.updateDOM(oldScrollPosition, el, viewModel);

      // To prevent too many calculations at once
      var windowResizeHandler = _.debounce(function () {
        this.updateDOM(oldScrollPosition, el, viewModel);
      }, 100, false).bind(this);

      window.addEventListener("resize", windowResizeHandler);

      this.setSelected.call(this, el, viewModel.getSelectedIndex(), viewModel.isSelectionRequired());
      this.setViewListeners(viewModel, el);
    };

    return View;
  });
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
(function (Speak) {
  define("ListControl/TemplateHelper", ["handlebars", "bclImageHelper"], function (handlebars, imageHelper) {
    var getFixedNumber = function (value) {
      //http://stackoverflow.com/a/12830454/2833684
      return +(value).toFixed(2);
    },

      getRoundedPercentage = function (dataObj, columnDefinitionItem) {
        var denominator = 0,
          progressValue = dataObj[columnDefinitionItem.ProgressFieldName];

        if (columnDefinitionItem.IsPreCalculated) {
          return getFixedNumber(progressValue * 100);
        }

        denominator = (columnDefinitionItem.IsDividedByFixedValue) ? columnDefinitionItem.DivideByValue : dataObj[columnDefinitionItem.DivideByFieldName];
        return getFixedNumber((progressValue / denominator) * 100);
      },

      getColumnFieldValue = function (dataObj, prop) {
        if (!dataObj.hasOwnProperty(this[prop]) && Speak.isDebug() === "1") {
          console.warn(prop + ' "' + this[prop] + '" was not found in: ', dataObj);
        }
        return dataObj[this[prop]];
      },

      getFieldValue = function (prop) {
        if (!this.hasOwnProperty(prop) && Speak.isDebug() === "1") {
          console.warn(prop + ' "' + this[prop] + '" was not found in: ', JSON.stringify(this.__properties));
        }
        return this[prop];
      };

    var compiledHtmlTemplate = {};

    var TemplateHelper = function () {};

    TemplateHelper.prototype.throwError = function (message) {
      throw "ListControl error: " + message;
    };

    TemplateHelper.prototype.setupTemplates = function (el) {
      // querySelectorAll returns a NodeList, which needs to be converted into an Array
      var templates = Array.prototype.slice.call(el.querySelectorAll("script[type='text/x-handlebars-template']"));

      handlebars.templates = handlebars.templates || {};

      templates.forEach(function (item) {
        handlebars.templates[item.id] = handlebars.compile(item.innerHTML);
      });

      handlebars.partials = handlebars.templates;

      this.setupTemplateHelpers();
    };

    TemplateHelper.prototype.render = function (viewMode, internalData, el) {
      el.querySelector(".sc-listcontrol-content").innerHTML = handlebars.templates["template-" + viewMode](internalData);
    };

    // TODO: REMOVE THIS DEBUG HELPER WHEN NOT NEEDED!
    // THIS IS NOT FOR PRODUCTION!
    // {{debug}}
    TemplateHelper.prototype.debug = function (optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);

      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    };

    TemplateHelper.prototype.buildConditionalString = function (settings, dataObj) {
      if (arguments.length === 2) {
        dataObj = this;
      }

      var stringArr = [],
        settingsObj = {},
        placeholderChar = "{VALUE}",
        i = 0;

      settingsObj = JSON.parse(settings);

      for (i in settingsObj) {
        if (settingsObj.hasOwnProperty(i) && (dataObj[i] || dataObj[i] === 0)) {
          var option = settingsObj[i];
          if (option.indexOf(placeholderChar) > 0) {
            option = option.replace(new RegExp(placeholderChar, "g"), dataObj[i]).toLowerCase();
          }
          stringArr.push(option);
        }
      }
      return stringArr.join(" ");
    };

    TemplateHelper.prototype.conditionalWrap = function (settings, dataObj, options) {
      if (arguments.length === 2) {
        options = dataObj;
        dataObj = this;
      }

      var output = options.fn(this).trim(),
        settingsArr = null,
        i = 0;

      settingsArr = JSON.parse(settings);

      if (!Array.isArray(settingsArr)) {
        return "";
      }

      settingsArr.reverse().forEach(function (item) {
        var key = Object.keys(item)[0];
        if (dataObj[key]) {
          output = "<" + item[key] + ">" + output + "</" + item[key] + ">";
        }
      });

      return new handlebars.SafeString(output);
    };

    TemplateHelper.prototype.repeatBlock = function (n, options) {
      var accum = "";
      for (var i = 0; i < n; i = i + 1)
        accum += options.fn();
      return accum.trim();
    };

    TemplateHelper.prototype.reverseStripes = function (items) {
      return (items.length % 2 || items.length === 0) ? "sc-reverse-stripes" : "";
    };

    TemplateHelper.prototype.getColumnPartial = function (context, item, options) {
      var columnType = this.ColumnType.toLowerCase(),
        name = "nodata";

      if (columnType === "htmltemplate" || item[this.ImageFieldName] != null || item[this.LinkTextFieldName] != null || item[this.ProgressFieldName] != null || item[this.DataFieldName] != null) {
        name = columnType;
      }
      
      var templateName = "template-detaillist-column-" + name;

      context = JSON.parse(JSON.stringify(context));
      context.ValueItem = item;

      return handlebars.partials[templateName](context, options);
    };

    TemplateHelper.prototype.getProgressPercentage = function (dataObj) {
      return getRoundedPercentage(dataObj, this);
    };

    TemplateHelper.prototype.compilePartial = function (source, data) {
      if (!compiledHtmlTemplate.hasOwnProperty(this.ColumnFieldId)) {
        compiledHtmlTemplate[this.ColumnFieldId] = handlebars.compile(source);
      }

      var template = compiledHtmlTemplate[this.ColumnFieldId];

      return template(data);
    };

    TemplateHelper.prototype.getColumnFieldValue = getColumnFieldValue;

    TemplateHelper.prototype.getFieldValue = getFieldValue;

    TemplateHelper.prototype.getTileTemplate = function (id, data) {
      var template = handlebars.templates["template-tilelist-" + id] ? handlebars.templates["template-tilelist-" + id](data) : "";

      return template;
    };


    TemplateHelper.prototype.ifDataMissingForDetailList = function (dataObj, options) {
      if (arguments.length === 1) {
        options = dataObj;
        dataObj = this;
      }
      var hasItems = (Array.isArray(dataObj.Items) && dataObj.Items.length > 0) ? true : false,
        hasColumnDefinitionItems = (typeof dataObj.Settings.DetailList.ColumnDefinitionItems === "object") ? true : false;
      return (hasColumnDefinitionItems && hasItems) ? options.inverse(this) : options.fn(this);
    };

    TemplateHelper.prototype.getImageUrl = function (dataObj, prop) {
      var image;

      if (typeof dataObj === "string") {
        prop = dataObj;
        dataObj = this;
        image = dataObj[prop];
      } else {
        image = getColumnFieldValue.call(this, dataObj, prop);
      }

      if (image.indexOf("<image") !== -1) {
        var dbString = dataObj.hasOwnProperty("$database") ? dataObj["$database"] : "";
        image = imageHelper.getUrl(image, dbString);
      }

      return image;
    };

    TemplateHelper.prototype.getImageAlt = function (dataObj, altProp, imageProp) {
      var dataObjIsString = (typeof dataObj === "string"),
        alt = dataObjIsString ? this[dataObj] : getColumnFieldValue.call(this, dataObj, altProp),
        image = dataObjIsString ? this[altProp] : getColumnFieldValue.call(this, dataObj, imageProp);

      if (alt) {
        return alt;
      } else if (image.indexOf("<image") !== -1) {
        return imageHelper.getAlt(image);
      }

      return "";
    };

    TemplateHelper.prototype.getColumnFieldDateTimeValue = function (dataObj, prop) {
      var rawValue = handlebars.helpers["ListControl:GetColumnFieldValue"].call(this, dataObj, prop);

      if (rawValue == null) {
        return "";
      }

      var dateFormatterObject = {};
      dateFormatterObject[this.DateFormat.Type] = this.DateFormat.Value;

      var dateFormatter = Speak.globalize.dateFormatter(dateFormatterObject);

      return dateFormatter(Speak.utils.date.parseISO(rawValue));
    };

    TemplateHelper.prototype.getHeaderTitle = function(dataObj) {
      var title = this.ColumnTitle;
      var sorted = this.SortDirection ? dataObj.data.root.Settings.Texts.Sorted[this.SortDirection] : null;

      return sorted ? title + " - " + sorted : title;
    };

    TemplateHelper.prototype.setupTemplateHelpers = function () {
      handlebars.registerHelper("debug", this.debug);
      handlebars.registerHelper("ListControl:GetColumnFieldDateTimeValue", this.getColumnFieldDateTimeValue);
      handlebars.registerHelper("ListControl:ifDataMissingForDetailList", this.ifDataMissingForDetailList);
      handlebars.registerHelper("ListControl:GetColumnFieldValue", getColumnFieldValue);
      handlebars.registerHelper("ListControl:GetFieldValue", getFieldValue);
      handlebars.registerHelper('ListControl:ConditionalWrap', this.conditionalWrap);
      handlebars.registerHelper("ListControl:Classes", this.buildConditionalString);
      handlebars.registerHelper("ListControl:Styles", this.buildConditionalString);
      handlebars.registerHelper("ListControl:GetColumnPartial", this.getColumnPartial);
      handlebars.registerHelper("ListControl:CompilePartial", this.compilePartial);
      handlebars.registerHelper("ListControl:Progress", this.getProgressPercentage);
      handlebars.registerHelper("ListControl:ReverseStripes", this.reverseStripes);
      handlebars.registerHelper("ListControl:Repeat", this.repeatBlock);
      handlebars.registerHelper("ListControl:ImageUrl", this.getImageUrl);
      handlebars.registerHelper("ListControl:GetTileTemplate", this.getTileTemplate);
      handlebars.registerHelper("ListControl:ImageAlt", this.getImageAlt);
      handlebars.registerHelper("ListControl:GetHeaderTitle", this.getHeaderTitle);
    };

    return TemplateHelper;
  });
})(Sitecore.Speak);
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
define("ListControl/DetailListHeader", ["sitecore", "handlebars", "ListControl/TemplateHelper"], function (handlebars, TemplateHelper) {
  var Header = function (element, viewModel, hiddenColumns) {
    $(element).off("click.listcontrol:headerClick");
    $(element).on("click.listcontrol:headerClick", ".sc-listcontrol-header th:not(.sc-listcontrol-checking-all)", this.headerClick.bind(this, element, hiddenColumns));

    $(element).off("click.listcontrol:popOverSorting");
    $(element).on("click.listcontrol:popOverSorting", ".sc-popover .sc-sortings li", this.sort.bind(this, element, viewModel));

    this.viewModel = viewModel;
    this.render(element, viewModel, hiddenColumns);
  };

  Header.prototype.render = function (element, viewModel, hiddenColumns) {
    this.destroyPopover(element);
    this.setColumnSwap(element, hiddenColumns);
  };

  Header.prototype.sort = function (element, viewModel, event) {
    var index = this.getSelectedHeaderIndex(element),
      direction = event.currentTarget.className.replace("sc-", "").replace("active", "").trim();

    viewModel.setSorting(index, direction);

    this.deselectHeader(element);
  };

  Header.prototype.getSelectedHeaderIndex = function(element) {
    var selectedHeaderElement = element.querySelector("table.sc-listcontrol-header th.active");

    return Array.prototype.indexOf.call(selectedHeaderElement.parentNode.children, selectedHeaderElement);
  };

  Header.prototype.headerClick = function (element, hiddenColumns, event) {
    if (hiddenColumns.length > 0) {
      var selectHeader = !event.currentTarget.classList.contains("active");

      this.deselectHeader(element);

      if (selectHeader) {
        this.selectHeader(element, hiddenColumns, event.currentTarget);
      }
    } else if (event.currentTarget.classList.contains("sc-sortable")) {
      var index = Array.prototype.indexOf.call(event.currentTarget.parentNode.children, event.currentTarget);
      if (this.viewModel.isCheckModeEnabled()) {
        index = index - 1;
      }
      this.viewModel.toggleSorting(index);
    }
  };

  Header.prototype.deselectHeader = function (element) {
    var previousActive = element.querySelector("table.sc-listcontrol-header th.active");

    if (previousActive) {
      previousActive.classList.remove("active");
    }

    this.destroyPopover(element);
  };

  Header.prototype.selectHeader = function (element, hiddenColumns, clickedElement) {
    clickedElement.classList.add("active");

    this.createPopover(element, hiddenColumns, clickedElement);
  };

  Header.prototype.setColumnSwap = function (element, hiddenColumns) {
    var headerRow = element.querySelector("table.sc-listcontrol-header tr");

    if (headerRow) {
      headerRow.classList.toggle("hidden-columns", hiddenColumns.length > 0);
    }
  };

  Header.prototype.destroyPopover = function (element) {
    var popover = element.querySelector(".sc-popover");

    if (popover) {
      popover.remove();
    }
  };

  Header.prototype.repositionPopover = function (element) {
    var popover = element.querySelector(".sc-popover");

    if (window.innerWidth < (popover.offsetWidth + popover.offsetLeft)) {
      popover.style.left = "auto";
      popover.style.right = "0";
    }
  };

  Header.prototype.swapColumns = function (element, event) {
    var hiddenColumnIndex = parseInt(event.currentTarget.getAttribute("data-sc-column-index"));
    var headerIndex = this.getSelectedHeaderIndex(element);

    if (this.viewModel.isCheckModeEnabled()) {
      hiddenColumnIndex = hiddenColumnIndex - 1;
      headerIndex = headerIndex - 1;
    }

    this.viewModel.swapColumns(hiddenColumnIndex, headerIndex);
  };

  Header.prototype.setupPopoverEventListeners = function (element) {
    // Enable deselecting header by clicking outside of the popover and header
    $(document).off("click.listcontrol:deselectHeader").on("click.listcontrol:deselectHeader", function (e) {
      var popover = $(e.target).closest(".sc-popover, .sc-listcontrol-header");

      if (popover.size() === 0) {
        this.deselectHeader.call(this, element);
      }
    }.bind(this));

    $(element).off("click.listcontrol:columnswap").on("click.listcontrol:columnswap", ".sc-columnswap-item", this.swapColumns.bind(this, element));
  };

  Header.prototype.createPopover = function (element, hiddenColumns, clickedElement) {
    var popoverData = {
      hasHiddenColumns: hiddenColumns.length > 0,
      hiddenColumns: Array.prototype.map.call(hiddenColumns, function (column) {
        return {
          index: Array.prototype.indexOf.call(column.parentNode.children, column),
          value: column.innerText.trim()
        };
      }),
      isSortable: clickedElement.classList.contains("sc-sortable"),
      left: clickedElement.offsetLeft,
      minWidth: clickedElement.offsetWidth,
      sortDirections: {
        ascending: clickedElement.classList.contains("sc-ascending"),
        descending: clickedElement.classList.contains("sc-descending"),
        noSorting: clickedElement.classList.contains("sc-no-sorting")
      },
      top: clickedElement.offsetHeight
    };

    element.insertAdjacentHTML('beforeend', TemplateHelper.templates["template-detaillist-popover"](popoverData));

    this.repositionPopover(element);
    this.setupPopoverEventListeners(element);
  };

  return Header;
});
(function (Speak) {

  define("ListControl/UserProfile", ["bclUserProfile"], function () {

    var stateProperties = [
      "ViewMode",
      "SelectedValue",
      "CheckedValues",
      "Sorting"
    ];

    function setColumnDefinitionItemsState() {
      var userProfileColumnDefinitionItems = this.UserProfileState["ColumnDefinitionItems"];

      var columnFields = this.ColumnDefinitionItems.map(function(obj) {
         return _.omit(obj, "ColumnStoredWidth", "SortDirection");
      });
      var userProfileColumnFields = userProfileColumnDefinitionItems.map(function(obj) {
        if (obj.HtmlTemplate) {
          obj.HtmlTemplate = _.unescape(obj.HtmlTemplate);
        }

        return _.omit(obj, "ColumnStoredWidth", "SortDirection");
      });
      var columnFieldsMatch = JSON.stringify(columnFields) === JSON.stringify(userProfileColumnFields);

      if (Array.isArray(this.ColumnDefinitionItems)) {
        if (columnFieldsMatch) {
          this.ColumnDefinitionItems = userProfileColumnDefinitionItems;

          return;
        }

        updateState.call(this, stateProperties);
      }
    }

    //Generic implementation below - consider making it into a shared mixin
    var UserProfile = function () { };
    UserProfile.prototype.constructor = UserProfile;
    
    var saveHandler = Speak.module('bclUserProfile'),
    
    getProp = function (prop) {
      return (typeof prop === "object" ? Object.keys(prop)[0] : prop);
    },

    saveState = function(state) {
      if (Array.isArray(state.ColumnDefinitionItems)) {
        state.ColumnDefinitionItems = state.ColumnDefinitionItems.map(function (column) {
          if (column.ColumnType === "htmltemplate" && column.HtmlTemplate) {
            column = _.clone(column);
            column.HtmlTemplate = _.escape(column.HtmlTemplate);
          }

          return column;
        });
      }

      saveHandler.saveState(this.UserProfileKey, state, function () {
        this.UserProfileState = state;
        this.trigger("UserProfileSaved");
      }.bind(this));
    },

    updateState = function (stateProperties) {
      if (this.IsStateDiscarded) return;

      var state = typeof this.UserProfileState == "object" ? Speak.extend({}, this.UserProfileState) : {};

      stateProperties.forEach(function (prop) {
        var key = getProp(prop);
        if (this.hasOwnProperty(key)) {
           state[key] = this[key];
        }
      }, this);

      saveState.call(this, state);
    },

    setInitialState = function (stateProperties) {
      stateProperties.forEach(function (prop) {
        var key = getProp(prop);

        if (typeof prop === 'object' && this.hasOwnProperty(key) && this.UserProfileState[key]) {
          prop[key].call(this, key);
        }

        else if (this.hasOwnProperty(key) && this.UserProfileState[key]) {
          this[key] = this.UserProfileState[key];
        }
      }, this); 
    },

    setListener = function (stateProperties) {
      this.on(stateProperties.map(function (prop) {
        return "change:" + getProp(prop);
      }).join(" "), updateState.bind(this, stateProperties), this);
    };

    UserProfile.prototype.initialized = function () {
      if (this.IsStateDiscarded) return;

      if (!Speak.utils.is.an.array(stateProperties)) {
        throw new Error("Please provide a valid array containing component property names and events");
      }

      if (this.ViewMode === "DetailList") {
        stateProperties.push("ColumnWidths");
        stateProperties.push({ "ColumnDefinitionItems": setColumnDefinitionItemsState });
      }

      if (this.UserProfileState) {
        this.UserProfileState = typeof this.UserProfileState === "string" ? saveHandler.parseState(this.UserProfileState) : this.UserProfileState;
        setInitialState.call(this, stateProperties);
      } else {
        this.UserProfileState = {};
      }

      setListener.call(this, stateProperties);
    };

    UserProfile.prototype.resetState = function () {
      saveState.call(this, {});
    };

    return UserProfile;
  });
})(Sitecore.Speak);
define("ListControl/DetailListHeightFactory", ["ListControl/DetailListHeightRow", "ListControl/DetailListHeightDefault", "ListControl/DetailListHeightInherited"], function (HeightRow, HeightDefault, HeightInherited) {

  return {
    create: function(el, viewModel) {
      switch (viewModel.getHeightMode()) {
      case "inherited":
        return new HeightInherited(el);
      case "rowHeight":
        return new HeightRow(el, viewModel);
      default:
        return new HeightDefault();
      }
    }
  };

});
define("ListControl/DetailListHeightRow", [], function () {

  var DetailListHeight = function (el, viewModel) {
    this.el = el;
    this.viewModel = viewModel;
  };

  DetailListHeight.prototype.destroy = function () {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody");

    itemsContainer.style.height = "auto";
    fillersContainer.innerHTML = "";
  };

  DetailListHeight.prototype.render = function () {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody"),
      rows = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-item, .sc-nodata-row")),

      numItems = this.viewModel.getNumberOfItems(),
      hasScroll = (this.viewModel.maxRows() && this.viewModel.maxRows() < numItems);

    if (hasScroll) {

      var maxRowHeight = rows.slice(0, this.viewModel.maxRows()).reduce(function(previousValue, row) {
        return previousValue + row.offsetHeight;
      }, 0);
      
      itemsContainer.style.height = maxRowHeight + "px";
      fillersContainer.innerHTML = "";
    } else {
      var numOfFillers = this.viewModel.getNumberOfFillers();
      fillersContainer.innerHTML = new Array(numOfFillers + 1).join("<tr><td></td></tr>\n");
    }

  };

  return DetailListHeight;
});

define("ListControl/DetailListHeightDefault", [], function() {

  var DetailListHeight = function() {};

  DetailListHeight.prototype.destroy = function() {};

  DetailListHeight.prototype.render = function() {};

  return DetailListHeight;
});
define("ListControl/DetailListHeightInherited", [], function () {

  var DetailListHeight = function (el) {
    this.el = el;
  };

  DetailListHeight.prototype.destroy = function() {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody");

    itemsContainer.classList.remove("sc-hide-scrollbar");
    itemsContainer.style.height = "auto";
    fillersContainer.innerHTML = "";
  };

  DetailListHeight.prototype.render = function () {

    this.destroy();

    //DOM elements
    var parent = this.el.parentElement,
      listContent = this.el.querySelector(".sc-listcontrol-content"),
      itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody"),
      headerContainer = this.el.querySelector(".sc-listcontrol-header-wrapper"),
      paddingTop = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-top")),
      paddingBottom = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-bottom")),

      //Values
      fillerHeight = 40,
      fillerSpace = parent.offsetHeight - listContent.offsetHeight,
      numOfFillers = Math.ceil(fillerSpace / fillerHeight);

    fillersContainer.innerHTML = (numOfFillers > 0) ? new Array(numOfFillers + 1).join("<tr><td></td></tr>\n") : "";

    itemsContainer.style.height = (parent.clientHeight - paddingTop - paddingBottom - headerContainer.offsetHeight) + "px";
    itemsContainer.classList.toggle("sc-hide-scrollbar", numOfFillers > 0);
    
  };

  return DetailListHeight;
});
define("ListControl/TileListHeightFactory", ["ListControl/TileListHeightRow", "ListControl/TileListHeightDefault", "ListControl/TileListHeightInherited"], function (HeightRow, HeightDefault, HeightInherited) {

  return {
    create: function (el, viewModel) {
      switch (viewModel.getHeightMode()) {
        case "inherited":
          return new HeightInherited(el);
        case "rowHeight":
          return new HeightRow(el, viewModel);
        default:
          return new HeightDefault();
      }
    }
  };

});
define("ListControl/TileListHeightRow", [], function () {
  var setMaxHeight = function (itemsContainer, positions, rows) {
    var modelMaxRows = this.viewModel.maxRows();

    if (modelMaxRows && rows > modelMaxRows) {
      itemsContainer.style.maxHeight = positions[modelMaxRows] + "px";
    }
  };

  var setMinHeight = function (itemsContainer, positions, rows, tiles) {
    var modelMinRows = this.viewModel.minRows();

    if (modelMinRows) {
      var modelMaxRows = this.viewModel.maxRows(),
        minRows = modelMaxRows === 0 || modelMinRows <= modelMaxRows ? modelMinRows : modelMaxRows,
        minimumHeight = 0;

      if (positions[minRows]) {
        minimumHeight = positions[minRows];
      } else {
        var lastIndex = positions.length - 1,
          lastPosition = positions[lastIndex],
          lastTile = tiles[lastIndex],
          marginBottom = parseInt(document.defaultView.getComputedStyle(lastTile).getPropertyValue("margin-bottom")),
          height = lastPosition + lastTile.offsetHeight + marginBottom,
          averageHeight = (height / rows);

        minimumHeight = averageHeight * minRows;
      }

      itemsContainer.style.minHeight = minimumHeight + "px";
    }
  };

  var setContainerHeight = function (isReady) {
    if (isReady) {
      var itemsContainer = this.el.querySelector(".sc-listcontrol-tiles"),
        tiles = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-tile")),
        rows = 0,
        position,
        positions = [];

      for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i],
          tilePosition = tile.offsetTop;

        if (position !== tilePosition) {
          rows++;
          position = tilePosition;
          positions.push(tilePosition);
        }
      }

      setMaxHeight.call(this, itemsContainer, positions, rows);
      setMinHeight.call(this, itemsContainer, positions, rows, tiles);
      this.heightChangedCallback();
    }
  };

  var TileListHeight = function (el, viewModel) {
    this.el = el;
    this.viewModel = viewModel;
  };

  TileListHeight.prototype.heightChangedCallback = function() {};

  TileListHeight.prototype.render = function () {
    var images = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-tile img")),
      imagesLoaded = 0;

    if (images.length === 0) {
      setContainerHeight.call(this, true);

      return;
    }

    function onDone () {
      imagesLoaded++;
      setContainerHeight.call(this, imagesLoaded === images.length);
    }

    images.forEach(function (image) {
      if (!image.complete) {
        image.addEventListener("load", onDone.bind(this));
        image.addEventListener("error", onDone.bind(this));
      } else {
        onDone.call(this);
      }
    }, this);
  };

  return TileListHeight;
});

define("ListControl/TileListHeightDefault", [], function() {

  var TileListHeight = function() {};

  TileListHeight.prototype.destroy = function() {};

  TileListHeight.prototype.render = function() {};

  return TileListHeight;
});
define("ListControl/TileListHeightInherited", [], function () {

  var TileListHeight = function (el) {
    this.el = el;
  };

  TileListHeight.prototype.destroy = function() {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-tiles");

    itemsContainer.style.height = "auto";
  };

  TileListHeight.prototype.render = function () {

    this.destroy();

    //DOM elements
    var parent = this.el.parentElement,
      itemsContainer = this.el.querySelector(".sc-listcontrol-tiles"),
      paddingTop = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-top")),
      paddingBottom = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-bottom"));

    itemsContainer.style.height = (parent.clientHeight - paddingTop - paddingBottom) + "px";
  };

  return TileListHeight;
});
define("ListControl/IconListHeightFactory", ["ListControl/IconListHeightRow", "ListControl/IconListHeightDefault", "ListControl/IconListHeightInherited"], function (HeightRow, HeightDefault, HeightInherited) {

  return {
    create: function (el, viewModel) {
      switch (viewModel.getHeightMode()) {
        case "inherited":
          return new HeightInherited(el);
        case "rowHeight":
          return new HeightRow(el, viewModel);
        default:
          return new HeightDefault();
      }
    }
  };

});
define("ListControl/IconListHeightRow", [], function () {
  var setMaxHeight = function (itemsContainer, positions, rows) {
    var modelMaxRows = this.viewModel.maxRows();

    if (modelMaxRows && rows > modelMaxRows) {
      itemsContainer.style.maxHeight = positions[modelMaxRows] + "px";
    }
  };

  var setMinHeight = function (itemsContainer, positions, rows, icons) {
    var modelMinRows = this.viewModel.minRows();

    if (modelMinRows) {
      var modelMaxRows = this.viewModel.maxRows(),
        minRows = modelMaxRows === 0 || modelMinRows <= modelMaxRows ? modelMinRows : modelMaxRows,
        minimumHeight = 0;

      if (positions[minRows]) {
        minimumHeight = positions[minRows];
      } else {
        var lastIndex = positions.length - 1,
          lastPosition = positions[lastIndex],
          lastIcon = icons[lastIndex],
          marginBottom = parseInt(document.defaultView.getComputedStyle(lastIcon).getPropertyValue("margin-bottom")),
          height = lastPosition + lastIcon.offsetHeight + marginBottom,
          averageHeight = (height / rows);

        minimumHeight = averageHeight * minRows;
      }

      itemsContainer.style.minHeight = minimumHeight + "px";
    }
  };

  var setContainerHeight = function (isReady) {
    if (isReady) {
      var itemsContainer = this.el.querySelector(".sc-listcontrol-icons"),
        icons = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-icon")),
        rows = 0,
        position,
        positions = [];

      for (var i = 0; i < icons.length; i++) {
        var icon = icons[i],
          iconPosition = icon.offsetTop;

        if (position !== iconPosition) {
          rows++;
          position = iconPosition;
          positions.push(iconPosition);
        }
      }

      setMaxHeight.call(this, itemsContainer, positions, rows);
      setMinHeight.call(this, itemsContainer, positions, rows, icons);
      this.heightChangedCallback();
    }
  };

  var IconListHeight = function (el, viewModel) {
    this.el = el;
    this.viewModel = viewModel;
  };

  IconListHeight.prototype.heightChangedCallback = function() {};

  IconListHeight.prototype.render = function () {
    var images = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-icon img")),
      imagesLoaded = 0;

    if (images.length === 0) {
      setContainerHeight.call(this, true);

      return;
    }

    function onDone () {
      imagesLoaded++;
      setContainerHeight.call(this, imagesLoaded === images.length);
    }

    images.forEach(function (image) {
      if (!image.complete) {
        image.addEventListener("load", onDone.bind(this));
        image.addEventListener("error", onDone.bind(this));
      } else {
        onDone.call(this);
      }
    }, this);
  };

  return IconListHeight;
});

define("ListControl/IconListHeightDefault", [], function() {

  var IconListHeight = function () { };

  IconListHeight.prototype.destroy = function () { };

  IconListHeight.prototype.render = function () { };

  return IconListHeight;
});
define("ListControl/IconListHeightInherited", [], function () {

  var IconListHeight = function (el) {
    this.el = el;
  };

  IconListHeight.prototype.destroy = function() {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-icons");

    itemsContainer.style.height = "auto";
  };

  IconListHeight.prototype.render = function () {

    this.destroy();

    //DOM elements
    var parent = this.el.parentElement,
      itemsContainer = this.el.querySelector(".sc-listcontrol-icons"),
      paddingTop = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-top")),
      paddingBottom = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-bottom"));

    itemsContainer.style.height = (parent.clientHeight - paddingTop - paddingBottom) + "px";
  };

  return IconListHeight;
});