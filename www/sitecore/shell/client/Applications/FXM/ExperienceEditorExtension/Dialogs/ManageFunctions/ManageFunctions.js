define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/Validation.js",
    "/-/speak/v1/FXM/ManageFunctionsUtil.js"
], function (_sc, _clientBeacon, _validator, _viewManager) {
  return _sc.Definitions.App.extend({
    initialize: function () {
      this.shouldRefresh = false;
    },

    initialized: function () {
      this.queryString = _sc.Helpers.url.getQueryParameters(location.href);

      this.validator = new _validator(this.MessageBarDataSource, this.DialogMessageBar);

      this.viewManager = new _viewManager(this.FunctionTreeview, this.EditClientActionControl, this.EditPageMatcherControl, this.EditElementReplacerControl, this.validator);
      this.viewManager.bindAllEvent("saved", this.saveSuccess, this);
      this.viewManager.bindAllEvent("saveerror", this.saveError, this);

      this.selectorPath = this.queryString.selector;

      this.FunctionTreeview.set('whitelist', '*');
      this.FunctionTreeview.set('templateswhitelist', '*');

      this.FunctionTreeview.set('rootItemId', this.getRoot());
      this.FunctionTreeview.on("cancel:activate", this.navigateError, this);

      this.on("button:save", function () {
        this.save();
      }, this);

      this.on("button:saveandclose", function () {
        this.viewManager.bindAllOnceEvent("saved", this.close, this);

        this.save();
      }, this);

      this.on("button:close", function () {
        this.close();
      }, this);
    },

    getRoot: function () {
      var domainItem = _clientBeacon.domainItem();
      if (domainItem) {
        return domainItem;
      }

      return this.queryString.root;
    },

    save: function () {
      this.validator.clear();
      this.viewManager.save();
    },

    saveSuccess: function () {
      this.validator.showMessageById('{15CB286C-D247-47D3-8558-9A90E4A44531}');
      this.shouldRefresh = true;
    },

    saveError: function () {
      this.validator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', 'Error');
    },

    navigateError: function () {
      this.validator.clear();
      this.validator.showMessageById('{75CADB08-EE73-4D00-A3CF-C7988B29143A}');
    },

    close: function () {
      this.closeDialog(this.shouldRefresh);
    }
  });
});