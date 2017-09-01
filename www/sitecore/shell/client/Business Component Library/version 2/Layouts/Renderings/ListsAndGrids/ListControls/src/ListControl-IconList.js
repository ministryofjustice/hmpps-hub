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