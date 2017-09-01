define(["sitecore"], function (sitecore) {
  var global = {},
      fakeLocation = {
        replace: function (path) {
        }
      },
      folderTemplateName = "list folder",
      self;
  if (typeof window !== "undefined") {
    global = window;
  } else {
    global.location = fakeLocation;
  }

  return sitecore.Definitions.App.extend({
    location: {},
    initialized: function () {
      self = this;
      self.CallBackFunction = null;
      self.ExcludeLists = [];
      self.RootId = null;
      self.SelectedId = null;
      self.SelectedItem = null;
      self.InitialSelectedItemId = null;

      self.SelectFolderTreeView.on("change:selectedNode", this.updateDestination, this);
      self.on("select:folder:dialog:button:ok:clicked", function () { self.buttonOk(); }, self);
      self.on("select:folder:dialog:button:cancel:clicked", function () { self.buttonCancel(); }, self);

      self.on("app:loaded", function () {
        sitecore.trigger("dialog:loaded", self);
      });

      sitecore.on("select:folder:dialog:show", function (callback, rootId, selectedItemId, skipItemId) {
        self.showDialog({ callback: callback, rootId: rootId, selectedItemId: selectedItemId, skipItemId: skipItemId });
      }, self);
    },
    updateDestination: function (treeView, selectedNode) {
      var current = self;
      if (typeof current === "undefined" || current === null) {
        current = this;
      }
      var flag = false;
      if (typeof selectedNode !== "undefined" && selectedNode !== null) {
        if (typeof selectedNode.rawItem !== "undefined" && selectedNode.rawItem !== null) {
          if (selectedNode.rawItem.$templateName.toString().toLowerCase() === folderTemplateName) {
            flag = true;
          }
        }
        else if (selectedNode.isFolder === true) {
          flag = true;

        }
        if (flag) {
          current.ButtonOK.set("isEnabled", true);
          current.SelectedItem = selectedNode.rawItem;
          current.SelectedId = (selectedNode.rawItem !== undefined) ? selectedNode.rawItem.itemId : selectedNode.key;
        }
      }
    },
    showDialog: function (dialogParams) {
      var current = self;
      if (typeof current === "undefined" || current === null) {
        current = this;
      }
      var callback = dialogParams.callback;
      var rootId = dialogParams.rootId;
      var selectedItemId =dialogParams.selectedItemId;
      var skipItemId = dialogParams.skipItemId;

      if (typeof callback != "undefined" && callback != null && typeof callback == "function") {
        current.CallBackFunction = callback;
      }
      if (typeof rootId != "undefined" && rootId != null && rootId != "") {
        current.RootId = rootId;
      }
      if (typeof selectedItemId != "undefined" && selectedItemId != null && selectedItemId != "") {
        current.InitialSelectedItemId = selectedItemId;
        // TODO : We need to expand tree and select the selectedItemId on showDialog
        //current.SelectFolderTreeView.set("pathToLoad", selectedItemPath);
        //current.SelectFolderTreeView.set("selectedItemPath", selectedItemPath);
        //current.SelectFolderTreeView.viewModel.loadKeyPath();
      }
      if (typeof skipItemId != "undefined" && skipItemId != null && skipItemId != "") {
        current.SelectFolderTreeView.set("skipItemId", skipItemId);
      }

      self.SelectFolderTreeView.viewModel.reloadTree();
      current.SelectFolderDialog.show();
    },
    buttonOk: function () {
      var current = self;
      if (typeof current === "undefined" || current === null) {
        current = this;
      }
      current.hideDialog();
      if (current.CallBackFunction) {
        current.CallBackFunction(current.SelectedId, current.SelectedItem);
      }

    },
    buttonCancel: function () {
      var current = self;
      if (typeof current === "undefined" || current === null) {
        current = this;
      }
      current.hideDialog();
    },
    hideDialog: function () {
      var current = self;
      if (typeof current === "undefined" || current === null) {
        current = this;
      }
      current.SelectFolderDialog.hide();
    }
  });
});