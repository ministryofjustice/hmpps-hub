require.config({
    paths: {
        itemService: "/sitecore/shell/client/Services/Assets/lib/itemservice"
    }
});

define(["sitecore", "itemService"], function (_sc, itemService) {
    "use strict";

    var model = Sitecore.Definitions.Models.ComponentModel.extend({
        initialize: function (attributes) {
            this._super();

            this.set("queryID", "");
            // TODO           this.set("language", "");
            this.set("database", "");
            this.set("pageSize", 0);
            this.set("pageIndex", 0);
            this.set("includeStandardTemplateFields", false);
            this.set("pageCount", 1); // TODO PDE is this the right value to initialise to?
            this.set("totalItemsCount", 0); // TODO PDE is this the right value to initialise to?
            this.set("items", []);
            this.set("fields", null);
            this.set("isBusy", false);

            this.service = new itemService({
                url: "/sitecore/api/ssc/item"
            });

            this.on("change:queryID change:pageSize change:pageIndex", this.refresh, this); // TODO review

            this.pendingRequests = 0;
        },

        refresh: function () {
            var query = this.get("queryID"), options = {}, fields;
            if (!query) {
                return;
            }

            var pageSize = this.get("pageSize");
            if (pageSize) {
                options.pageSize = pageSize;
                options.page = this.get("pageIndex");
            }

            fields = this.get("fields");

            if (fields && fields.length > 0) {
                options.fields = fields.join(",");
            }

            this.query = this.service.query(query);

            // TODO remove options ???

            if (options.pageSize) {
                this.query.take(options.pageSize);
            }

            if (options.page) {
                this.query.page(options.page);
            }

            if (this.get("database")) {
                this.query.parameter("database", this.get("database"));
            }

            if (this.get("includeStandardTemplateFields")) {
                this.query.parameter("includeStandardTemplateFields", this.get("includeStandardTemplateFields"));
            }

            // TODO
//            if (this.get("language")) {
//                this.query.parameter("language", this.get("language"));
//            }

            if (options.fields) {
                this.query.parameter("Fields", options.fields);
            }

            this.pendingRequests++;

            this.set("isBusy", true);
            var model = this;

            this.query.execute().then(function (resp) {

                model.set("totalItemsCount", resp.TotalCount);
                var pageSize = model.get("pageSize");
                if (pageSize <= 1) {
                    model.set("pageCount", 1);
                }
                model.set("pageCount", Math.ceil(resp.TotalCount / pageSize));

                model.set("hasItems", resp.Results.items && resp.Results.length > 0);
                model.set("hasNoItems", !resp.Results || resp.Results.length === 0);
                model.set("hasMoreItems", resp.Results.length < resp.TotalCount);
                model.set("items", resp.Results);

                if (model.pendingRequests <= 0) {
                    model.set("isBusy", false);
                    model.pendingRequests = 0;
                }
            });
        }
    });

    var view = Sitecore.Definitions.Views.ComponentView.extend({
        initialize: function (options) {
            this._super();

            var pageIndex, pageSize, fields;

            var includeStandardTemplateFields = (this.$el.attr("data-sc-includeStandardTemplateFields").toLowerCase() === "false") ? false : true;
            this.model.set("includeStandardTemplateFields", includeStandardTemplateFields);

            pageIndex = parseInt(this.$el.attr("data-sc-pageIndex")) || 0;
            this.model.set("pageIndex", pageIndex);

            pageSize = parseInt(this.$el.attr("data-sc-pageSize")) || 0;
            this.model.set("pageSize", pageSize);

            if (this.$el.is("[data-sc-fields]")) {
                fields = $.parseJSON(this.$el.attr("data-sc-fields") || "{}");
                this.model.set("fields", fields);
            }
            else {
                this.model.set("fields", null);
            }

            this.model.set("items", []);

// TODO           this.model.set("language", this.$el.attr("data-sc-language"));
            this.model.set("database", this.$el.attr("data-sc-database") || "master");
            this.model.set("queryID", this.$el.attr("data-sc-queryID") || "");
        }
    });

    _sc.Factories.createComponent("StoredQueryDataSource", model, view, "script[type='text/x-sitecore-storedquerydatasource']");
});