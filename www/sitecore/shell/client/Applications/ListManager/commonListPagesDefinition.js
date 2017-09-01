(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/commonPagesDefinition.js", "/-/speak/v1/listmanager/listsActoinsManager.js", "/-/speak/v1/listmanager/storageMediator.js", "/-/speak/v1/listmanager/dialogs.js"]
    : [null, "./commonPagesDefinition", "./listsActoinsManager", "./storageMediator", null];

  define(dependencies, function (sitecore, commonPagesDefinition, listsActionsManager, storageMediator, dialogs) {
    var global = {},
        fakeLocation = {
          replace: function (path) {
          }
        },
        keyUpKeyCode = 13,
        rootPath = "/sitecore/system/List Manager/Contact Lists",
        self;
    if (typeof window !== "undefined") {
      global = window;
    } else {
      global.location = fakeLocation;
    }

    var extensionObject = {
      location: {},
      initialized: function() {
        self = this;
        this.location = global.location;
        this.RootPath = rootPath;
        this.ListsActionsManager = listsActionsManager;

        this.initializeActions();
        this.initializeSpecificControls();
        this.initializeConstants();
        this.ListsActionsManager.init(this.folderType, this.contactListType, this.segmentedListType, this.topFolderName);
        this.bindData(this.baseStructures);
        
        this.initializeDialogs();
      },
      initializeActions: function() {
        this.on("convert:list", this.onConvert, this);
        this.on("delete:list", this.onDeleteList, this);
        this.on("move:list", this.onMoveList, this);
        this.on("export:csv", this.onExportToCsv, this);
        this.initializeActionsExtended();
      },
      initializeActionsExtended: function() {
      },
      initializeSpecificControls: function() {
        this.baseStructures = [
          {
            control: this.ListControl,
            dataSource: this.ListsDataSource,
            actionsDataSource: this.ActionsDataSource,
            actionControl: this.ActionControl,
          }
        ];

        this.ListsSearchButtonTextBox.viewModel.$el.keyup(this.listsSearchButtonTextBoxKeyUp);
        this.initializeSpecificControlsExtended();
      },
      initializeSpecificControlsExtended: function() {
      },
      initializeConstants: function() {
        this.folderType = this.baseStructures[0].dataSource.get("folderType");
        this.topFolderName = this.baseStructures[0].dataSource.get("topFolderName");
        this.contactListType = this.baseStructures[0].dataSource.get("contactListType").toLowerCase();
        this.segmentedListType = this.baseStructures[0].dataSource.get("segmentedListType").toLowerCase();
        this.contactListPagePattern = this.baseStructures[0].dataSource.get("contactListPagePattern");
        this.segmentedListPagePattern = this.baseStructures[0].dataSource.get("segmentedListPagePattern");
        this.folderParameterKey = "rootId";
        this.searchExpressionKey = "searchExpression";
        this.pageIndexKey = "pageIndex";
        this.defaultPageIndex = 0;
        this.languageKey = "language";
        this.filterParameterKey = "filter";
        this.pageSizeKey = "pageSize";
      },
      initializeDialogs: function() {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.Dialogs = dialogs;
        current.Dialogs.init(current.DialogsLoadOnDemandPanel);

        sitecore.on("create:lists:from:existing", function() {
          var dialogParams = {
            callback: function (item, itemId) {
              current.addSourceCallback(item, itemId, current.contactListPagePattern.replace("?id=", ""));
            },
            filter: "getContactLists"
          };
          current.Dialogs.showDialog(current.Dialogs.Ids.SelectListDialog, dialogParams);
        }, current);

        sitecore.on("create:lists:segmented:from:existing", function() {
          var dialogParams = {
            callback: function (item, itemId) {
              current.addSourceCallback(item, itemId, current.segmentedListPagePattern.replace("?id=", ""));
            },
            filter: "getContactLists"
          };
          current.Dialogs.showDialog(current.Dialogs.Ids.SelectListDialog, dialogParams);
        }, current);

        sitecore.on("import:new:contacts:dialog:create:list:from:file", function() {
          current.Dialogs.showDialog(current.Dialogs.Ids.ImportDialog, { mode: "ImportContactsAndCreateList" });
        }, current);

        sitecore.on("import:new:contacts:dialog:add:contacts:to:database", function() {
          current.Dialogs.showDialog(current.Dialogs.Ids.ImportDialog, { mode: "ImportContacts" });
        }, current);
      },
      bindData: function(baseStructures) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        Array.prototype.forEach.call(baseStructures, function(baseStructure) {
          current.initializeDataSource(baseStructure);
          current.bindDataExtended(baseStructure);
        });
      },
      bindDataExtended: function (baseStructure) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.ListsActionsManager.addBaseStructure(baseStructure);
      },
      initializeDataSource: function (baseStructure) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.initializeDataSourceExtended(baseStructure);
      },
      initializeDataSourceExtended: function (baseStructure) {
      },
      onConvert: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var targetControl = current.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          var selectedItemId = targetControl.get("selectedItemId");
          if (selectedItemId !== "") {
            var selectedItem = targetControl.get("selectedItem");
            var selectedItemType = selectedItem.get("Type");
            if (selectedItemType.toString().toLowerCase() === current.segmentedListType) {
              current.callController(parameters, "/" + selectedItemId + "/ConvertList/", current.onConvertSuccess,
                function (status, statusText) {
                  current.showDefaultError(status, statusText, current.StringDictionary.get("List is not converted."), current.ListMessageBar);
                });
            }
          }
        }
      },
      onConvertSuccess: function (data) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.location.href = current.contactListPagePattern + data + "&action=convert";
      },
      onDeleteList: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.onMoveOrDelete(
          parameters,
          [current.segmentedListType, current.contactListType],
          "The list will be deleted and all the associations to the list will be removed. This cannot be undone. Do you want to continue?",
          "DeleteListById/",
          "The list has been deleted.",
          "The list has not been deleted.");
      },
      onMoveList: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (itemId !== undefined) {
            current.onMoveOrDelete(
              parameters,
              [current.segmentedListType, current.contactListType],
              "",
              "MoveList/?destinationId=" + itemId + "&listId=",
              "The list has been moved to the selected folder.",
              "The list has not been moved to the selected folder.");
          }
        };
        var selectedItemId = current.getSelectedItemId(parameters);
        if (selectedItemId != "") {
          var selectedItemType = current.getSelectedItemType(parameters).toLowerCase();
          if (selectedItemType === current.segmentedListType || selectedItemType === current.contactListType) {
            current.selectFolder(callback, current.RootPath, null, selectedItemId);
          }
        }
      },
      onMoveOrDelete: function (parameters, types, text, methodName, onFinishMessage, errorMessage) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var targetControl = current.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          var selectedItemId = targetControl.get("selectedItemId");
          if (selectedItemId !== "") {
            var selectedItem = targetControl.get("selectedItem");
            var selectedItemType = selectedItem.get("Type");
            if (types.indexOf(selectedItemType.toString().toLowerCase()) != -1) {
              if (text === "" || confirm(current.StringDictionary.get(text))) {
                current.callController(parameters, "/" + selectedItemId + "/" + methodName,
                  function () {
                    current.onActionSuccess(onFinishMessage, targetControl);
                  },
                  function (status, statusText) {
                    current.showDefaultError(status, statusText, current.StringDictionary.get(errorMessage), current.ListMessageBar);
                  });
              }
            }
          }
        }
      },
      onActionSuccess: function (message, targetControl) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        Array.prototype.forEach.call(current.baseStructures, function (baseStructure) {
          baseStructure.dataSource.set(current.pageIndexKey, current.defaultPageIndex);
          baseStructure.dataSource.refresh();
        });
        current.showNotification(current.StringDictionary.get(message), current.ListMessageBar);
        targetControl.set("selectedItemId", "");
        targetControl.set("selectedItem", "");
      },
      onExportToCsv: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var targetControl = current.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          var selectedItem = targetControl.get("selectedItem");
          if (selectedItem.get("Type").toLowerCase() !== current.folderType.toLowerCase()) {
            var selectedItemId = selectedItem.get("Id");
            if (selectedItemId !== "") {
              var actionData = current.extractActionData(parameters);
              var fileUrl = actionData.url + "/" + selectedItemId + "/ExportContacts";
              current.downloadFile(fileUrl, current.onExportError);
            }
          }
        }
      },
      onExportError: function (message) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.showError(message, current.ListMessageBar);
      },
      listsSearchButtonTextBoxKeyUp: function (e) {
        if (e.keyCode == keyUpKeyCode) {
          var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
          current.findLists();
        }
      },
      findLists: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var searchText = current.ListsSearchButtonTextBox.get("text");
        var baseStructure = current.baseStructures[0];
        baseStructure.dataSource.set(current.searchExpressionKey, searchText);
        baseStructure.dataSource.set(current.pageIndexKey, current.defaultPageIndex);
        baseStructure.dataSource.refresh();
      },
      addSourceCallback: function (itemId, item, pagePattern) {
        if (typeof item !== "undefined" && item !== null) {
          var items = [];
          items.push(item);
          storageMediator.addToStorage("items", items);
          location.href = pagePattern + "?action=fromexisting";
        } else {
          location.href = pagePattern;
        }
      },
      selectFolder: function (callback, rootId, selectedItemId, skipItemId) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var dialogParams = {
          callback: callback,
          rootId: rootId,
          selectedItemId: selectedItemId,
          skipItemId: skipItemId
        };
        current.Dialogs.showDialog(current.Dialogs.Ids.SelectFolderDialog, dialogParams);
      },
      onListPathChanged: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        if (typeof current.ListPathControl !== "undefined" && current.ListPathControl !== null) {
          var selectedItemId = current.ListPathControl.get("SelectedItemId");
          var baseStructure = current.baseStructures[0];

          var stack = baseStructure.dataSource.ancestorIds;
          var newStack = [];
          stack.every(function(el) {
            newStack.push(el);
            return el != selectedItemId;
          });
          baseStructure.dataSource.ancestorIds = newStack;

          baseStructure.dataSource.set(current.folderParameterKey, selectedItemId);
          baseStructure.dataSource.set(current.pageIndexKey, current.defaultPageIndex);
          baseStructure.dataSource.refresh();
        }
      },
      enterFolder: function (selectedItemId, name) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        if (typeof current.ListPathControl !== "undefined" && current.ListPathControl !== null) {
          if (name === current.topFolderName) {
            current.ListPathControl.popItem();
          } else {
            current.ListPathControl.pushItem(selectedItemId, name);
          }
        }
      }
    };

    return commonPagesDefinition.mergeListPages(commonPagesDefinition, extensionObject);
  });
})();
