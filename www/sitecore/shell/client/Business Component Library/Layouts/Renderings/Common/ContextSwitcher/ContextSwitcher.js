define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ContextSwitcher",
    base: "InputControlBase",
    selector: ".sc-contextswitcher",
    attributes: [
      { name: "isVisible", value: "$el.data:sc-isvisible" },
      { name: "isEnabled", value: "$el.data:sc-isenabled" },
      { name: "tooltip", value: "$el.data:sc-tooltip" },
      { name: "scrollable", defaultValue: false },
      { name: "isOpen", defaultValue: false },
      { name: "tabName", value: "" },
      { name: "selectedItem", defaultValue: null },
      { name: "items", defaultValue: [], value: [] }
    ],

    extendModel: {
      selectItemAt: function (index) {
        this.selectItem(this.getItems()[index]);
      },

      selectItem: function (item) {
        this.set("selectedItem", item);
        this.set({
          isOpen: false,
          tabName: item ? item.Name : ""
        });
      },

      getSelectedIndex: function () {
        return this.getItems().indexOf(this.get("selectedItem"));
      },

      selectDefaultItem: function () {
        var reversedItems = this.getItems().slice(0).reverse(),
          selectedItem = _.findWhere(reversedItems, { Selected: '1' }) || _.findWhere(reversedItems, { Selected: true });

        if (selectedItem) {
          this.selectItem(selectedItem);
        } else {
          this.selectItemAt(0);
        }
      },

      getItems: function () {
        return this.get("items") || [];
      }
    },

    initialize: function () {
      this._super();
      this.model.on("change:items", this.updateItems, this);
      this.model.on("change:selectedItem", this.onSelectedItemChange, this);
      this.model.on("change", this.render, this);
    },

    onSelectedItemChange: function () {
      // only way to ensure that other properties like 'tabName' will be updated when selectedItem changes
      this.model.selectItem(this.model.get("selectedItem"));
    },

    toggle: function () {
      this.model.set("isOpen", !this.model.get("isOpen") && this.model.get("isEnabled"));
    },
    
    _setupButtons: function (items) {
      var columns = items.length === 1 ? 1 : items.length > 12 ? 3 : 2;
      var rows = Math.ceil(items.length / columns);
      var i = 0;
      if (items.length >= 12 && items.length <= 18) {
        rows = 6;
      }
      this.model.set("scrollable", items.length > 18);
      for (var r = 0; r < rows; r++) {
        $('.sc-contextswitcher-table').append('<div class="sc-contextswitcher-row"/>');
        for (var c = 0; c < columns; c++) {    
          $('.sc-contextswitcher-row:last').append('<div class="sc-contextswitcher-cell"/>');
          var element = "";
          if (items[i]) {
            element = "<button index='" + i + "' class='sc-contextswitcher-item'";
            element += items[i].Tooltip ? " title='" + items[i].Tooltip + "'" : "";
            element += ">" + items[i].Name + "</button>";
          }
          $('.sc-contextswitcher-cell:last').append(element);
          i++;
        }
      }
    },
    _addClickEvents: function () {
      var that = this;
      this.$el.find(".sc-contextswitcher-item").on("click", function (e) {
        var index = this.getAttribute('index');
        that.model.selectItemAt(index);

        var item = that.model.get("selectedItem");
        return item.Click ? _sc.Helpers.invocation.execute(item.Click, { app: that.app }) : null;
      });
    },

    updateSelectedItem: function (index) {
      this.model.selectItemAt(index);
    },

    updateItems: function () {
      this.$el.find(".sc-contextswitcher-table").html('');
      var items = this.model.getItems();
      
      this._setupButtons(items);
      this._addClickEvents();
      this.model.selectDefaultItem();
    },

    render: function () {
      var index = this.model.getSelectedIndex();
      this.model.set("tabName", this.model.get("tabName"));
      this.$el.find('button').removeClass("selected");
      this.$el.find('button[index=' + index + ']').addClass("selected");
    }
  });
});