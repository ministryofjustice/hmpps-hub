(function () {
  // The trick to test in node and in browser.
  var dependencies = (typeof window !== "undefined")
    ? ["/-/speak/v1/listmanager/commonPagesDefinition.js", "/-/speak/v1/listmanager/commonListPagesDefinition.js"]
    : ["../commonPagesDefinition", "../commonListPagesDefinition"];
  define(dependencies, function (commonPagesDefinition, commonListPagesDefinition) {
    var createFolderPromptText = "Enter a name for the folder. Please use permitted characters A-Z, a-z, 1-9.",
        createFolderNotification = "The folder has been created.",
        createFolderError = "The folder has not been created.",
        self;

    var extensionObject = {
      initializeActionsExtended: function () {
        self = this;
        this.on("rename:folder", this.onRenameFolder, this);
        this.on("delete:folder", this.onDeleteFolder, this);
        this.on("move:folder", this.onMoveFolder, this);
        this.on("create:folder", this.onCreateFolder, this);
      },
      initializeSpecificControlsExtended: function () {
        this.ListPathControl.reset();
        this.ListPathControl.on("change:SelectedItemId", this.onListPathChanged, this);
      },
      initializeDataSourceExtended: function (baseStructure) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        baseStructure.dataSource.on("folderSelected", current.enterFolder, current);
      },
      onRenameFolder: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var targetControl = current.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          var selectedItemId = targetControl.get("selectedItemId");
          if (selectedItemId !== "") {
            var selectedItem = targetControl.get("selectedItem");
            var selectedItemType = selectedItem.get("Type");
            var selectedItemName = selectedItem.get("Name");
            if (selectedItemType.toString() === current.folderType) {
              var text = current.StringDictionary.get("Enter a new name for the folder.");
              var folderNewName = prompt(text, selectedItemName);
              if (folderNewName !== null && folderNewName !== selectedItemName && folderNewName !== "") {
                folderNewName = encodeURIComponent(folderNewName);
                var urlQuery = "/" + encodeURI(selectedItemId) + "/RenameFolder?newName=" + folderNewName;
                current.callController(parameters, urlQuery,
                  function () {
                    current.onActionSuccess("The folder has been renamed.", targetControl);
                  },
                  function (status, statusText) {
                    current.showDefaultError(status, statusText, current.StringDictionary.get("The folder has not been renamed."), current.ListMessageBar);
                  });
              }
            }
          }
        }
      },
      onDeleteFolder: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.onMoveOrDelete(
          parameters,
          [current.folderType.toLowerCase()],
          "The folder, including all the lists that it contains, will be deleted. This cannot be undone. Do you want to continue?",
          "DeleteFolder/?folderId=",
          "The folder has been deleted.",
          "The folder has not been deleted.");
      },
      onMoveFolder: function (parameters) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (itemId !== undefined) {
            current.onMoveOrDelete(
              parameters,
              [current.folderType.toLowerCase()],
              "",
              "MoveFolder/?destinationId=" + itemId + "&folderId=",
              "The folder has been moved.",
              "The folder has not been moved.");
          }
        };
        var selectedItemId = current.getSelectedItemId(parameters);
        if (selectedItemId != "") {
          var selectedItemType = current.getSelectedItemType(parameters).toLowerCase();
          if (selectedItemType === current.folderType.toLowerCase()) {
            current.selectFolder(callback, current.RootPath, null, selectedItemId);
          }
        }
      },
      onCreateFolder: function (parameters, folderName) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var targetControlName = parameters.control,
            targetDataSourceName = parameters.dataSource,
            targetControl = current[targetControlName],
            targetDataSource = current[targetDataSourceName];
        if (typeof targetControl !== "undefined" && targetControl !== null && targetDataSource !== null && typeof targetDataSource !== "undefined") {
          var destination = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(targetDataSource.get(current.folderParameterKey), "");
          if (destination === "") {
            destination = "~";
          }
          if (typeof folderName === "undefined") {
            var text = current.StringDictionary.get(createFolderPromptText);
            folderName = prompt(text, "");
          }
          if (folderName !== null && folderName !== "") {
            folderName = encodeURIComponent(folderName);
            var actionUrl = "/" + destination + "/CreateFolder?folderName=" + folderName;
            current.callController(parameters, actionUrl,
              function () {
                current.onActionSuccess(createFolderNotification, targetControl);
              },
              function (status, statusText) {
                current.showDefaultError(status, statusText, current.StringDictionary.get(createFolderError), current.ListMessageBar);
              });
          } else if (folderName === "") {
            current.showError(current.StringDictionary.get(createFolderError));
          }
        }
      }
    };

    return commonPagesDefinition.mergeListPages(commonListPagesDefinition, extensionObject);
  });
})();