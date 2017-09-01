(function(speak) {
  speak.component(["itemJS", "bclSession"], function (itemJS) {
    var lastPage = 0
      , isReady = false
      , pendingRequests = 0;

    var subscribe = function(control) {
      control.on("change:SearchQuery change:PageSize change:PageIndex change:SelectedFacets change:RootItemId change:SearchConfigItemId change:Sorting change:ShowHiddenItems", control.loadData, control);
    };

    var getFacets = function(control, search, selectedFacets) {
      var result = "";

      var facets = {};
      _.each(selectedFacets, function(facet) {
        if (!facets[facet.name]) {
          facets[facet.name] = [];
        }

        facets[facet.name].push(facet.value);
      }, control);

      _.each(_.keys(facets), function(name) {
        var s = "";
        _.each(facets[name], function(i) {
          s += (s != "" ? " OR " : "") + i;
        }, this);

        result += (result != "" ? " AND " : "") + "(" + s + ")";
      }, control);

      if (result != "") {
        search += (search !== "" ? " AND " : "") + result;
      }

      return search;
    };

    var getOptions = function(control) {
      var options = {}, fields;
      var pageSize = control.PageSize;
      if (pageSize) {
        options.pageSize = pageSize;
        options.pageIndex = lastPage;
      }

      fields = control.Fields && control.Fields.split("|");
      if (fields && fields.length > 0) {
        options.fields = fields;
      } else {
        options.payLoad = "full";
      }

      options.root = control.SearchRootItemId;
      options.language = control.LanguageName;
      options.database = control.DatabaseName;
      options.facetsRootItemId = control.FacetsRootItemId;
      options.searchConfig = control.SearchConfigItemId;

      if (control.Formatting != "") {
        options.formatting = control.Formatting;
      }

      if (control.Sorting != "") {
        options.sorting = control.Sorting;
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

      if (lastPage > 0) {
        items = this.Items.concat(items);
        this.set("Items", items, { force: true });
      } else {
        this.set("Items", items, { force: true });
        this.Facets = result.facets ? result.facets : [];
      }

      this.TotalItemsCount = totalCount;
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

      var search = control.SearchQuery,
        options = getOptions(control),
        searchText,
        selectedFacets;

      if (!search && !options.root && !options.searchConfig) {
        return;
      }

      searchText = search || "";

      selectedFacets = control.SelectedFacets;
      if (selectedFacets != null && selectedFacets.length > 0) {
        searchText = getFacets(control, searchText, selectedFacets);
      }
      options.searchText = searchText;

      pendingRequests++;
      control.IsBusy = true;

      itemJS.search(options, $.proxy(completed, control));
    };

    return {
      name: "SearchDataSource",

      initialized: function () {
        this.SelectedFacets = [];
        this.Facets = [];
        this.Items = [];
        this.TotalItemsCount = 0;
        this.IsBusy = false;
        this.HasData = false;
        this.HasNoData = true;
        this.HasMoreData = false;
      },

      afterRender: function () {
        isReady = true;

        if (!this.IsLoadDataDeferred) {
          this.loadData();
        }

        subscribe(this);
      },

      loadData: function () {
        this.PageIndex = 0;
        lastPage = 0;
        loadItems(this);
      },

      next: function () {
        lastPage++;
        loadItems(this);
      }      

    };
  }, "SearchDataSource");
})(Sitecore.Speak);