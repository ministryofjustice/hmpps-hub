(function(speak) {

  speak.component(["itemJS", "bclSession"], function (itemJS) {
    var isReady = false
      , pendingRequests = 0;

    var subscribe = function(control) {
      control.on("change:Query change:PageSize change:PageIndex", control.loadData, control);
    };

    var getOptions = function(control) {
      var options = {}, fields;
      var pageSize = control.PageSize;
      if (pageSize) {
        options.pageSize = pageSize;
        options.pageIndex = control.PageIndex;
      }

      fields = control.Fields && control.Fields.split("|");
      if (fields && fields.length > 0) {
        options.fields = fields;
      } else {
        options.payLoad = "full";
      }

      options.language = control.LanguageName;
      options.database = control.DatabaseName;

      if (control.Formatting != "") {
        options.formatting = control.Formatting;
      }
      
      if (control.ShowHiddenItems) {
        options.showHiddenItems = true;
      }

      return options;
    };

    var completed = function(items, totalCount, result) {
      if (result.statusCode === 401) {
        var session = speak.module("bclSession");
        session.unauthorized();
        return;
      }

      this.Items = items;
      this.TotalItemsCount = totalCount;

      if (this.PageSize < 1)
        this.PageCount = 1;
      else
        this.PageCount = Math.ceil(totalCount / this.PageSize);
      
      this.HasData = items && items.length > 0;
      this.HasNoData = !items || items.length === 0;
      this.HasMoreData = items.length < totalCount;

      pendingRequests--;
      if (pendingRequests <= 0) {
        this.IsBusy = false;
        pendingRequests = 0;
      }

      this.trigger("itemsChanged");
      this.trigger("change:Items");

      if (result.statusCode === 500) {
        this.trigger("error", result.error.message);
      }
    };

    var loadItems = function (control) {
      if (!isReady) {
        return;
      }

      var query = control.Query,
        options = getOptions(control);

      if (!query) {
        return;
      }

      query = query || "";
      options.query = query;

      pendingRequests++;
      control.IsBusy = true;

      itemJS.query(options, $.proxy(completed, control));
    };

    return {
      name: "QueryDataSource",

      initialize: function () {
        this.defineProperty("PageCount", 1);
      },

      initialized: function () {
        this.Items = [];
        this.TotalItemsCount = 0;
        this.IsBusy = false;
        this.HasData = false;
        this.HasNoData = true;
        this.HasMoreData = false;
        this.PageSize = this.PageSize || 0;
        this.PageIndex = this.PageIndex || 0;
      },

      afterRender: function () {
        isReady = true;

        if (!this.IsLoadDataDeferred) {
          this.loadData();
        }

        subscribe(this);
      },

      loadData: function () {
        loadItems(this);
      }
    };
  }, "QueryDataSource");
})(Sitecore.Speak);