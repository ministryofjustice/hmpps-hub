(function () {
  // The trick to test in node and in browser.
  var dependencies = (typeof window !== "undefined")
    ? ["/-/speak/v1/listmanager/commonPagesDefinition.js", "/-/speak/v1/listmanager/commonListPagesDefinition.js"]
    : ["../commonPagesDefinition", "../commonListPagesDefinition"];
  define(dependencies, function (commonPagesDefinition, commonListPagesDefinition) {
    var extensionObject = {
      initializeSpecificControls: function () {
        this.baseStructures = [
          {
            control: this.RecentlyCreatedListsListControl,
            dataSource: this.RecentlyCreatedListsListsDataSource,
            actionsDataSource: this.RecentlyCreatedListsActionsDataSource,
            actionControl: this.RecentlyCreatedListsActionControl
          },
          {
            control: this.MyListsListControl,
            dataSource: this.MyListsListsDataSource,
            actionsDataSource: this.MyListsActionsDataSource,
            actionControl: this.MyListsActionControl
          }
        ];
        this.bindData(this.baseStructures);
      },

      findLists: function () {
      },

      listsSearchButtonTextBoxKeyUp: function (e) {
      }
    };
    return commonPagesDefinition.mergeListPages(commonListPagesDefinition, extensionObject);
  });
})();
