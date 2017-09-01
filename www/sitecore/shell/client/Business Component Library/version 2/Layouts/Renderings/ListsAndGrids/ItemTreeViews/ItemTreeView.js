(function(speak, require, $, _) {
 
  var buildItemUri = function (itemId, database) {
    return {
      itemId: itemId,
      database: database
    };
  };

  // This function is called in context of the control.
  var updateSelectedItemId = function(itemId, itemManager) {
    if (!itemId) {
      var activeNode = this.getActiveNode();
      if (activeNode) {
        activeNode.deactivate();
      }

      this.SelectedNode = "";
      this.SelectedItemPath = "";
      this.SelectedItem = "";
      this.SelectedValue = "";
      return;
    }

    selectItemById.call(this, itemId);
    if (this.getActiveNode() && this.getActiveNode().data.key == itemId) {
      return;
    }
    setGuidPath.call(this, itemId, itemManager, true);
  };

  // This function is called in context of the control.
  var getOptions = function () {
    return {
      database: this.Database,
      language: speak.Context.current().language,
      fields: ["__Hidden"]
    };
  };

  // This function is called in context of the control.
  var setGuidPath = function(guid, itemManager) {
    requestStarted(this);

    var options = getOptions.call(this);
    var that = this;
    itemManager.fetch(guid, options, function(items, result) {
      if (result.result.statusCode === 401) {
        speak.module("bclSession").unauthorized();
        return;
      }
      if (result.result.items.length) {
        var rawLongId = result.result.items[0].LongID,
          path = rawLongId.substring(rawLongId.indexOf(that.RootItemId)); //Path from root down
        if (!that.IsPreLoadItemExpanded) {
          path = path.substring(0, path.lastIndexOf("/")); //Remove last GUID 
        }
        that.loadKeyPath(path);
      }

      requestFinished(that);
    });
  };

  // This function is called in context of the control.
  var isNodeUncheckable = function(templateId) {
    if (!this.CheckableTemplates) {
      return false;
    }
    return this.CheckableTemplates.indexOf(templateId) == -1;
  };

  // This function is called in context of the control.
  var updateVisibility = function() {
    if (this.IsVisible) {
      this.$el.show();
    } else {
      this.$el.hide();
    }
  };

  // This function is called in context of the control.
  var selectItemById = function(itemId) {
    var nodes = this.getRoot().tree;
    if (this.IsPreLoadItemSelected || this.SelectedItemId) {
      nodes.visit(function(childNode) {
        var id = childNode.data.key;
        if (id == itemId) {
          childNode.activate();
          return false; // stop iteration
        }
      });
    }
  };

  // This function is called in context of the control.
  var updateTooltip = function() {
    this.$el.attr('title', this.Tooltip);
  };

  var appendLanguageParameter = function(item) {
    if (item.$icon.indexOf(".ashx") > 0) {
      var languagePostfix = "&la=" + speak.Context.current().language;
      item.$icon += languagePostfix;
      item.$mediaurl += languagePostfix;
    }
  };

  var requestStarted = function(control) {
    control.pendingRequests++;
    control.IsBusy = true;
  };

  var requestFinished = function(control) {
    control.pendingRequests--;
    if (control.pendingRequests <= 0) {
      control.pendingRequests = 0;
      control.IsBusy = false;
    }
  };

  var isSelectionInherited = function(node, checkMode) {
    return node.parent.parent !== null && checkMode === 3 && node.parent.isSelected();
  };

  speak.component(["itemJS", "bclSession", "dynatree", "jQueryPresenter"], function(itemManager) {
    var loadedIds = [];
    var updating = false;

    var buildTreeNode = function(control, item, select) {
      var isUnselectable = isNodeUncheckable.call(control, item.$templateId);

      select = select || _.contains(control.CheckedItemIds, item.$itemId);

      var node = {
        key: item.$itemId,
        title: item.$displayName,
        itemUri: buildItemUri(item.$itemId, item.$database),
        path: item.$path,
        rawItem: item,
        isFolder: item.$hasChildren,
        isLazy: item.$hasChildren,
        unselectable: isUnselectable,
        hideCheckbox: isUnselectable,
        select: select ? true : false
      };

      if (control.ShowIconImage) {
        if (control.ShowSitecoreIcons) {
          appendLanguageParameter(item);
          node.icon = item.$icon;
        }
      } else {
        node.icon = false;
      }

      loadedIds.push(node.key);

      return node;
    };

    var fetchRootItem = function(control, rootId, callback) {
      if (!rootId) {
        return;
      }

      requestStarted(control);

      var options = getOptions.call(control);

      itemManager.fetch(rootId, options, function(item, result) {
        if (result.statusCode === 401) {
          speak.module("bclSession").unauthorized();
          return;
        }

        if (item === null) {
          throw "Item is not found: " + rootId;
        }


        var newNode = buildTreeNode(control, item);

        callback(newNode, item);

        updateCheckedNodes.call(control, control.getRoot().childList[0]);

        requestFinished(control);
      });
    };

    var appendLoadedChildren = function(control, parentNode, childrenNodes) {
      var destArray = [];

      childrenNodes.forEach(function(item) {
        var select = control.CheckMode === 3 ? parentNode.isSelected() : false;
        var newNode = buildTreeNode(control, item, select);
        destArray.push(newNode);
      }, control);

      parentNode.setLazyNodeStatus(DTNodeStatus_Ok);
      parentNode.addChild(destArray);
    };

    // This function is called in context of the control.
    var updateCheckedNodes = function(node) {
      if (updating || !node || !node.tree) {
        return;
      }

      updating = true;

      var checkedItems = [];
      node.tree.getSelectedNodes().forEach(function(dnode) {
        checkedItems.push(dnode.data.rawItem);
      });

      this.CheckedItems = checkedItems;
      this.CheckedValues = _.map(checkedItems, function(item) { return item.$displayName; });

      var loadedCheckedIds = _.map(checkedItems, function(item) { return item.$itemId; });
      var nonLoadedCheckedIds = _.difference(this.CheckedItemIds, loadedIds);
      this.CheckedItemIds = loadedCheckedIds.concat(nonLoadedCheckedIds);

      updating = false;
    };

    // This function is called in context of the control.
    var updateTree = function() {
      if (updating) {
        return;
      }

      updating = true;

      var checkedIds = this.CheckedItemIds;
      var checkMode = this.CheckMode;

      var nodes = this.getRoot().tree;
      nodes.visit(function(childNode) {
        var id = childNode.data.key;
        if (_.contains(checkedIds, id)) {
          if (!childNode.isSelected()) {
            childNode.select();
          }
        } else {
          if (childNode.isSelected() && !isSelectionInherited(childNode, checkMode)) {
            childNode.toggleSelect();
          }
        }
      });

      updating = false;

      if (this.getRoot().childList) {
        updateCheckedNodes.call(this, this.getRoot().childList[0]);
      }
    };

    return {
      name: "ItemTreeView",
      control: "dynatree",
      options:
      [
        { name: "IsCheckModeEnabled", pluginProperty: "checkbox", defaultValue: false }, // Show checkboxes.
        { name: "IsKeyboardSupported", pluginProperty: "keyboard", defaultValue: true }, // Support keyboard navigation.
        { name: "IsAutoCollapse", pluginProperty: "autoCollapse", defaultValue: false }, // Automatically collapse all siblings, when a node is expanded.
        { name: "ClickFolderMode", pluginProperty: "clickFolderMode", defaultValue: 1 }, // 1:select, 2:expand, 3:select and expand
        { name: "CheckMode", pluginProperty: "selectMode", defaultValue: 3 }, // 1:single, 2:multi, 3:multi-hierarchical
        { name: "IsNoLink", pluginProperty: "noLink", defaultValue: false }, // Use <span> instead of <a> tags for all nodes
        { name: "DebugLevel", pluginProperty: "debugLevel", defaultValue: 0 } // 0:quiet, 1:normal, 2:debug
      ],
      events:
      [
        { name: "onActivate", on: "onActivate" }, // Callback(dtnode) when a node is activated.
        { name: "onSelect", on: "onSelect" }, // Callback(flag, dtnode) when a node is (de)selected.
        { name: "onLazyRead", on: "nodeLazyRead" }, // Callback(dtnode) when a lazy node is expanded for the first time.
        { name: "onExpand", on: "nodeExpand" } // Callback(dtnode) when a node is expanded or collapsed.
      ],
      functions:
      [
        { name: "disable" },
        { name: "enable" },
        { name: "getTree" },
        { name: "getRoot" },
        { name: "getActiveNode" }
      ],

      initialize: function () {
        this.defineProperty("IsKeyboardSupported", true);
        this.defineProperty("IsAutoCollapse", false);
        this.defineProperty("DebugLevel", 0);
        this.defineProperty("IsNoLink", false);
        this.defineProperty("IsBusy", false);
        this.$el = $(this.el);

        this.pendingRequests = 0;
      },

      initialized: function() {
        this.CheckedItemIds = this.CheckedItemIds ? this.CheckedItemIds.split("|") : [];

        this.on("change:IsVisible", updateVisibility, this);
        this.on("change:Tooltip", updateTooltip, this);
        this.on('change:SelectedItemId', function () {
          updateSelectedItemId.call(this, this.SelectedItemId, itemManager, true);
        });

        this.on("change:CheckedItemIds", updateTree, this);
      },

      setSelectedItemId: function (itemId) {
        updateSelectedItemId.call(this, itemId, itemManager, true);
        this.SelectedItemId = itemId;
      },

      render: function() {
        var self = this;

        fetchRootItem(this, this.RootItemId, function(rootNode) {
          self.getRoot().addChild(rootNode);

          if (self.PreLoadItem) {
            setGuidPath.call(self, self.PreLoadItem, itemManager, false);
          }

          if (self.PreLoadItem == rootNode.key && self.IsPreLoadItemSelected) {
            selectItemById.call(self, self.PreLoadItem);
          }
        });
      },

      onActivate: function (node) {
        if (node && node.data && node.data.itemUri && node.data.path) {
          this.SelectedNode = node.data;
          this.SelectedItemId = node.data.itemUri.itemId;
          this.SelectedItemPath = node.data.path;
          this.SelectedItem = node.data.rawItem;
          this.SelectedValue = node.data.rawItem.$displayName;
          updateCheckedNodes.call(this, node);
        }
      },

      onSelect: function (flag, node) {
        updateCheckedNodes.call(this, node);
      },

      nodeExpand: function (node) {
        updateCheckedNodes.call(this, node);
      },

      nodeLazyRead: function (node) {

        var itemUri = node.data.itemUri;

        requestStarted(this);

        var self = this;
        var options = getOptions.call(this);

        itemManager.fetchChildren(itemUri.itemId, options, function (items, totalCount, result) {
          if (result.statusCode === 401) {
            speak.module("bclSession").unauthorized();
            return;
          }

          var filteredItems;

          filteredItems = items;
          if (!self.ShowHiddenItems) {
            filteredItems = _.filter(items, function (item) {
              return item.__Hidden !== "1";
            });
          }

          if (self.Templates) {
            var templateList = self.Templates;
            filteredItems = _.filter(filteredItems, function (item) {
              return templateList.indexOf(item.$templateId, 0) !== -1;
            });
          }

          appendLoadedChildren(self, node, filteredItems);

          requestFinished(self);

          if (self.PreLoadPath && self.PreLoadPath.length > 0) {
            self.loadKeyPath();
          }

          var itemIds = _.map(filteredItems, function (item) { return item.$itemId; });

          if (self.SelectedItemId) {
            if (_.indexOf(itemIds, self.SelectedItemId != -1)) {
              selectItemById.call(self, self.SelectedItemId);
            }
          } else {
            if (_.indexOf(itemIds, self.PreLoadItem != -1)) {
              selectItemById.call(self, self.PreLoadItem);
            }
          }

          updateCheckedNodes.call(self, node);
        });
      },

      loadKeyPath: function (guidPath) {
        var separator = "/",
          pathParts,
          currentNodeId,
          path = guidPath || this.PreLoadPath || "",
          tree = this.widget.apply(this.$el, ["getTree"]),
          node;

        pathParts = path.split(separator);
        if (pathParts.length === 0) {
          return;
        }

        for (var i = 0; i < pathParts.length; i++) {
          node = tree.getNodeByKey(pathParts[i]);
          if (!node) {
            break;
          }
          node.expand();
        }

        pathParts = pathParts.slice(i - 1);

        currentNodeId = pathParts.shift();
        if (!currentNodeId) {
          return;
        }

        node = tree.getNodeByKey(currentNodeId);
        if (!node) {
          this.PreLoadPath = "";
          return;
        }

        this.PreLoadPath = pathParts.join(separator);

      },

      reload: function(newRootId, clearSelection) {
        var self = this;

        loadedIds = [];

        if (clearSelection) {
          self.SelectedItemId = "";

          self.CheckedItemIds = [];
          self.CheckedItems = [];
          self.CheckedValues = [];
        }

        fetchRootItem(this, newRootId, function(newNode, item) {
          if (self.SelectedItemPath && self.SelectedItemPath.indexOf(item.$path) < 0) {
            self.SelectedItemId = "";
          }

          self.getRoot().removeChildren();
          self.RootItemId = newRootId;
          self.getRoot().addChild(newNode);

          if (self.SelectedItemId) {
            updateSelectedItemId.call(self, self.SelectedItemId, itemManager, true);
          }
        });
      }
    };
  }, "ItemTreeView");
})(Sitecore.Speak, require, jQuery, _);