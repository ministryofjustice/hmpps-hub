define(["sitecore", "/-/speak/v1/FXM/Commands.js"], function (_sc) {
  return _sc.Definitions.App.extend({
    initialize: function () {
    },

    initialized: function () {

      // configure domain matcher data source
      var self = this;
      this.DomainMatcherDataSource.set("buildQuery", function (url, qsParams, control) {

        url = url + self.queryType;
        qsParams["search"] = control.get("searchText");
        qsParams["sorting"] = control.get("sorting"); // our service now supports the list control sort string format

        var pageSize = control.get("pageSize");
        qsParams["skip"] = control.get("pageIndex") * pageSize;
        qsParams["top"] = pageSize;

        return { url: url, qsParams: qsParams };
      });

      // init actions
      this.on("open:DomainMatcher", this.openDomainMatcher, this);
      this.on("search:DomainMatcher", this.searchDomainMatcher, this);
      this.on("open:ExperienceEditor", this.openExperienceEditor, this);

      //expose globally for us in control list
      _sc.on("open:DomainMatcher", this.openDomainMatcher, this);
      _sc.on("open:ExperienceEditor", this.openExperienceEditor, this);

      this.on("load:AllWebsites", function () {
        this.queryType = "QueryAll";
        this.DomainMatcherDataSource.set("autoRefresh", false);
        this.DomainMatcherDataSource.set("pageSize", 999);
        this.DomainMatcherDataSource.set("pageIndex", 0);
        this.DomainMatcherDataSource.set("sorting", "aName");
        this.DomainMatcherDataSource.set("autoRefresh", true);
        this.DomainMatcherDataSource.refresh();
      }, this);

      this.on("load:MyWebsites", function () {
        this.queryType = "QueryAllCreatedBy";
        this.DomainMatcherDataSource.set("autoRefresh", false);
        this.DomainMatcherDataSource.set("pageSize", 999);
        this.DomainMatcherDataSource.set("pageIndex", 0);
        this.DomainMatcherDataSource.set("sorting", "aName");
        this.DomainMatcherDataSource.set("autoRefresh", true);
        this.DomainMatcherDataSource.refresh();
      }, this);

      this.on("load:RecentCreatedWebsites", function () {
        this.queryType = "QueryAll";
        this.DomainMatcherDataSource.set("autoRefresh", false);
        this.DomainMatcherDataSource.set("pageSize", 999);
        this.DomainMatcherDataSource.set("pageIndex", 0);
        this.DomainMatcherDataSource.set("sorting", "dCreatedDate");
        this.DomainMatcherDataSource.set("autoRefresh", true);
        this.DomainMatcherDataSource.refresh();
      }, this);

      this.DomainMatcherListControl.on("change:selectedItemId", function () {
        var itemIsSelected = !!this.DomainMatcherListControl.get("selectedItemId");
        this.EditButton.set("isEnabled", itemIsSelected);
        this.ExperienceEditorButton.set("isEnabled", itemIsSelected);
      }, this);

      this.trigger("load:AllWebsites");

      // expand menu
      this.DashboardMenu.viewModel.$el.find('a').first().click();
      this.ContentProgressIndicator.set('isVisible', false);
    },

    checkId: function (id) {
      if (!_sc.Helpers.id.isId(id)) {
        id = this.DomainMatcherListControl.get("selectedItemId");
      }

      if (!id) {
        return false;
      }

      return id;
    },

    openExperienceEditor: function (id) {
      _sc.Commands.executeCommand('Sitecore.Speak.Commands.OpenInExperienceEditor', { id: this.checkId(id) });
    },

    openDomainMatcher: function (params) {
      if (!params) params = {};
      if (!params.id) params.id = this.DomainMatcherListControl.get("selectedItemId");
      if (params.edit == null) params.edit = false;

      if (!params.id) {
        return;
      }

      _sc.Commands.executeCommand('Sitecore.Speak.Commands.OpenDomainMatcher', params);
    },

    searchDomainMatcher: function () {
      this.DomainMatcherDataSource.set("searchText", this.SearchControl.get('text'));
    },
  });
});