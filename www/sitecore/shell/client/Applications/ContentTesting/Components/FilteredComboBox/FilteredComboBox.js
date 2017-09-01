
define(["sitecore"], function (_sc) {

  // model
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      initialize: function (options) {
        this._super();

        this.set("totalItems", 0);
        this.set("items", []);
        this.set("selectedItem", "");
        this.set("selectedGuid", "");
        this.set("selectedName", "");
        this.set("searchTerm","");
        this.set("pageSize", 5);
        this.set("page", 1);
      }
    });

  // view
  var view = _sc.Definitions.Views.ControlView.extend(
  {
    // ul-element of list
    $ulContent: null,

    // selected item
    selectedItem: null,

    // maximum amount of visible items
    maxVisibleItems: 7,

    // filtered text
    filteredText: "",

    // sorting
    sortMethodEnum : {
      'NO'   :   0,
      'ASC'  :   -1,
      'DESC' :   -2
    },
    isSorted: true,
    sortMethod: "",
    isSortChanged: false,

    // items
    items: [],

    // items sorted ASC
    itemsSortAsc: [],

    // items sorted DESC
    itemsSortDesc: [],

    // items which must be always on Top position(in spite of sorting)
    itemsTopNames: [],

    // keys code enum
    keysCodeEnum: {
      'UP': 38,
      'DOWN': 40,
      'ENTER': 13,
      'ESC': 27
    },

    localizationKeys: null,

    // timer 
    timer: -1,

    initialize: function (options) {

      var self = this;
      
      var hintText = this.$el.data("sc-hinttext");
      this.model.set("HintText", hintText);

      this.model.on("change:items change:totalItems", this.populate, this);
      this.model.on("change:selectedItem", this.selectedItemChanged, this);
      this.model.on("change:selectedGuid", this.selectByGuid, this);
      this.model.on("change:selectedItem", function () {
        if (self.model.get("selectedItem") && self.model.get("selectedItem").name) {
          self.model.set("selectedName", self.model.get("selectedItem").name);
        }
      });

      this.model.on("change:selectedItem", function () {
        if (self.model.get("selectedItem") && self.model.get("selectedItem").guid) {
          self.model.set("selectedGuid", self.model.get("selectedItem").guid);
        }
      });

      this.model.on("change:isEnabled", this.isEnabledChanged, this);

      // isSorted
      this.isSorted = !(this.$el.data("sc-issorted").toLowerCase() === "false");
      var $buttonSort = this.$el.find(".scFiltList-buttonSort");
      if (!this.isSorted) {
        $buttonSort.hide();
      }


      var $dvList = this.$el.find(".scFiltList-dvList");
      
      var searchButton = this.$el.find(".scFiltList-dvSearch");
      searchButton.click(function(){
        self.model.set({ "searchTerm": self.filteredText, "page": 1 });
      });
      

      // inputSearch
      var inputSearchElem = this.$el.find('.scFiltList-inputSearch');
      inputSearchElem.keydown(function (event) {
        inputSearchElem.removeClass("hintText");
        if ($(this).val() === hintText)
          $(this).val("");
        
        var code = event.keyCode ? event.keyCode : event.which;
        self.keyHandle(code);
      });

      // show-hide list
      this.$el.find(".scFiltList-btnList").click(function (event) {
        event.preventDefault();
        if ($dvList.css("visibility") === "visible")
          $dvList.css("visibility", "hidden");
        else if (self.isEnabled()) {
          var searchTerm = self.model.get("searchTerm");
          if (searchTerm != "")
          {
            inputSearchElem.val(searchTerm);
          }
          else
          {
            inputSearchElem.val(hintText);
            inputSearchElem.addClass("hintText");
          }

          self.filteredText = "";
          self.renderComponent();

          $dvList.css("visibility", "visible");
          inputSearchElem.focus();
        }
      });

      // click outside - hiding of the list
      $(window).click(function (event) {
        self.clickHandle(event);
      });

      //
      this.$ulContent = this.$el.find(".scFiltList-ulContent");

      // maximum visible items
      var maxVisible = this.$el.data("sc-maxitemsamountvisible");
      if (maxVisible && maxVisible > 0)
        this.maxVisibleItems = maxVisible;

      // itemsTop - on top position
      var itemsTopStr = this.$el.data("sc-itemstop");
      var arStr = itemsTopStr.split(";");
      _.each(arStr, function (item) {
        self.itemsTopNames.push(item.trim());
      });

      var $dvSelectTitle = this.$el.find(".scFiltList-dvSelectTitle");
      var heightSelTitle = $dvSelectTitle.height();
      var heightContent = this.maxVisibleItems * heightSelTitle;

      var $dvContent = this.$el.find(".scFiltList-dvContent");
      $dvContent.css("max-height", heightContent);

      // sorting button
      this.sortMethod = this.sortMethodEnum.NO;
      this.$el.find(".scFiltList-buttonSort").addClass("scFiltList-sortNo");

      this.$el.find(".scFiltList-buttonSort").click(function (event) {
        self.sortChanged(event);
      });


      this.model.set("selectedGuid", this.$el.attr("data-sc-selected-guid") || "");

      //var array = [{ Name: "One", guid: "{00000000-0000-0000-0000-000000000000}", name: "One" },
      //             { Name: "Third", guid: "{10000000-0000-0000-0000-000000000000}", name: "Third" },
      //             { Name: "Five", guid: "{20000000-0000-0000-0000-000000000000}", name: "Five" },
      //             { Name: "Seven", guid: "{30000000-0000-0000-0000-000000000000}", name: "Seven" },];
    },

    // testing options for unit-tests
    setTestingOptions: function (options) {
      if (!options)
        return;

      if(options.$el)
        this.$el = options.$el;
      if(options.model)
        this.model = options.model;
      if(options.texts)
        this.localizationKeys = options.texts;
    },

    // isEnabled
    isEnabled: function () {
      var isEnabled = this.model.get("isEnabled");
      return (typeof isEnabled == 'undefined' || isEnabled.toString() != "false");
    },

    // populating
    populate: function () {
      var self = this;

      this.items = this.model.get("items");
      this.itemsSortAsc = [];
      this.itemsSortDesc = [];
      _.each(this.items, function (item) {
        item.nameLower = item.name.toLowerCase();
        self.itemsSortAsc.push(item);
        self.itemsSortDesc.push(item);
      });

      this.itemsSortAsc.sort(this.sortAsc);
      this.itemsSortDesc.sort(this.sortDesc);

      // launching timer: for filtering and sorting
      if (this.timer > 0)
        clearInterval(this.timer);
      var intervalPeriod = 400;
      if (this.items.length > 1000)
        intervalPeriod = 1000;
      this.timer = setInterval(function () {
        self.timerHandle();
      }, intervalPeriod);

      // renreding
      this.renderComponent();
    },

    // timer handling
    timerHandle: function () {
      var self = this;
      var newFilteredText = self.$el.find(".scFiltList-inputSearch").val().toLowerCase();

      var hint = self.model.get("HintText");

      if (newFilteredText !== self.filteredText && newFilteredText !== hint.toLowerCase()) {
        self.filteredText = newFilteredText;
        //self.renderComponent();

        self.model.set({ "searchTerm": self.filteredText, "page": 1 });
      }
      else if (self.isSortChanged) {
        self.isSortChanged = false;
        self.renderComponent();
      }
    },

    // sorting changed
    sortChanged: function (event) {
      var self = this;
      var $sortElem = $(event.currentTarget);

      $sortElem.removeClass("scFiltList-sortAsc scFiltList-sortNo scFiltList-sortDesc");
      if (self.sortMethod === self.sortMethodEnum.ASC) {
        self.sortMethod = self.sortMethodEnum.DESC;
        $sortElem.addClass("scFiltList-sortDesc");
      }
      else if (self.sortMethod === self.sortMethodEnum.DESC) {
        self.sortMethod = self.sortMethodEnum.NO;
        $sortElem.addClass("scFiltList-sortNo");
      }
      else if (self.sortMethod === self.sortMethodEnum.NO) {
        self.sortMethod = self.sortMethodEnum.ASC;
        $sortElem.addClass("scFiltList-sortAsc");
      }

      //
      self.isSortChanged = true;
    },

    // sorting ASC
    sortAsc: function (obj1, obj2) {
      var name1 = obj1.nameLower;
      var name2 = obj2.nameLower;
      if (name1 < name2) {
        return -1;
      }
      if (name1 > name2) {
        return 1;
      }
      return 0;
    },

    // sorting DESC
    sortDesc: function (obj1, obj2) {
      var name1 = obj1.nameLower;
      var name2 = obj2.nameLower;
      if (name1 > name2) {
        return -1;
      }
      if (name1 < name2) {
        return 1;
      }
      return 0;
    },

    // render
    renderComponent: function () {
      var self = this;

      var items = this.items;
      if (self.sortMethod === self.sortMethodEnum.ASC) {
        items = this.itemsSortAsc;
      }
      else if (self.sortMethod === self.sortMethodEnum.DESC) {
        items = this.itemsSortDesc;
      }

      this.$ulContent.html("");

      // items TOP
      _.each(this.itemsTopNames, function (name) {
        var itemFind = null;
        for (var i = 0; i < items.length; i++) {
          if (name === items[i].name) {
            itemFind = items[i];
            break;
          }
        }
        if (itemFind) {
          itemFind.isRendered = true;
          self.addRenderItem(itemFind);
        }
      });

      //
      _.each(items, function (item) {
        if (!item.isRendered && (self.filteredText === '' || item.nameLower.indexOf(self.filteredText) > -1))
          self.addRenderItem(item);
      });

      var $liSel = self.$ulContent.find(".scFiltList-liSelected");
      if ($liSel.length === 0)
        this.$ulContent.children().first().addClass("scFiltList-liSelected");
        
      var pagingBar = this.$el.find(".scFiltList-dvResultCount");
      this.renderPaginator(pagingBar);
    },
    
    renderPaginator : function(container)
    {
      container.empty();
      
      var self = this;
      var pageSize = this.model.get("pageSize");
      var totalItems = this.model.get("totalItems");
      var totalPages = Math.ceil(totalItems/pageSize);
      if (totalItems == 0)
      {
        totalPages = 1;
      }
      var page = this.model.get("page");
      var stPage;
      if(this.localizationKeys)
        stPage = this.localizationKeys.get("Page");
      if (!stPage || stPage === "")
        stPage = "Page";
      var stOf;
      if(this.localizationKeys)
        stOf = this.localizationKeys.get("of");
      if (!stOf || stOf === "")
        stOf = "of";
      var result = stPage + " " + page + " " + stOf + " " + totalPages;
      var resultDiv = $("<div class='scFiltList-dvPageCount'></div>");
      resultDiv.append(result);
      container.append(resultDiv);
      
      if (page > 1)
      {
        var backward = $("<div class='scFilList-dvPrevPage'></div>");
        backward.click(function(){
          self.model.set("page", page-1);
        });
        container.append(backward);
      }
      
      if (page+1<= totalPages)
      {
        var forward = $("<div class='scFilList-dvNextPage'></div>");
        forward.click(function(){
          self.model.set("page", page+1);
        });
        container.append(forward);
      }
    },

    // adding of the item
    addRenderItem: function (item) {
      var self = this;

      if (!item || !item.name)
        return;

      var html =
        "<li class='scFiltList-liUsual'>" +
            "<span>" + item.name + "</span>" + 
        "</li>";

      this.$ulContent.append(html);
      var itemElem = this.$ulContent.children().last();
      itemElem.mousedown(function (event) {

        self.$ulContent.find(".scFiltList-liSelected").removeClass("scFiltList-liSelected");
        $(this).addClass("scFiltList-liSelected");

        var itemFind = self.getItemOfLiSelected();
        self.setSelectedItem(itemFind);
        event.preventDefault();
      });
    },

    // set selected item
    setSelectedItem: function (item) {
      this.selectedItem = item;
      this.model.set("selectedItem", item);

      this.$el.find(".scFiltList-dvList").css("visibility", "hidden");
    },

    // selectedItemChanged 
    selectedItemChanged: function (sender, selItem) {
      //if (selItem && selItem != this.selectedItem) {
      if (selItem && selItem.name) {
        var liElem = null;
        var children = this.$ulContent.children();
        for (var i = 0; i < children.length; i++) {
          var text = $(children[i]).find("span").html();
          if (text === selItem.name) {
            liElem = children[i];
            break;
          }
        }
          
        if (liElem) {
          this.selectedItem = selItem;
          this.$ulContent.find(".scFiltList-liSelected").removeClass("scFiltList-liSelected");
          $(liElem).addClass("scFiltList-liSelected");
        }

        // 
        //this.$el.find(".scFiltList-btnList").html(selItem.name);
        this.$el.find(".scFiltList-spButton").html(selItem.name);
      }
    },

    // 
    selectByGuid: function (sender, guid) {
      var itemFind = this.findItemByParam(guid);
      this.setSelectedItem(itemFind);
    },

    // getting item of "li" selected
    getItemOfLiSelected: function () {
      var itemFind = null;
      var liSelected = this.$ulContent.find(".scFiltList-liSelected");
      if (liSelected.length > 0) {
        var val = liSelected.find("span").html();
        itemFind = this.findItemByParam(val, true);
      }

      return itemFind;
    },

    // finding item by param(name, guid)
    findItemByParam: function (val, isName) {
      var itemFind = null;
      var valLower = val.toLowerCase();
      _.each(this.items, function (item) {
        if (isName) {
          if (item.nameLower === valLower) {
            itemFind = item;
          }
        }
        else {
          if (item.guid && item.guid.toLowerCase() === valLower) {
            itemFind = item;
          }
        }
      });

      return itemFind;
    },

    // key handling
    keyHandle: function (keyCode) {
      var liSelected = this.$ulContent.find(".scFiltList-liSelected");
      if(keyCode === this.keysCodeEnum.UP || keyCode === this.keysCodeEnum.DOWN)
        liSelected.removeClass("scFiltList-liSelected");

      switch (keyCode) {
        case this.keysCodeEnum.UP:
          var liPrev = $(liSelected).prev();
          if (liPrev.length === 0)
            liPrev = liSelected;

          liPrev.addClass("scFiltList-liSelected");
          break;
        case this.keysCodeEnum.DOWN:
          var liNext = $(liSelected).next();
          if (liNext.length === 0)
            liNext = liSelected;

          liNext.addClass("scFiltList-liSelected");
          break;
        case this.keysCodeEnum.ENTER:
          var itemFind = this.getItemOfLiSelected();
          this.setSelectedItem(itemFind);
          break;
        case this.keysCodeEnum.ESC:
          this.$el.find(".scFiltList-dvList").css("visibility", "hidden");
          break;
      }

    },

    // click handling
    clickHandle: function (event) {
      var $dvList = this.$el.find(".scFiltList-dvList");

      if ($dvList.css("visibility") === "visible") {
        var top = $dvList.offset().top - this.$el.find(".scFiltList-btnList")[0].offsetHeight;
        var left = $dvList.offset().left;
        var height = $dvList.height() + this.$el.find(".scFiltList-btnList")[0].offsetHeight;
        var width = $dvList.outerWidth();
        var isLocated = event.pageX > left && event.pageX < (left + width)
                        && event.pageY > top && event.pageY < (top + height);

        if (!isLocated) {
          $dvList.css("visibility", "hidden");
        }
      }
    },

    // isEnabledChanged
    isEnabledChanged: function () {
      if (this.isEnabled())
        this.$el.removeClass("disabled");
      else
        this.$el.addClass("disabled");
    },

  });

  // create component
  _sc.Factories.createComponent("FilteredComboBox", model, view, ".sc-filteredcombobox");

});
