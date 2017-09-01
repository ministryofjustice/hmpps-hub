(function () {
  // The trick to test in node and in browser.
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/commonPagesDefinition.js", "/-/speak/v1/listmanager/commonListPagesDefinition.js"]
    : [null, "../../commonPagesDefinition", {}];
  define(dependencies, function (sitecore, commonPagesDefinition, commonListPagesDefinition) {
    var self;

    var extensionObject = {
      isFirstInit: true,
      reload: function (callback) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.rebindData(current.baseStructures, callback);
      },
      toggleProgressIndicator: function (context) {
        var dataSource = context.dataSource || this.DialogListsDataSource,
          listControl = context.control || this.DialogListControl,
          isBusy = dataSource.get('isBusy'),
          listControlIsVisible = listControl.viewModel.$el.is(':visible'),
          targetControl = listControlIsVisible ?
            this.DialogListProgressIndicator.viewModel.$el.data('sc-target-control') :
            null,
          params = {
            isBusy: isBusy,
            targetControl: targetControl,
            isFullScreen: listControlIsVisible ? false : true
          };

          this.DialogListProgressIndicator.set(params);
      },
      rebindData: function (baseStructures, dataBindCallback) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        Array.prototype.forEach.call(baseStructures, function (baseStructure) {
          if (current.isFirstInit) {
            baseStructure.defaultPageSize = baseStructure.dataSource.get(current.pageSizeKey);
            baseStructure.defaultFolder = baseStructure.dataSource.get(current.folderParameterKey);
            baseStructure.control.off("change:selectedItem").on("change:selectedItem", function () {
              var realbaseStructure = Array.prototype.filter.call(current.baseStructures, function (e) {
                return e.dataSource === baseStructure.dataSource;
              })[0];
              current.updateListOfLists(realbaseStructure);
            }, current);
            baseStructure.dataSource.on("change:isBusy", function (dataSource, isBusy) {
              current.initializeListOfLists(dataSource, isBusy, dataBindCallback);
              current.toggleProgressIndicator(baseStructure);
            }, current);
          }
          current.isFirstInit = false;
          current.reloadListOfLists(baseStructure);
        });
      },
      initializeSpecificControls: function () {
        self = this;
        self.baseStructures = [
          {
            control: self.DialogListControl,
            dataSource: self.DialogListsDataSource,
          }
        ];

        self.ListsSearchButtonTextBox.viewModel.$el.keyup(self.listsSearchButtonTextBoxKeyUp);
        self.initializeSpecificControlsExtended();
      },
      initializeSpecificControlsExtended: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        current.ListPathControl.reset();
        current.ListPathControl.on("change:SelectedItemId", current.onListPathChanged, current);

        //local triggers
        current.on("select:contactlists:dialog:button:ok:clicked", current.buttonOk, current);
        current.on("select:contactlists:dialog:button:cancel:clicked", current.buttonCancel, current);

        //Sitecore trigger
        current.on("app:loaded", function () {
          current.getSitecore().trigger("dialog:loaded", current);
        });

        current.getSitecore().on("select:contactlists:dialog:show", function (callback, excludelists, currentListId, filter) {
          current.showDialog({ callback: callback, excludelists: excludelists, currentListId: currentListId, filter: filter });
        });
      },
      initializeDataSourceExtended: function (baseStructure) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        baseStructure.dataSource.on("folderSelected", current.enterFolder, current);
        baseStructure.dataSource.unsubscribeFromSelectListOrFolder();
      },
      bindDataExtended: function () {
      },
      initializeDialogs: function () {
      },
      reloadListOfLists: function (baseStructure) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        if (typeof baseStructure.defaultFolder !== "undefined" && baseStructure.defaultFolder !== null) {
          var currentFolder = baseStructure.dataSource.get(current.folderParameterKey);
          if (baseStructure.defaultFolder !== currentFolder) {
            baseStructure.dataSource.set(current.folderParameterKey, baseStructure.defaultFolder);
            baseStructure.dataSource.ancestorIds = [""];
            current.ListPathControl.reset();
          }
        }

        var currentPageSize = baseStructure.dataSource.get(current.pageSizeKey);

        if (typeof baseStructure.defaultPageSize !== "undefined" && baseStructure.defaultPageSize !== null) {
          currentPageSize = baseStructure.defaultPageSize;
        }

        if (typeof current.ExcludeLists !== "undefined" && current.ExcludeLists !== null && current.ExcludeLists.length !== 0) {
          currentPageSize = currentPageSize + current.ExcludeLists.length;
        }

        if (typeof current.CurrentListId !== "undefined" && current.CurrentListId !== null && current.CurrentListId !== "") {
          currentPageSize = currentPageSize + 1;
        }

        baseStructure.dataSource.set(current.pageSizeKey, currentPageSize, { silent: true });

        var filter = baseStructure.dataSource.get(current.filterParameterKey);
        if (filter !== current.Filter) {
          baseStructure.dataSource.set(current.filterParameterKey, current.Filter, { silent: true });
        }

        baseStructure.dataSource.refresh();
      },
      initializeListOfLists: function (dataSource, isBusy, callback) {
        if (isBusy === false && dataSource.isReady === true) {
          var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
          var baseStructure = Array.prototype.filter.call(current.baseStructures, function (e) {
            return e.dataSource === dataSource;
          })[0];

          var items = dataSource.get("items").slice();
          if (typeof current.CurrentListId != "undefined" && current.CurrentListId != null && current.CurrentListId != "") {
            var currentListId = current.CurrentListId;
            for (var i = 0; i < items.length; i++) {
              if (items[i].Id == currentListId) {
                items.splice(i--, 1);
              } else {
                if (current.ExcludeLists != null && $.inArray(items[i].Id, current.ExcludeLists) != -1) {
                  items.splice(i--, 1);
                }
              }
            }
          } else {
            for (var k = 0; k < items.length; k++) {
              if (current.ExcludeLists != null && $.inArray(items[k].Id, current.ExcludeLists) != -1) {
                items.splice(k--, 1);
              }
            }
          }

          baseStructure.control.set("items", items);

          if (callback && (typeof (callback) === typeof (Function))) {
            callback();
          }
        }
      },
      updateListOfLists: function (baseStructure) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        var selectedItem = baseStructure.control.get("selectedItem");
        if (typeof selectedItem === "undefined" || selectedItem === null || selectedItem === "") {
          current.ButtonOK.set("isEnabled", false);
          current.SelectedItem = null;
          current.SelectedId = null;
          return;
        }
        var selectedItemId = selectedItem.get("Id");
        var selectedItemType = selectedItem.get("Type");
        var selectedItemName = selectedItem.get("Name");
        var selectedItemAccess = selectedItem.get("Access");
        var selectedItemCreated = selectedItem.get("Created");
        var selectedItemOwner = selectedItem.get("Owner");
        var selectedItemUpdated = selectedItem.get("Updated");
        var selectedItemTypeName = selectedItem.get("TypeName");
        var selectedItemRecipients = selectedItem.get("Recipients");

        if (selectedItemType.toString() === current.folderType) {
          baseStructure.dataSource.selectListOrFolder(selectedItemId, selectedItemType, selectedItemName);
          current.ButtonOK.set("isEnabled", false);
          return;
        }
        var copyOfSelectedItem = {
          Id: selectedItemId,
          Name: selectedItemName,
          Type: selectedItemType,
          Access: selectedItemAccess,
          Created: selectedItemCreated,
          Owner: selectedItemOwner,
          Updated: selectedItemUpdated,
          TypeName: selectedItemTypeName,
          Recipients: selectedItemRecipients
        };
        // Workaround for ListControl
        copyOfSelectedItem.itemId = selectedItemId;
        current.SelectedItem = copyOfSelectedItem;
        current.SelectedId = selectedItemId;
        current.ButtonOK.set("isEnabled", true);
      },
      showDialog: function (dialogParams) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        current.CallBackFunction = null;
        current.CancelCallBackFunction = null;
        current.CurrentListId = null;
        current.SelectedId = null;
        current.SelectedItem = null;
        current.ExcludeLists = [];
        current.Filter = "";

        var callback = dialogParams.callback;
        var cancelCallback = dialogParams.cancelCallback;
        var excludelists = dialogParams.excludelists;
        var currentListId = dialogParams.currentListId;
        var filter = dialogParams.filter;

        if (typeof callback !== "undefined" && callback !== null && typeof callback === "function") {
          current.CallBackFunction = callback;
        }
        if (typeof cancelCallback !== "undefined" && cancelCallback !== null && typeof cancelCallback === "function") {
          current.CancelCallBackFunction = cancelCallback;
        }
        if (typeof excludelists !== "undefined" && excludelists !== null && Object.prototype.toString.call(excludelists) === "[object Array]") {
          current.ExcludeLists = excludelists;
        }
        if (typeof currentListId !== "undefined" && currentListId !== null && currentListId !== "") {
          current.CurrentListId = currentListId;
        }
        if (typeof filter !== "undefined" && filter !== null && filter !== "") {
          current.Filter = filter;
        }

        Array.prototype.forEach.call(current.baseStructures, function (baseStructure) {
          baseStructure.control.set("selectedItemId", null);
          baseStructure.control.set("selectedItem", null);
          baseStructure.control.set("defaultSelectedItemId", null);
        });

        current.SelectContactListsDialog.viewModel.$el.one('shown.bs.modal', _.bind(current.toggleProgressIndicator, current));
        // TODO : RELOAD LIST SO NOTHING IS SELECTED
        current.reload(function () {
          current.SelectContactListsDialog.show();
        });
      },
      buttonOk: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.hideDialog();
        if (current.CallBackFunction) {
          current.CallBackFunction(current.SelectedId, current.SelectedItem);
        }
      },
      buttonCancel: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.hideDialog();
        if (current.CancelCallBackFunction) {
          current.CancelCallBackFunction();
        }
      },
      hideDialog: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.SelectContactListsDialog.hide();
      },
      getSitecore: function () {
        return sitecore;
      }
    };
    return commonPagesDefinition.mergeListPages(commonListPagesDefinition, extensionObject);
  });
})();

