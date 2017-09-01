define(["sitecore"], function (Sitecore) {
    Sitecore.Factories.createBaseComponent({
        name: "FilteringDataSource",
        base: "ControlBase",
        selector: "script[type='x-sitecore-filteringdatasource']",
        attributes: [
            { name: "sourceItems", defaultValue: [], value: "$el.data:sc-sourceitems" },
            { name: "wipItems", defaultValue: [] },
            { name: "items", defaultValue: [] },
            { name: "filterFunction", defaultValue: null },
            { name: "createFilterContextFunction", defaultValue: null },
            { name: "createFilterContextContext", defaultValue: null }
        ],

        initialize: function() {
            this._super();

            this.model.on("change:sourceItems", this._setWipItems, this);
            this.model.on("change:wipItems", this._filterItems, this);
        },

        extendModel: {
            refresh: function () {
                this.viewModel._filterItems();
            }
        },

        _setWipItems: function () {
            var items = this.model.get("sourceItems");
            if (!items) {
                return;
            }

            // Clone the source items in case the filter function alters them
            items = _.map(items, function (item) {
                return _.clone(item);
            });

            this.model.set("wipItems", items);
        },

        _filterItems: function () {
            var items = this.model.get("wipItems");
            if (!items) {
                return;
            }

            var filterFunction = this.model.get("filterFunction");

            if (filterFunction) {
                var filterContext = null;
                var createFilterContextFunction = this.model.get("createFilterContextFunction");
                var createFilterContextContext = this.model.get("createFilterContextContext");

                if (createFilterContextFunction) {
                    if (createFilterContextContext) {
                        filterContext = createFilterContextFunction.apply(createFilterContextContext);
                    } else {
                        filterContext = createFilterContextFunction();
                    }
                }

                items = _.filter(items, filterFunction, { filterContext: filterContext });
            }

            this.model.set("items", items);
        }
    });
});