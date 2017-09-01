require.config({
    paths: {
        MultiSelectList: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/behaviors/multiselectlist"
    }
});

define(["sitecore", "knockout", "underscore", "MultiSelectList"], function (sc, ko, _, multiSelectList) {
    var multiSelectListBehavior = sc.Behaviors["MultiSelectList"];

    var multiSelectListExtended = _.extend(_.clone(multiSelectListBehavior), {

        beforeRender: function () {
            this.model.set({
                checkedItems: [],
                checkedItemIds: []
            });

            this.model.on("change:checkedItems", this.checkedItemsChanged, this);

            var handlers = this.model.on("change:items", function () {
                this.model.set({
                    checkedItems: [],
                    disabledItems: this.model.get("items")
                });
            }, this)._events["change:items"];

            handlers.unshift(handlers.pop());
        },
        afterRender: function () {
            this.allCheck = [];
            var items = this.model.get("items");
            if (items && items.length) {
                _.each(this.$el.find("thead tr"), this.insertGlobalcheck, this);
                _.each(this.$el.find(".sc-table tbody tr"), this.insertcheck, this);

                //#48264,yvy: add "itemdId" into "tr" element
                var $listTR = this.$el.find(".sc-table tbody tr");
                if (items.length === $listTR.length) {
                    for (var i = 0; i < items.length; i++) {
                        var $tr = $($listTR[i]);
                        var item = items[i];

                        var uid = this.getItemUid(item);

                        if (uid) {
                            $tr.attr("itemId", uid);
                        }

                        // Disable checkboxes on Original variations
                        if (item.IsOriginal) {
                            $tr.find("input[type='checkbox']").prop("disabled", true);
                        }
                    }
                }

                this.globalCheck = this.$el.find(".sc-cball");
                this.on("addrow", this.addrow);
            }

        },

        checkCell: function (evt) {
            // Abort handler if the checkbox is disabled
            var $current = $(evt.currentTarget);
            if ($current.find("input[type='checkbox']").prop("disabled")) {
                return;
            }

            multiSelectListBehavior.checkCell(evt);
        },

        checkedItemsChanged: function () {
            var checkedItems = this.model.get("checkedItems");

            var checkedIds = _.map(checkedItems, this.getItemUid);

            _.each(checkedIds, function (item) {
                var $trFound = this.$el.find("[itemId='" + item + "']");
                if ($trFound.length > 0) {
                    $trFound.find("input[type='checkbox']").attr("checked", true);
                }

            }, this);


            var items = this.model.get("items");

            var disabledItems = _.filter(items, function (item) {
                return !_.contains(checkedIds, multiSelectListExtended.getItemUid(item));
            });

            this.model.set("disabledItems", disabledItems);
        },

        check: function (evt) {
            var $current = $(evt.currentTarget);

            // Determine the checked items. Can't use identity checking on checkedItems as the identity may have changed
            // Identity will change if the data source changes
            var checkedRows = this.$el.find(".sc-cb:checked").closest("tr");

            // Check on requiring of the enabled rows
            var requiredEnabledRowCount = this.model.get("requiredEnabledRowCount");
            if (requiredEnabledRowCount) {
                var requireAllowed = parseInt(requiredEnabledRowCount);
                if (checkedRows.length < requireAllowed) {
                    $current[0].checked = true;
                    // Trigger validation event to handle try to disable the last item in the list
                    this.model.trigger("validation:disableLastItem", this.model);
                    return;
                }
            }

            var checkedIds = checkedRows.map(function (index) {
                return $(this).attr("itemId");
            }).toArray();

            var items = this.model.get("items");
            var enabledItems = _.filter(items, function (item) {
                return _.contains(checkedIds, multiSelectListExtended.getItemUid(item));
            });

            this.model.set("checkedItems", enabledItems);
            this.model.set("checkedItemIds", checkedIds);

            var totalRows = this.$el.find(".sc-table tbody tr").length;

            this.globalCheck.prop("checked", (checkedRows > 0 && checkedRows === totalRows));
            this.model.trigger("change:checkItem", this.model);
        },

        checkAll: function () {
            var items = this.model.get("items");
            if (items) {
                this.model.set("checkedItems", items);
            }
        },

        disableRow: function (itemId) {
            if (!itemId) {
                return;
            }

            var $trFound = this.$el.find("[itemId='" + itemId + "']");
            if ($trFound.length > 0) {
                $trFound.find("input[type='checkbox']").attr("disabled", true);
            }
        },

        getItemUid: function(item) {
            return item.itemId || item.UId;
        }
    });

    sc.Factories.createBehavior("MultiSelectListExtended", multiSelectListExtended);
});