define(["sitecore"], function (_sc) {
  "use strict";

  var model = _sc.Definitions.Models.ComponentModel.extend({
      initialize: function(attributes)
      {
        this._super();

        this.set("query", "");
        this.set("language", "");
        this.set("database", "");
        this.set("pageSize", 0);
        this.set("pageIndex", 0);
        this.set("pageCount", 1);
        this.set("totalItemsCount", 0);
        this.set("items", []);
        this.set("fields", null);
        this.set("isBusy", false);
        this.set("hasItems", false);
        this.set("hasNoItems", true);
        this.set("hasMoreItems", false);
        this.set("formatting", "");
        this.set("showHiddenItems", false);

        this.on("change:query change:pageSize change:pageIndex", this.refresh, this);

        this.pendingRequests = 0;
      },

      refresh: function()
      {
        var query = this.get("query"), options = {}, fields;
        if (!query)
        {
          return;
        }

        var pageSize = this.get("pageSize");
        if (pageSize)
        {
          options.pageSize = pageSize;
          options.pageIndex = this.get("pageIndex");
        }

        fields = this.get("fields");
        if (fields && fields.length > 0)
        {
          options.fields = fields;
        }
        else
        {
          options.payLoad = "full";
        }

        var language = this.get("language");
        if (language)
        {
          options.language = language;
        }
        var formatting = this.get("formatting");
        if (formatting) {
          options.formatting = formatting;
        }
        if (this.get("showHiddenItems")) {
          options.showHiddenItems = true;
        }
        
        var databaseUri = new _sc.Definitions.Data.DatabaseUri(this.get("database"));
        var database = new _sc.Definitions.Data.Database(databaseUri);
        
        this.pendingRequests++;
        this.set("isBusy", true);

        database.query(query, $.proxy(this.completed, this), options);
      },

      completed: function(items, totalCount, result)
      {
        if (result.statusCode === 401) {
          _sc.Helpers.session.unauthorized();
          return;
        }
        
        // logic for parsing dates when $send_localized_dates formatting is set
        var formatting = this.get("formatting");
        if (formatting && formatting.toLowerCase().indexOf("$send_localized_dates") > -1) {
          _.each(items, function (item) {
            var formattedFields = [];
            _.each(item.$fields, function (field) {
              var fieldType = field.type ? field.type.toLowerCase() : '';
              if (fieldType === "datetime" || fieldType === "date") {
                formattedFields[field.fieldName] = {
                  type: field.type,
                  formattedValue: field.formattedValue,
                  longDateValue: field.longDateValue,
                  shortDateValue: field.shortDateValue
                };
              }
            });
            //obsolete should be removed when the breaking changes can be introduced
            //extend item with formated fields
            item.$formatedFields = formattedFields;

            //corrected property  '$formatedFields' -> '$formattedFields'
            item.$formattedFields = formattedFields;
          });
        }
        
        this.set("items", items);
        this.set("totalItemsCount", totalCount);
        var pageSize = this.get("pageSize");
        if (pageSize <= 1)
        {
          this.set("pageCount", 1);
        }

        this.set("pageCount", Math.ceil(totalCount / pageSize));

        this.set("totalItemsCount", totalCount);
        this.set("hasItems", items && items.length > 0);
        this.set("hasNoItems", !items || items.length === 0);
        this.set("hasMoreItems", items.length < totalCount);
        
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      }
    }
  );

  var view = _sc.Definitions.Views.ComponentView.extend({
      initialize: function(options)
      {
        this._super();

        var pageIndex, pageSize, fields;

        pageIndex = parseInt(this.$el.attr("data-sc-pageindex")) || 0;
        this.model.set("pageIndex", pageIndex);

        pageSize = parseInt(this.$el.attr("data-sc-pagesize")) || 0;
        this.model.set("pageSize", pageSize);
        
        if (this.$el.is("[data-sc-fields]"))
        {
          fields = $.parseJSON(this.$el.attr("data-sc-fields"));
          this.model.set("fields", fields);
        }
        else
        {
          this.model.set("fields", null);
        }

        this.model.set("items", []);
        
        this.model.set("language", this.$el.attr("data-sc-language"));
        this.model.set("database", this.$el.attr("data-sc-database") || "master");
        this.model.set("formatting", this.$el.attr("data-sc-formatting"));
        this.model.set("showHiddenItems", this.$el.data("sc-showhiddenitems"));
        this.model.set("query", this.$el.attr("data-sc-query") || "");
      }
    }
  );

  _sc.Factories.createComponent("QueryDataSource", model, view, "script[type='text/x-sitecore-querydatasource']");
});