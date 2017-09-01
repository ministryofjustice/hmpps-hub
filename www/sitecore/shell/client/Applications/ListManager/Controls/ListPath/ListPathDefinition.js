define(function () {
  return {
    model: {
      initialize: function (options) {
        this._super();
        this.set("Items", []);
        this.set("SelectedItemId", null);
      },

      pushItem: function (id, name) {
        var itemToInsert = { Name: name, Id: id };
        var items = this.get("Items");
        var itemsArray = [];
        itemsArray = itemsArray.concat(items);
        itemsArray.push(itemToInsert);
        this.set("Items", itemsArray);
        this.set("SelectedItemId", id);
      },

      popItem: function () {
        var items = this.get("Items");
        if (items.length <= 1) {
          return;
        }

        items = items.slice(0, items.length - 1);
        this.set("Items", items);
        this.set("SelectedItemId", items[items.length - 1].Id);
      },

      sliceItems: function (id) {
        var items = this.get("Items");
        var itemsArray = [];
        items.every(function (el) {
          itemsArray.push(el);
          return el.Id != id;
        });
        this.set("Items", itemsArray);
        this.set("SelectedItemId", id);
      },

      reset: function () {
        var items = this.get("Items");
        this.set("Items", [items[0]]);
      }
    },
    view: {
      initialize: function (options) {
        this._super();

        var rootItemName = this.$el.data("sc-rootname");
        this.model.pushItem("", rootItemName);
      },

      itemClick: function (item) {
        var itemId = item.Id.slice();
        this.model.sliceItems(itemId);
      }
    }
  };
});