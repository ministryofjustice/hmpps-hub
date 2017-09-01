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