define(["sitecore"], function (_sc) {
    _sc.Factories.createBaseComponent({

        name: "AnalyticsItemPicker",
        base: "BlockBase",
        selector: ".sc-AnalyticsItemPicker",

        attributes: [
            { name: "items", defaultValue: {}, value: "$el.data:sc-items" },
            { name: "selectedItems", defaultValue: "", value: "$el.data:sc-selecteditems" },
            { name : "isEnabled", defaultValue: true }
        ],

        extendModel: {
            show: function () {
                this.trigger("show");
            },
            hide: function () {
                this.trigger("hide");
            },
            addItem: function () {
                this.trigger("addItem");
            },
            removeItem: function () {
                this.trigger("removeItem");
            }
        },

        findItemById: function (id) {

            var item = $.grep(this.availableItemList(), function (item) {
                if (item.itemId === id) {
                    return item;
                }
            });

            return item[0];
        },

        availableItemList: function () {
            var availableItemsControl = this.availableItemsControl();

            return availableItemsControl.get("items") || [];
        },

        selectedItemList: function () {
            var selectedItemsControl = this.selectedItemsControl();

            return selectedItemsControl.get("items") || [];
        },

        controlId: function() {
            return this.$el.data().scId;
        },

        availableItemsControl: function () {
            var controlId = this.controlId() + "AvailableItems";
            return this.app[controlId];
        },

        selectedItemsControl: function () {
            var controlId = this.controlId() + "SelectedItems";
            return this.app[controlId];
        },

        addButtonControl: function() {
            var controlId = this.controlId() + "AddButton";
            return this.app[controlId];
        },

        removeButtonControl: function() {
            var controlId = this.controlId() + "RemoveButton";
            return this.app[controlId];
        },

        initialize: function () {
            this._super();

            this.model.on("show", this.show, this);
            this.model.on("hide", this.hide, this);
            this.model.on("addItem", this.addItem, this);
            this.model.on("removeItem", this.removeItem, this);
            this.model.on('change:isEnabled', this.toggleEnabled, this);

            var selectedItemsControl = this.selectedItemsControl();
            if (!!selectedItemsControl) {
                selectedItemsControl.on('change:items', function() {
                    this.model.trigger('change:items');
                }, this);
            }
        },

        show: function () {
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        toggleEnabled: function () {
            var controls = [this.addButtonControl(), this.removeButtonControl()];

            var state = this.model.get('isEnabled');
            _.each(controls, function (ctrl) {
                if (ctrl) {
                    ctrl.set('isEnabled', state);
                }
            });
        },

        addItem: function () {
            var availableItemsControl = this.availableItemsControl();
            var selectedItemsControl = this.selectedItemsControl();

            var selectedItem = availableItemsControl.get('selectedItem');

            if (!selectedItem) {
                return;
            }

            this.addSelectedToList(selectedItem, selectedItemsControl);
        },

        removeItem: function () {
            var selectedItemsControl = this.selectedItemsControl();

            var selectedItem = selectedItemsControl.get('selectedItem');

            if (selectedItem) {
                var selectedItems = selectedItemsControl.get("items") || [];

                var cleaned = $.grep(selectedItems, function (item) {
                    return item.itemId !== selectedItem.itemId;
                });

                selectedItemsControl.set("items", cleaned);
            }
        },

        addEventToList: function (id, datasource, list) {
            var events = $.grep(datasource, function (item) {
                return item.itemId === id;
            });

            if (events.length === 1) {
                this.addSelectedToList(events[0], list);
            }
        },

        addSelectedToList: function (selected, list) {
            var current = list.get('items') || [];
            var exists = $.grep(current, function (item) {
                return item.itemId === selected.itemId;
            });

            if (exists.length === 0) {
                current.push(selected);
                list.viewModel.items(current);
                list.trigger('change:items', list);
            }
        }
    });
});
