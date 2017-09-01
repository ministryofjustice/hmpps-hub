define(["sitecore"], function (Sitecore) {
  var navigationTreeViewPageCode = Sitecore.Definitions.App.extend({
    structure: [],

    currentItemId: '',

    rootItemId: "{0DE95AE4-41AB-4D01-9EB0-67441B7C2450}",

    initialized: function () {
      var that = this;

      this.runAction("getRoot").visit(function (node) {
        window.setInterval(function() { node.expand(true); }, 50);
      });

      this.currentItemId = window.top.ExperienceEditor.getContext().instance.currentContext.itemId;


      this.initializeStructure();
      this.initializeTree(that);
    },

    runAction: function (action) {
      return $("div[data-sc-id='NavigationTreeView']").dynatree(action);
    },

    initializeStructure: function() {
      var context = window.top.ExperienceEditor.generateDefaultContext();
      context.currentContext.itemId = this.currentItemId;

      var that = this;

      window.top.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Breadcrumb.GetStructure", function (response) {
        if (!response.responseValue.value) {
          return;
        }

        that.structure = response.responseValue.value;
      }).execute(context);
    },

    initializeTree: function(context) {
      this.runAction({
        onActivate: function (node) {
          if (node.data.isDisabledState) { 
            return;
          }

          context.navigateToItem(node.data.key);
        },

        onCreate: function (node) {
          context.setNodeActiveStatus(node);
          context.checkExpandingStatus(node, context.structure, decodeURIComponent(context.currentItemId));
        },

        onRender: function(node) {
          if (node.data.key == context.rootItemId) {
            var rootElement = node.span;
            if (!rootElement) {
              return;
            }

            var $root = $(rootElement);
            $root.addClass("disabledItem");

            node.data.isDisabledState = true;
          }
        }
      });
    },

    setNodeActiveStatus: function (node) {
      node.data.isDisabledState = false;
      var context = window.top.ExperienceEditor.generateDefaultContext();
      context.currentContext.value = node.data.key;

      window.top.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Item.HasPresentation", function (response) {
        if (!response.responseValue.value) {
          node.data.addClass = "disabledItem";

          node.data.isDisabledState = true;
        }
      }).execute(context);
    },

    checkExpandingStatus: function (node, structure, currentItemId) {
      var itemExistsInStructure = this.isItemExistsInStructure(node.data.key, structure);
      if (!itemExistsInStructure) {
        return;
      }

      var nodeIsCurrentItem = node.data.key == currentItemId;

      if (nodeIsCurrentItem) {
        node.data.addClass = "dynatree-active";

        return;
      }
      node.expand(true);
    },

    isItemExistsInStructure: function(itemId, structure) {
      for (var i = 0; i < structure.length; i++) {
        if (structure[i].ItemId == itemId) {
          return true;
        }
      }

      return false;
    },

    navigateToItem: function (itemId) {
      var editorContext = window.top.ExperienceEditor;
      editorContext.handleIsModified();
      editorContext.navigateToItem(itemId);
    }
  });

  return navigationTreeViewPageCode;
});