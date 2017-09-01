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