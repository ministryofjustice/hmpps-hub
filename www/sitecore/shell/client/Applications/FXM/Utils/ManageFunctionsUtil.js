define([
    "sitecore",
    "/-/speak/v1/FXM/PageMatcherService.js",
    "/-/speak/v1/FXM/ElementPlaceholderService.js",
    "/-/speak/v1/FXM/ElementMatcherService.js"
], function (_sc, _pageMatcherService, _elementPlaceholderService, _elementMatcherService) {

  var viewManager = function (treeview, editClientAction, editPageMatcher, editElementReplacer, validator) {

    this.allowNavigation = true;
    this.treeview = treeview;
    this.editClientActionControl = editClientAction;
    this.editPageMatcherControl = editPageMatcher;
    this.editElementReplacerControl = editElementReplacer;
    this.validator = validator;

    this.updateView = function (selectedItemId, selectedItemTemplateName) {

      var self = this;

      switch (selectedItemTemplateName) {
        case "Click Action":
        case "Submit Action":
        case "Fragment Action":

          _elementMatcherService.fetchEntity(selectedItemId).execute()
              .then(function (data) {
                self.setControls(data, "Click Action");
              })
              .fail(function (err) {
                console.error(err);
              });

          break;
        case "Element Placeholder":
          _elementPlaceholderService.fetchEntity(selectedItemId).execute().then(function (data) {
            self.setControls(data, data.TemplateName);
          }).fail(function (err) {
            console.error(err);
          });
          break;
        case "Page Filter":

          _pageMatcherService.instance.fetchEntity(selectedItemId).execute()
              .then(function (data) {
                self.setControls(data, "Page Filter");
              })
              .fail(function (err) {
                console.error(err);
              });

          break;
        default:
          break;
      }
    }

    this.setControls = function(item, itemTemplate) {
            
      switch (itemTemplate) {
        case "Click Action":
          this.editElementReplacerControl.hide();
          this.editPageMatcherControl.hide();

          this.editClientActionControl.set("item", item);
          this.editClientActionControl.show();
          break;
        case "Element Placeholder":
          this.editClientActionControl.hide();
          this.editPageMatcherControl.hide();

          this.editElementReplacerControl.set("item", item);
          this.editElementReplacerControl.show();
          break;
        case "Page Filter":
          this.editClientActionControl.hide();
          this.editElementReplacerControl.hide();

          this.editPageMatcherControl.set("item", item);
          this.editPageMatcherControl.show();
          break;
        default:
          this.editClientActionControl.hide();
          this.editElementReplacerControl.hide();
          this.editPageMatcherControl.hide();
          break;
      }
    }

    this.isEnabled = function (state) {
      var ctrls = [this.editClientActionControl, this.editElementReplacerControl, this.editPageMatcherControl];
      _.each(ctrls, function(c) {
        c.set('isEnabled', state);
      });
    }

    // utility to bind event to all controls
    this.bindAllEvent = function(event, func, ctx) {
      this.editClientActionControl.on(event, func, ctx);
      this.editElementReplacerControl.on(event, func, ctx);
      this.editPageMatcherControl.on(event, func, ctx);
    }

    // utility to bind event once to all controls
    this.bindAllOnceEvent = function (event, func, ctx) {
      this.editClientActionControl.once(event, func, ctx);
      this.editElementReplacerControl.once(event, func, ctx);
      this.editPageMatcherControl.once(event, func, ctx);
    }

    this.treeviewChange = function(){

      var selectedItemId = this.treeview.get("selectedItemId");
      var selectedItemTemplateName = this.treeview.viewModel.selectedNode().rawItem.$templateName || '';

      this.updateView(selectedItemId, selectedItemTemplateName);
    }
        
    this.onSuccessfullSave = function(sender) {
      var selectedNode = this.treeview.viewModel.getActiveNode();
      if (selectedNode) {
        var name = sender.nameControl().get('text');
        selectedNode.setTitle(name);
      }
    }

    // save event
    this.save = function(){
            
      var rootItemId = this.treeview.get("rootItemId");
      var selectedItemId = this.treeview.get("selectedItemId");

      if (!selectedItemId) {
        this.validator.clear();
        this.validator.showMessageById('{58AE60DB-C805-4022-AFD8-0D72E7E1BD20}');
        return;
      }

      var templateName = "";

      if (selectedItemId != rootItemId) {
        templateName = this.treeview.viewModel.selectedNode().rawItem.$templateName;
      } else {
        this.validator.clear();
        this.validator.showMessageById('{165E6A94-9151-4402-97AA-533CD6CB3A27}');
        return;
      }

      switch (templateName) {
        case "Click Action":
        case "Submit Action":
        case "Fragment Action":
          this.editClientActionControl.saveItem();
          break;
        case "Element Placeholder":
          this.editElementReplacerControl.saveItem();
          break;
        case "Page Filter":
          this.editPageMatcherControl.saveItem();
          break;
        default:
          this.validator.clear();
          this.validator.showMessageById('{0DF43741-4214-412D-8B44-CF5B3D1EC808}');
          break;
      }
            
      return;
    }

    // bind treeview navigation
    this.treeview.on("change:selectedItemId", this.treeviewChange, this);

    // bind node title updates
    this.bindAllEvent("saved", this.onSuccessfullSave, this);

    // bind navigation blocker
    this.bindAllEvent("change:hasChanges", function(ctl) {
      this.allowNavigation = !ctl.get('hasChanges');
    }, this);
        
    this.treeview.set("deactivateHandler", jQuery.proxy(function() {
      return this.allowNavigation;
    }, this));
  }

  return viewManager;
});